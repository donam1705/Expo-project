import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee, EmployeeLookupResult, OdooResponse } from '../types';

const EMPLOYEE_CACHE_PREFIX = 'employee_cache_';
const EMPLOYEE_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

class ApiService {
  private odooUrl = '';
  private database = '';
  private username = '';
  private password = '';

  private axiosInstance: AxiosInstance | null = null;
  private isAuthenticated = false;
  private requestId = 0;
  private isSyncing = false;



  setConfig(url: string, db: string, user: string, pass: string) {
    this.odooUrl = url;
    this.database = db;
    this.username = user;
    this.password = pass;

    this.axiosInstance = axios.create({
      baseURL: this.odooUrl,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }

  isConfigured() {
    return !!this.axiosInstance;
  }

  async authenticate(): Promise<{ success: boolean; error?: string }> {
    if (!this.axiosInstance) return { success: false, error: 'Chưa cấu hình' };


    try {
      const response = await this.axiosInstance.post<OdooResponse>('/web/session/authenticate', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.database,
          login: this.username,
          password: this.password,
        },
        id: ++this.requestId,
      });

      if (response.data.error) {
        return { success: false, error: response.data.error.message };
      }

      if (response.data.result) {
        this.isAuthenticated = true;
        return { success: true };
      }
      return { success: false, error: 'Xác thực thất bại' };
    } catch (error) {
      return { success: false, error: 'Lỗi mạng' };
    }
  }

  async findEmployeeByNfcTag(tagId: string): Promise<EmployeeLookupResult> {
    const cached = await this.getEmployeeFromCache(tagId);

    if (!this.axiosInstance || !this.isAuthenticated) {
      if (cached) {
        return { success: true, employee: cached, fromCache: true };
      }
      return { success: false, error: 'Chưa xác thực hoặc mất kết nối.' };
    }

    try {
      const response = await this.axiosInstance.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.employee',
            method: 'search_read',
            args: [[['barcode', '=', tagId]]],
            kwargs: {
              fields: ['id', 'name', 'barcode', 'department_id', 'job_id', 'image_128'],
              limit: 1,
            },
          },
          id: ++this.requestId,
        }
      );

      if (response.data.error) {
        if (cached) return { success: true, employee: cached, fromCache: true };
        return { success: false, error: response.data.error.message };
      }

      const employees = response.data.result as any[];
      if (!employees || employees.length === 0) {
        await AsyncStorage.removeItem(`${EMPLOYEE_CACHE_PREFIX}${tagId}`);
        return { success: false, error: `Thẻ ${tagId} không tồn tại.` };
      }
      const employeeData = employees[0];
      const employee: Employee = {
        id: employeeData.id,
        name: employeeData.name,
        employee_code: employeeData.barcode || employeeData.identification_id || employeeData.id.toString(),
        department: this.extractRelationName(employeeData.department_id),
        position: this.extractRelationName(employeeData.job_id),
        avatar: employeeData.image_128,
        barcode: employeeData.barcode || employeeData.identification_id || undefined,
      };

      await this.saveEmployeeToCache(tagId, employee);
      return { success: true, employee };
    } catch (error) {
      if (cached) return { success: true, employee: cached, fromCache: true };
      return { success: false, error: 'Lỗi mạng và không tìm thấy dữ liệu.' };
    }
  }

  async getAllEmployees(): Promise<{ success: boolean; employees?: Employee[]; error?: string }> {
    if (!this.axiosInstance || !this.isAuthenticated) {
      return { success: false, error: 'Cần kết nối mạng để tải danh sách nhân viên.' };
    }

    try {
      const response = await this.axiosInstance.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.employee',
            method: 'search_read',
            args: [[]],
            kwargs: {
              fields: ['id', 'name', 'barcode', 'identification_id', 'department_id', 'job_id', 'image_128'],
              order: 'name asc',
            },
          },
          id: ++this.requestId,
        }
      );

      if (response.data.error) return { success: false, error: response.data.error.message };

      const employees = (response.data.result as any[]).map(emp => ({
        id: emp.id,
        name: emp.name,
        employee_code: emp.barcode || emp.identification_id || emp.id.toString(),
        department: this.extractRelationName(emp.department_id),
        position: this.extractRelationName(emp.job_id),
        avatar: emp.image_128,
        barcode: emp.barcode || emp.identification_id || undefined,
      }));

      return { success: true, employees };
    } catch (error) {
      return { success: false, error: 'Lỗi mạng khi tải danh sách' };
    }
  }

  async updateEmployeeNfcTag(employeeId: number, tagId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.axiosInstance || !this.isAuthenticated) {
      return { success: false, error: 'Cần kết nối mạng để cập nhật.' };
    }

    try {
      const response = await this.axiosInstance.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.employee',
            method: 'write',
            args: [[employeeId], { barcode: tagId }],
            kwargs: {},
          },
          id: ++this.requestId,
        }
      );

      if (response.data.error) return { success: false, error: response.data.error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Lỗi mạng khi cập nhật thẻ' };
    }
  }

  async getAttendanceHistory(employeeId: number, limit = 5): Promise<{
    success: boolean;
    records?: { check_in: string; check_out: string }[];
    error?: string;
  }> {
    if (!this.axiosInstance || !this.isAuthenticated) {
      return { success: false, error: 'Chưa xác thực.' };
    }
    try {
      const res = await this.axiosInstance.post<OdooResponse>('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'hr.attendance',
          method: 'search_read',
          args: [[['employee_id', '=', employeeId]]],
          kwargs: {
            fields: ['check_in', 'check_out'],
            order: 'check_in desc',
            limit,
          },
        },
        id: ++this.requestId,
      });
      if (res.data.error) return { success: false, error: res.data.error.message };
      return { success: true, records: res.data.result as any[] };
    } catch {
      return { success: false, error: 'Lỗi mạng khi tải lịch sử.' };
    }
  }

  private formatOdooDate(dateString: string | undefined): string {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  async recordAttendance(
    employeeId: number,
    nfcTagId: string,
    status: 'check_in' | 'check_out',
    timestamp?: string
  ): Promise<{ success: boolean; error?: string; appliedStatus?: 'check_in' | 'check_out' }> {
    if (!this.axiosInstance || !this.isAuthenticated) {
      return { success: false, error: 'Chưa xác thực hoặc chế độ ngoại tuyến.' };
    }

    try {
      const odooTime = this.formatOdooDate(timestamp);
      const searchRes = await this.axiosInstance.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.attendance',
            method: 'search_read',
            args: [[['employee_id', '=', employeeId], ['check_out', '=', false]]],
            kwargs: { fields: ['id'], limit: 1 },
          },
          id: ++this.requestId,
        }
      );

      const openRecords = searchRes.data.result as any[];
      const hasOpenAttendance = openRecords && openRecords.length > 0;

      if (!hasOpenAttendance) {
        return this.performCheckIn(employeeId, odooTime);
      } else {
        return this.performCheckOut(employeeId, openRecords[0].id, odooTime);
      }
    } catch (error: any) {
      return { success: false, error: 'Lỗi đồng bộ trạng thái Odoo' };
    }
  }

  private async performCheckIn(employeeId: number, odooTime: string) {
    try {
      const response = await this.axiosInstance!.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.attendance',
            method: 'create',
            args: [{ employee_id: employeeId, check_in: odooTime }],
            kwargs: {},
          },
          id: ++this.requestId,
        }
      );

      if (response.data.error) {
        const errorMsg = response.data.error.data?.message || response.data.error.message;
        if (errorMsg && (errorMsg.includes('đã check-in') || errorMsg.includes('already checked in'))) {
          const search = await this.axiosInstance!.post<OdooResponse>('/web/dataset/call_kw', {
            jsonrpc: '2.0', method: 'call', params: {
              model: 'hr.attendance', method: 'search_read',
              args: [[['employee_id', '=', employeeId], ['check_out', '=', false]]],
              kwargs: { fields: ['id'], limit: 1 }
            }, id: ++this.requestId
          });
          const records = search.data.result as any[];
          if (records && records.length > 0) return this.performCheckOut(employeeId, records[0].id, odooTime);
        }
        return { success: false, error: errorMsg };
      }
      return { success: true, appliedStatus: 'check_in' as const };
    } catch (e) {
      return { success: false, error: 'Mất kết nối Odoo' };
    }
  }

  private async performCheckOut(employeeId: number, attendanceId: number, odooTime: string) {
    try {
      const response = await this.axiosInstance!.post<OdooResponse>(
        '/web/dataset/call_kw',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.attendance',
            method: 'write',
            args: [[attendanceId], { check_out: odooTime }],
            kwargs: {},
          },
          id: ++this.requestId,
        }
      );

      if (response.data.error) return { success: false, error: response.data.error.message };
      return { success: true, appliedStatus: 'check_out' as const };
    } catch (e) { return { success: false, error: 'Mất kết nối Odoo' }; }
  }

  private extractRelationName(relationField: any): string | undefined {
    return Array.isArray(relationField) && relationField.length === 2 ? relationField[1] : undefined;
  }

  private async saveEmployeeToCache(tagId: string, employee: Employee) {
    try {
      const cacheEntry = { employee, cachedAt: Date.now() };
      await AsyncStorage.setItem(`${EMPLOYEE_CACHE_PREFIX}${tagId}`, JSON.stringify(cacheEntry));
    } catch (e) {
      console.warn('lỗi lưu cache', e);
    }
  }

  private async getEmployeeFromCache(tagId: string): Promise<Employee | null> {
    try {
      const raw = await AsyncStorage.getItem(`${EMPLOYEE_CACHE_PREFIX}${tagId}`);
      if (!raw) return null;
      const cacheEntry = JSON.parse(raw);
      if (Date.now() - cacheEntry.cachedAt > EMPLOYEE_CACHE_TTL) {
        await AsyncStorage.removeItem(`${EMPLOYEE_CACHE_PREFIX}${tagId}`);
        return null;
      }
      return cacheEntry.employee;
    } catch (e) {
      return null;
    }
  }

  async syncOfflineQueue() {
    if (!this.isAuthenticated || this.isSyncing) return;

    try {
      this.isSyncing = true;
      const QUEUE_KEY = 'attendance_offline_queue';
      const data = await AsyncStorage.getItem(QUEUE_KEY);
      if (!data) {
        this.isSyncing = false;
        return;
      }

      const queue = JSON.parse(data);
      if (!Array.isArray(queue) || queue.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`Bắt đầu đồng bộ ${queue.length} lượt điểm danh offline...`);
      const syncedIds: number[] = [];

      for (const record of queue) {
        const res = await this.recordAttendance(record.employee_id, record.nfc_tag_id, record.status, record.timestamp);
        if (res.success) {
          console.log(`Đã đồng bộ thành công record ID: ${record.id}`);
          syncedIds.push(record.id);
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          console.warn(`Lỗi sync record ${record.id}:`, res.error);
          if (res.error && !res.error.includes('Lỗi kết nối')) {
            syncedIds.push(record.id);
          }
        }
      }

      const remaining = queue.filter(q => !syncedIds.includes(q.id));
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));

    } catch (e) {
      console.warn('Lỗi đồng bộ offline', e);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const apiService = new ApiService();
