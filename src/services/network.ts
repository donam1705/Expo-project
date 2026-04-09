import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetworkCallback = (status: { isConnected: boolean; isInternetReachable: boolean }) => void;

class NetworkService {
  private listeners: NetworkCallback[] = [];
  private currentStatus = { isConnected: false, isInternetReachable: false };

  constructor() {
    NetInfo.addEventListener(state => {
      this.currentStatus = {
        isConnected: !!state.isConnected,
        isInternetReachable: !!state.isInternetReachable,
      };
      this.listeners.forEach(listener => listener(this.currentStatus));
    });
  }

  async getNetworkStatus() {
    const state = await NetInfo.fetch();
    return {
      isConnected: !!state.isConnected,
      isInternetReachable: !!state.isInternetReachable,
    };
  }

  onNetworkChange(callback: NetworkCallback): () => void {
    this.listeners.push(callback);
    callback(this.currentStatus);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}

export const networkService = new NetworkService();
