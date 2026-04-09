export interface Employee {
  id: number;
  name: string;
  employee_code: string;
  department?: string;
  position?: string;
  is_admin?: boolean;
  avatar?: string;
  barcode?: string;
}

export interface AttendanceRecord {
  id?: number;
  employee_id: number;
  nfc_tag_id?: string;
  timestamp: string;
  status: 'check_in' | 'check_out';
  synced: boolean;
}

export interface EmployeeLookupResult {
  success: boolean;
  error?: string;
  employee?: Employee;
  fromCache?: boolean;
}

export interface OdooResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
