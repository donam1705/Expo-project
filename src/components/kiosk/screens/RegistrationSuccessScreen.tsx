import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';
import { ms } from '../../../utils/scaling';
import { ScannerCircle } from '../atoms/ScannerCircle';

export const RegistrationSuccessScreen: React.FC<{
  layout: 'landscape' | 'portrait';
}> = ({ layout }) => {
  const isLandscape = layout === 'landscape';
  const { registrationTargetName, resetToScanning, pulseAnim, countdown } = useKiosk();

  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%', paddingTop: isLandscape ? 0 : ms(10) }}>
      <ScannerCircle
        pulseAnim={pulseAnim}
        pulseColor={Theme.colors.status.check_in_bg}
        circleColor={Theme.colors.success}
        iconName="account-check"
        iconSize={isLandscape ? ms(55) : ms(65)}
      />
      <View style={[styles.titleContainer, { marginTop: ms(8), marginBottom: 0 }]}>
        <ThemedText
          style={[
            styles.pageTitle,
            { color: Theme.colors.success, fontSize: ms(20) },
            isLandscape && { textAlign: 'center' },
          ]}
        >
          GÁN THẺ THÀNH CÔNG
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, { fontSize: ms(14) }, isLandscape && { textAlign: 'center' }]}>
          Cửa sổ này sẽ đóng sau vài giây
        </ThemedText>
      </View>
    </View>
  );

  const cardSection = (
    <View style={{ flex: 1 }}>
      <View style={[styles.instructionCard, { backgroundColor: '#fff', alignItems: 'stretch', padding: ms(24), flex: 1 }]}>
        <View style={{ alignItems: 'center', marginBottom: ms(16) }}>
          <View style={{
            width: ms(80),
            height: ms(80),
            borderRadius: ms(40),
            backgroundColor: Theme.colors.status.check_in_bg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: ms(10)
          }}>
            <MaterialCommunityIcons name="account-details" size={ms(30)} color={Theme.colors.success} />
          </View>
          <ThemedText style={{ fontSize: ms(18), fontWeight: '900', color: Theme.colors.text.primary, textAlign: 'center' }}>
            {registrationTargetName}
          </ThemedText>
          <ThemedText style={{ fontSize: ms(14), color: Theme.colors.text.secondary, marginTop: ms(2) }}>
            Nhân viên đã được liên kết thẻ
          </ThemedText>
        </View>

        <View style={{ height: 1, backgroundColor: Theme.colors.border, width: '100%', marginBottom: ms(16) }} />

        <View style={{ alignItems: 'center', paddingVertical: ms(10) }}>
          <MaterialCommunityIcons name="nfc-variant" size={ms(60)} color={Theme.colors.success} style={{ opacity: 0.15 }} />
          <ThemedText style={{ fontSize: ms(13), color: Theme.colors.text.secondary, textAlign: 'center', marginTop: ms(10), paddingHorizontal: ms(10), lineHeight: ms(18) }}>
            Thông tin thẻ NFC đã được cập nhật vào hồ sơ nhân viên trong hệ thống Odoo.
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const footerSection = (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          backgroundColor: Theme.colors.background,
          height: ms(56),
          borderWidth: 1,
          borderColor: Theme.colors.border,
        },
      ]}
      onPress={resetToScanning}
    >
      <ThemedText style={[styles.primaryButtonText, { color: Theme.colors.text.secondary, fontSize: ms(16) }]}>
        ĐÓNG
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout
      key={layout}
      layout={layout}
      headerSection={headerSection}
      cardSection={cardSection}
      footerSection={footerSection}
    />
  );
};
