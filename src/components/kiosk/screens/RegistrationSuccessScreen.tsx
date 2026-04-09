import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';

export const RegistrationSuccessScreen: React.FC<{
  layout: 'landscape' | 'portrait';
}> = ({ layout }) => {
  const { registrationTargetName } = useKiosk();
  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <View style={[styles.successIconOuter, { backgroundColor: Theme.colors.status.check_in_bg }]}>
        <View style={[styles.successIconInner, { backgroundColor: Theme.colors.success }]}>
          <MaterialCommunityIcons name="account-check" size={40} color={Theme.colors.text.light} />
        </View>
      </View>
    </View>
  );

  const cardSection = (
    <View style={[styles.resultCard, { borderColor: Theme.colors.success, borderWidth: 2 }]}>
      <View style={styles.resultTitleContainer}>
        <ThemedText style={[styles.resultMainTitle, { color: Theme.colors.success }]}>
          Gán Thẻ Thành Công!
        </ThemedText>
        <ThemedText style={styles.resultSubtitle}>
          Nhân viên {registrationTargetName} đã được liên kết với thẻ NFC này.
        </ThemedText>
      </View>

      <View
        style={{
          width: '100%',
          padding: Theme.spacing.md,
          backgroundColor: Theme.colors.status.check_in_bg,
          borderRadius: Theme.borderRadius.lg,
          marginTop: Theme.spacing.lg,
          alignItems: 'center',
        }}
      >
        <ThemedText
          style={{ color: Theme.colors.success, fontWeight: Theme.typography.fontWeight.heavy }}
        >
          Hệ thống sẽ tự quay lại sau vài giây...
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ScreenLayout
      layout={layout}
      headerSection={headerSection}
      cardSection={cardSection}
    />
  );
};
