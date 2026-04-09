import React from 'react';
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ScannerCircle } from '../atoms/ScannerCircle';
import { EmployeeAvatar } from '../atoms/EmployeeAvatar';
import { Employee } from '../../../types';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';

interface SuccessScreenProps {
  layout: 'landscape' | 'portrait';
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  layout,
}) => {
  const { pulseAnim, employee, lastStatus, attendanceHistory, countdown, setEmployee } = useKiosk();
  const isCheckIn = lastStatus === 'check_in';
  const isLandscape = layout === 'landscape';
  const accentColor = isCheckIn ? Theme.colors.success : Theme.colors.warning;
  const pulseColor = isCheckIn
    ? Theme.colors.status.check_in_bg
    : Theme.colors.status.check_out_bg;

  const mergedHistory = attendanceHistory
    .reduce((acc: any[], hist) => {
      if (hist.check_out) acc.push({ type: 'out', time: hist.check_out });
      if (hist.check_in) acc.push({ type: 'in', time: hist.check_in });
      return acc;
    }, [])
    .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const renderHistoryItems = (maxItems: number, showDate = false) =>
    mergedHistory.length > 0 ? (
      mergedHistory.slice(0, maxItems).map((item: any, idx: number) => (
        <View
          key={idx}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Theme.colors.background,
            padding: Theme.spacing.md,
            borderRadius: Theme.borderRadius.lg,
            ...(showDate ? { borderWidth: 1, borderColor: Theme.colors.border } : {}),
          }}
        >
          <View
            style={{
              width: showDate ? 40 : 36,
              height: showDate ? 40 : 36,
              borderRadius: showDate ? 20 : 18,
              backgroundColor: Theme.colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Theme.spacing.md,
              ...(showDate ? Theme.shadows.light : {}),
            }}
          >
            <Ionicons
              name={item.type === 'in' ? 'enter-outline' : 'exit-outline'}
              size={showDate ? 20 : 18}
              color={item.type === 'in' ? Theme.colors.success : Theme.colors.warning}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: Theme.typography.fontWeight.heavy,
                color: Theme.colors.text.primary,
              }}
            >
              {item.type === 'in'
                ? showDate
                  ? 'Vào làm (Check-in)'
                  : 'Vào làm'
                : showDate
                  ? 'Ra về (Check-out)'
                  : 'Ra về'}
            </ThemedText>
            {showDate && (
              <ThemedText style={{ fontSize: 11, color: Theme.colors.text.secondary }}>
                {new Date(item.time + 'Z').toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </ThemedText>
            )}
          </View>
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: Theme.typography.fontWeight.heavy,
              color: Theme.colors.text.primary,
            }}
          >
            {new Date(item.time + 'Z').toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ThemedText>
        </View>
      ))
    ) : (
      <View
        style={{
          alignItems: 'center',
          padding: 20,
          ...(showDate ? { backgroundColor: '#f8fafc', borderRadius: 16 } : {}),
        }}
      >
        <ThemedText style={{ color: '#94a3b8', fontSize: showDate ? 13 : undefined }}>
          {showDate ? 'Chưa có lịch sử ra vào nào khác' : 'Chưa có lịch sử'}
        </ThemedText>
      </View>
    );

  const avatarSize = isLandscape ? 55 : 60;

  const employeeCard = (
    <View
      style={[
        styles.instructionCard,
        { backgroundColor: '#fff', alignItems: 'stretch', padding: 15, flex: 1 },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          paddingBottom: 8,
        }}
      >
        <View>
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: Theme.typography.fontWeight.heavy,
              color: Theme.colors.text.primary,
            }}
          >
            THÔNG TIN NHÂN VIÊN
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: Theme.colors.text.secondary, marginTop: 2 }}>
            Mã số: {employee?.employee_code || employee?.id}
          </ThemedText>
        </View>
        <View
          style={{
            backgroundColor: isCheckIn ? '#e6fffb' : '#fff7ed',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: accentColor,
              marginRight: 6,
            }}
          />
          <ThemedText style={{ fontSize: 12, fontWeight: '800', color: accentColor }}>
            {isCheckIn ? 'VÀO LÀM' : 'RA VỀ'}
          </ThemedText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <EmployeeAvatar
          avatar={employee?.avatar}
          size={avatarSize}
          fallbackVariant="user-alt"
          style={{ borderWidth: 3, borderColor: Theme.colors.surface }}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <ThemedText
            style={{
              fontSize: avatarSize >= 70 ? 22 : 18,
              fontWeight: Theme.typography.fontWeight.heavy,
              color: Theme.colors.text.primary,
            }}
          >
            {employee?.name}
          </ThemedText>
          <ThemedText style={{ fontSize: 13, color: Theme.colors.text.secondary, marginTop: 4 }}>
            {employee?.department || 'Nhân sự'}
          </ThemedText>
        </View>
      </View>

      <View
        style={{ height: 1, backgroundColor: Theme.colors.border, width: '100%', marginBottom: 10 }}
      />

      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <ThemedText
            style={{
              fontSize: 14,
              color: Theme.colors.text.primary,
              fontWeight: Theme.typography.fontWeight.heavy,
            }}
          >
            LỊCH SỬ RA VÀO
          </ThemedText>
          <Ionicons name="time-outline" size={18} color={Theme.colors.text.secondary} />
        </View>
        <View style={{ gap: isLandscape ? 10 : 12 }}>
          {renderHistoryItems(isLandscape ? 3 : 3, !isLandscape)}
        </View>
      </View>
    </View>
  );

  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <ScannerCircle
        pulseAnim={pulseAnim}
        pulseColor={pulseColor}
        circleColor={accentColor}
        iconName={isCheckIn ? 'check-decagram' : 'account-check'}
        iconSize={isLandscape ? 60 : 70}
      />
      <View style={[styles.titleContainer, { marginTop: 16, marginBottom: 0 }]}>
        <ThemedText
          style={[
            styles.pageTitle,
            { color: accentColor },
            isLandscape && { textAlign: 'center', fontSize: 20 },
          ]}
        >
          {isCheckIn ? 'CHECK-IN THÀNH CÔNG' : 'CHECK-OUT THÀNH CÔNG'}
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, isLandscape && { textAlign: 'center' }]}>
          Cảm ơn {employee?.name}.
        </ThemedText>
      </View>
    </View>
  );

  const cardSection = (
    <View style={{ flex: 1 }}>
      {employeeCard}
    </View>
  );

  const footerSection = (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          backgroundColor: Theme.colors.background,
          height: 56,
          borderWidth: 1,
          borderColor: Theme.colors.border,
        },
      ]}
      onPress={() => setEmployee(null)}
    >
      <ThemedText style={[styles.primaryButtonText, { color: Theme.colors.text.secondary }]}>
        ĐÓNG ({countdown}s)
      </ThemedText>
    </TouchableOpacity>
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
