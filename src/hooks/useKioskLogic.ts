import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';
import { offlineQueueService } from '../services/offlineQueue';
import { networkService } from '../services/network';
import { Employee } from '../types';

export const useKioskLogic = () => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [tag, setTag] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [unregisteredTagId, setUnregisteredTagId] = useState<string | null>(null);
  const [isAdminAuthMode, setIsAdminAuthMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [registrationTargetName, setRegistrationTargetName] = useState('');
  const [selectedEmployeeForUpdate, setSelectedEmployeeForUpdate] = useState<Employee | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<{ check_in: string; check_out: string }[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [lastStatus, setLastStatus] = useState<'check_in' | 'check_out' | null>(null);

  const isAdminAuthActiveRef = useRef(isAdminAuthMode);
  useEffect(() => {
    isAdminAuthActiveRef.current = isAdminAuthMode;
  }, [isAdminAuthMode]);

  const pulseAnim = useRef(new Animated.Value(0)).current;

  const readTag = async (forcedMode?: 'ADMIN_AUTH' | null) => {
    try {
      if (isScanning) return;
      setIsScanning(true);
      setError(null);
      setEmployee(null);
      setTag(null);
      setAttendanceHistory([]);

      await NfcManager.cancelTechnologyRequest().catch(() => { });
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tagInfo = await NfcManager.getTag();
      setTag(tagInfo);

      const currentIsAdminMode = isAdminAuthActiveRef.current;

      if (tagInfo?.id) {
        const lookup = await apiService.findEmployeeByNfcTag(tagInfo.id);

        if (currentIsAdminMode) {
          const isActuallyAdmin = lookup.success && lookup.employee && (
            lookup.employee.id === 1 ||
            lookup.employee.name.toLowerCase().includes('admin')
          );

          if (isActuallyAdmin) {
            setIsAdminAuthMode(false);
            setShowAddForm(true);
            loadAllEmployees();
            return;
          } else {
            setError('NOT_AN_ADMIN');
            return;
          }
        }

        if (!lookup.success || !lookup.employee) {
          setError('CARD_NOT_RECOGNIZED');
          setUnregisteredTagId(tagInfo.id);
          return;
        }

        setEmployee(lookup.employee);
        const statusKey = `employee_status_${lookup.employee.id}`;
        const previousStatus = await AsyncStorage.getItem(statusKey);
        let newStatus: 'check_in' | 'check_out' = previousStatus === 'check_in' ? 'check_out' : 'check_in';

        const record = await apiService.recordAttendance(lookup.employee.id, tagInfo.id, newStatus);
        const finalStatus = record.appliedStatus || newStatus;

        if (record.success) {
          await AsyncStorage.setItem(statusKey, finalStatus);
        } else {
          await offlineQueueService.addToQueue({
            employee_id: lookup.employee.id,
            nfc_tag_id: tagInfo.id,
            timestamp: new Date().toISOString(),
            status: finalStatus,
            synced: false,
          });
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        const newEntry = {
          uniqueId: Date.now() + Math.random(),
          id: lookup.employee!.id,
          name: lookup.employee!.name,
          avatar: lookup.employee!.avatar,
          date: dateStr,
          inTime: finalStatus === 'check_in' ? timeStr : null,
          outTime: finalStatus === 'check_out' ? timeStr : null,
        };

        const updatedActs = [newEntry, ...recentActivity].slice(0, 10);
        setRecentActivity(updatedActs);
        setLastStatus(finalStatus as any);
        AsyncStorage.setItem('recent_activity_main', JSON.stringify(updatedActs)).catch(() => { });

        apiService.getAttendanceHistory(lookup.employee.id, 5).then(h => {
          if (h.success && h.records) setAttendanceHistory(h.records);
        });

        setCountdown(10);
      }
    } catch (ex: any) {
      if (ex !== 'cancelled') setError('OPERATION_FAILED');
    } finally {
      setIsScanning(false);
      await NfcManager.cancelTechnologyRequest().catch(() => { });
    }
  };

  const loadAllEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const res = await apiService.getAllEmployees();
      if (res.success && res.employees) setAllEmployees(res.employees);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const handleUpdateEmployeeNfc = async (emp: Employee) => {
    if (!unregisteredTagId) return;
    setIsUpdating(true);
    try {
      const res = await apiService.updateEmployeeNfcTag(emp.id, unregisteredTagId);
      if (res.success) {
        setRegistrationTargetName(emp.name);
        setShowRegSuccess(true);
        setTimeout(() => {
          setShowRegSuccess(false);
          setShowAddForm(false);
          setUnregisteredTagId(null);
          setSearchQuery('');
          setRegistrationTargetName('');
          setSelectedEmployeeForUpdate(null);
          readTag();
        }, 10000);
      } else {
        alert('Lỗi: ' + res.error);
      }
    } catch (e) {
      alert('Lỗi kết nối.');
    } finally {
      setIsUpdating(false);
    }
  };

  const resetToScanning = () => {
    setShowRegSuccess(false);
    setShowAddForm(false);
    setUnregisteredTagId(null);
    setSearchQuery('');
    setRegistrationTargetName('');
    setSelectedEmployeeForUpdate(null);
    setEmployee(null);
    setError(null);
    readTag();
  };

  const handleAddUser = async () => {
    setIsAdminAuthMode(true);
    readTag('ADMIN_AUTH');
  };

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isScanning]);

  useEffect(() => {
    const url = 'https://odoo.trucdev.com';
    const db = 'wsodoo';
    const user = 'trucdev@gmail.com';
    const pass = 'vin@2025!';
    apiService.setConfig(url, db, user, pass);
    apiService.authenticate();

    AsyncStorage.getItem('recent_activity_main').then(data => {
      if (data) setRecentActivity(JSON.parse(data));
    });

    const unsub = networkService.onNetworkChange((status) => {
      const reachable = !!status.isInternetReachable;
      setIsOffline(!reachable);
      if (reachable) apiService.syncOfflineQueue();
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    async function checkNfc() {
      try {
        await NfcManager.start().catch(() => { });
        const supported = await NfcManager.isSupported();
        if (supported) {
          const enabled = await NfcManager.isEnabled();
          setIsEnabled(enabled);
        }
      } catch (ex) { }
    }
    checkNfc();
  }, []);

  useEffect(() => {
    const shouldBeScanning = !isScanning && !employee && !error && !isAdminAuthMode && !showAddForm && isEnabled;
    if (shouldBeScanning) {
      const timeout = setTimeout(() => readTag(), 500);
      return () => clearTimeout(timeout);
    }
  }, [isScanning, employee, error, isAdminAuthMode, showAddForm, isEnabled]);

  useEffect(() => {
    let interval: any;
    if (employee || (error && error !== 'SIMULATED_OFFLINE' && !isAdminAuthMode && !showAddForm)) {
      setCountdown(10);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (employee) setEmployee(null);
            if (error) setError(null);
            setAttendanceHistory([]);
            readTag();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [employee, error, isAdminAuthMode, showAddForm]);

  return {
    pulseAnim, error, employee, isAdminAuthMode, showAddForm, showRegSuccess, isOffline,
    recentActivity, unregisteredTagId, allEmployees, searchQuery, isLoadingEmployees,
    isUpdating, registrationTargetName, selectedEmployeeForUpdate, attendanceHistory, countdown, lastStatus,
    setError, readTag, handleAddUser, setIsAdminAuthMode, setEmployee,
    setSelectedEmployeeForUpdate, handleUpdateEmployeeNfc, setShowAddForm, setUnregisteredTagId, setSearchQuery, resetToScanning
  };
};
