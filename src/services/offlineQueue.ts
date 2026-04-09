import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceRecord } from '../types';

const QUEUE_KEY = 'attendance_offline_queue';

class OfflineQueueService {
  async getQueue(): Promise<AttendanceRecord[]> {
    try {
      const data = await AsyncStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Lỗi lấy hàng đợi', e);
      return [];
    }
  }

  async addToQueue(record: AttendanceRecord): Promise<{ success: boolean }> {
    try {
      const queue = await this.getQueue();
      queue.push({
        ...record,
        id: Date.now(),
        synced: false,
      });
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      return { success: true };
    } catch (e) {
      console.warn('Lỗi thêm vào hàng đợi', e);
      return { success: false };
    }
  }

  async removeQueueItems(ids: number[]) {
    try {
      const queue = await this.getQueue();
      const filtered = queue.filter(q => q.id && !ids.includes(q.id));
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.warn('Lỗi xóa hàng đợi', error);
    }
  }
}

export const offlineQueueService = new OfflineQueueService();
