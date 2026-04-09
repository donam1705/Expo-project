import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ScannerCircle } from '../atoms/ScannerCircle';
import { ListeningBadge } from '../atoms/ListeningBadge';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';

interface AdminRequiredScreenProps {
  layout: 'landscape' | 'portrait';
}

export const AdminRequiredScreen: React.FC<AdminRequiredScreenProps> = ({
  layout,
}) => {
  const { pulseAnim, error, setError, readTag, setIsAdminAuthMode } = useKiosk();
  const isError = error === 'NOT_AN_ADMIN';
  const isLandscape = layout === 'landscape';

  const accentColor = isError ? Theme.colors.danger : Theme.colors.primary;
  const pulseColor = isError ? Theme.colors.status.check_out_bg : 'rgba(0, 86, 210, 0.1)';
  const iconName = isError ? 'shield-off-outline' : 'shield-lock-outline';
  const title = isError ? 'TRUY CẬP BỊ TỪ CHỐI' : 'XÁC THỰC ADMIN';
  const subtitle = isError
    ? 'Vui lòng sử dụng thẻ quản trị viên hợp lệ'
    : 'Vui lòng quẹt thẻ Quản trị viên để tiếp tục';
  const cardText = isError
    ? 'Thẻ này không có quyền Admin.\nVui lòng kiểm tra lại.'
    : 'Chạm thẻ Admin vào vùng quét\ncủa thiết bị để xác nhận';
  const badgeLabel = isError ? 'HÃY QUÉT LẠI' : 'ĐANG CHỜ THẺ ADMIN...';
  const badgeBg = isError ? Theme.colors.status.check_out_bg : '#eff6ff';
  const badgeBorder = isError ? Theme.colors.danger : '#bfdbfe';

  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <ScannerCircle
        pulseAnim={pulseAnim}
        pulseColor={pulseColor}
        circleColor={accentColor}
        iconName={iconName as any}
        iconSize={isLandscape ? 65 : 80}
      />
      <View style={[styles.titleContainer, { marginTop: 16, marginBottom: 0 }]}>
        <ThemedText
          style={[
            styles.pageTitle,
            { color: isError ? '#ef4444' : '#1e293b' },
            isLandscape && { textAlign: 'center', fontSize: 20 },
          ]}
        >
          {title}
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, isLandscape && { textAlign: 'center' }]}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );

  const cardSection = (
    <View
      style={[
        styles.instructionCard,
        {
          backgroundColor: Theme.colors.surface,
          borderWidth: 1,
          borderColor: isError ? Theme.colors.danger : Theme.colors.info,
          borderRadius: Theme.borderRadius.xxl,
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
          ...Theme.shadows.medium,
          shadowOpacity: isLandscape ? 0.05 : 0.1,
          shadowRadius: isLandscape ? 15 : 20,
          elevation: isLandscape ? 5 : 10,
          paddingVertical: isLandscape ? 30 : 40,
          paddingHorizontal: 20,
          flex: 1,
        },
      ]}
    >
      <View
        style={{
          width: isLandscape ? 70 : 80,
          height: isLandscape ? 70 : 80,
          borderRadius: isLandscape ? 35 : 40,
          backgroundColor: isError ? '#fee2e2' : '#eff6ff',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: isLandscape ? 15 : 24,
        }}
      >
        <Ionicons
          name={isError ? 'alert-circle' : 'shield-checkmark'}
          size={isLandscape ? 40 : 48}
          color={isError ? '#ef4444' : '#0056D2'}
        />
      </View>

      <ThemedText
        style={[
          styles.instructionText,
          {
            fontSize: isLandscape ? 18 : 20,
            fontWeight: Theme.typography.fontWeight.heavy,
            textAlign: 'center',
            color: Theme.colors.text.primary,
            lineHeight: isLandscape ? 26 : 28,
          },
        ]}
      >
        {cardText}
      </ThemedText>

      <ListeningBadge
        label={badgeLabel}
        color={accentColor}
        bgColor={badgeBg}
        borderColor={badgeBorder}
        style={{ marginTop: isLandscape ? 20 : 30 }}
        paddingH={isLandscape ? 20 : 24}
        paddingV={isLandscape ? 10 : 12}
        fontSize={isLandscape ? 12 : 13}
      />
    </View>
  );

  const footerSection = (
    <View style={{ flexDirection: isLandscape ? 'row' : 'column', gap: Theme.spacing.md }}>
      {error && (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: Theme.colors.danger,
              ...(isLandscape
                ? { flex: 1, height: 56 }
                : { height: 60, ...Theme.shadows.medium, shadowColor: Theme.colors.danger, elevation: 5 }),
            },
          ]}
          onPress={() => {
            setError(null);
            readTag('ADMIN_AUTH');
          }}
        >
          <ThemedText style={styles.primaryButtonText}>QUÉT LẠI</ThemedText>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor: Theme.colors.background,
            borderWidth: 1,
            borderColor: Theme.colors.border,
            ...(isLandscape
              ? { flex: 1, height: 56 }
              : { height: 60 }),
          },
        ]}
        onPress={() => {
          setIsAdminAuthMode(false);
          setError(null);
        }}
      >
        <ThemedText style={[styles.primaryButtonText, { color: Theme.colors.text.secondary }]}>
          {isLandscape ? 'HUỶ' : 'HUỶ BỎ'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenLayout
      layout={layout}
      headerSection={headerSection}
      cardSection={cardSection}
      footerSection={footerSection}
    />
  );
};
