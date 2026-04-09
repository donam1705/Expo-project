import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../styles/kioskStyles';
import { useKiosk } from '../../contexts/KioskContext';
import { AdminRequiredScreen } from './screens/AdminRequiredScreen';
import { ScanningScreen } from './screens/ScanningScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { FailureScreen } from './screens/FailureScreen';
import { AddEmployeeFormScreen } from './screens/AddEmployeeFormScreen';
import { RegistrationSuccessScreen } from './screens/RegistrationSuccessScreen';

export const MainLayout: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const layout = width > height ? 'landscape' : 'portrait';

  const {
    error, employee, isAdminAuthMode, showAddForm, showRegSuccess, isOffline
  } = useKiosk();

  const renderScreen = () => {
    if (showRegSuccess) return <RegistrationSuccessScreen layout={layout} />;
    if (showAddForm) return <AddEmployeeFormScreen layout={layout} />;
    if (isAdminAuthMode) return <AdminRequiredScreen layout={layout} />;
    if (employee) return <SuccessScreen layout={layout} />;
    if (error) return <FailureScreen layout={layout} />;
    return <ScanningScreen layout={layout} />;
  };

  return (
    <ThemedView style={[styles.container, { flex: 1 }]}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <ThemedText style={styles.offlineBannerText}>Đang Offline (Mất Mạng)</ThemedText>
        </View>
      )}
    </ThemedView>
  );
};
