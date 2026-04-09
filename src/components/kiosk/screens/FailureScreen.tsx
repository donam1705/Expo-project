import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ms } from '../../../utils/scaling';
import { ScannerCircle } from '../atoms/ScannerCircle';
import { ListeningBadge } from '../atoms/ListeningBadge';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';

interface FailureScreenProps {
  layout: 'landscape' | 'portrait';
}

export const FailureScreen: React.FC<FailureScreenProps> = ({
  layout,
}) => {
  const { pulseAnim, setError, readTag, handleAddUser } = useKiosk();
  const isLandscape = layout === 'landscape';

  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <ScannerCircle
        pulseAnim={pulseAnim}
        pulseColor="rgba(239, 68, 68, 0.1)"
        circleColor="#ef4444"
        iconName="alert-octagon-outline"
        iconSize={isLandscape ? ms(60) : ms(70)}
      />
      <View style={[styles.titleContainer, { marginTop: ms(16), marginBottom: 0 }]}>
        <ThemedText
          style={[
            styles.pageTitle,
            { color: '#ef4444' },
            isLandscape && { textAlign: 'center', fontSize: ms(22) },
          ]}
        >
          LỖI XÁC THỰC
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, isLandscape && { textAlign: 'center' }]}>
          Hệ thống không nhận diện được thẻ này
        </ThemedText>
      </View>
    </View>
  );

  const cardSection = (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View
        style={[
          styles.instructionCard,
          {
            backgroundColor: Theme.colors.surface,
            alignItems: 'stretch',
            borderRadius: isLandscape ? Theme.borderRadius.lg : Theme.borderRadius.xxl,
            ...Theme.shadows.medium,
            shadowOpacity: isLandscape ? 0.1 : 0.08,
            shadowRadius: isLandscape ? 15 : 20,
            elevation: 5,
            padding: isLandscape ? 20 : 24,
            marginBottom: 0,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.border,
            paddingBottom: Theme.spacing.md,
            marginBottom: Theme.spacing.lg,
          }}
        >
          <ThemedText
            style={{
              fontSize: isLandscape ? ms(16) : ms(18),
              fontWeight: Theme.typography.fontWeight.heavy,
              color: Theme.colors.text.primary,
            }}
          >
            HƯỚNG DẪN XỬ LÝ
          </ThemedText>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={isLandscape ? ms(24) : ms(26)}
            color={Theme.colors.text.secondary}
          />
        </View>

        <View
          style={{
            backgroundColor: Theme.colors.background,
            padding: isLandscape ? ms(20) : ms(24),
            borderRadius: isLandscape ? Theme.borderRadius.lg : Theme.borderRadius.xl,
            borderLeftWidth: isLandscape ? ms(5) : ms(6),
            borderLeftColor: Theme.colors.danger,
          }}
        >
          <View style={{ marginBottom: isLandscape ? ms(16) : ms(18) }}>
            {!isLandscape && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(6) }}>
                <View
                  style={{
                    width: ms(24),
                    height: ms(24),
                    borderRadius: ms(12),
                    backgroundColor: Theme.colors.status.check_out_bg,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: ms(10),
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: ms(12),
                      fontWeight: Theme.typography.fontWeight.heavy,
                      color: Theme.colors.danger,
                    }}
                  >
                    1
                  </ThemedText>
                </View>
                <ThemedText
                  style={{
                    fontSize: ms(17),
                    fontWeight: Theme.typography.fontWeight.bold,
                    color: Theme.colors.text.primary,
                  }}
                >
                  Yêu cầu quẹt lại
                </ThemedText>
              </View>
            )}
            {isLandscape && (
              <ThemedText
                style={{
                  fontSize: ms(15),
                  fontWeight: Theme.typography.fontWeight.bold,
                  color: Theme.colors.text.primary,
                  marginBottom: ms(4),
                }}
              >
                1. Yêu cầu quẹt lại
              </ThemedText>
            )}
            <ThemedText
              style={{
                fontSize: ms(14),
                color: Theme.colors.text.secondary,
                lineHeight: ms(22),
                marginLeft: isLandscape ? 0 : ms(34),
              }}
            >
              Đảm bảo thẻ được đặt sát vùng cảm biến NFC
              {isLandscape ? '.' : ' của thiết bị.'}
            </ThemedText>
          </View>

          <View>
            {!isLandscape && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(6) }}>
                <View
                  style={{
                    width: ms(24),
                    height: ms(24),
                    borderRadius: ms(12),
                    backgroundColor: Theme.colors.status.check_out_bg,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: ms(10),
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: ms(12),
                      fontWeight: Theme.typography.fontWeight.heavy,
                      color: Theme.colors.danger,
                    }}
                  >
                    2
                  </ThemedText>
                </View>
                <ThemedText
                  style={{
                    fontSize: ms(17),
                    fontWeight: Theme.typography.fontWeight.bold,
                    color: Theme.colors.text.primary,
                  }}
                >
                  Đăng ký nhân viên
                </ThemedText>
              </View>
            )}
            {isLandscape && (
              <ThemedText
                style={{
                  fontSize: ms(15),
                  fontWeight: Theme.typography.fontWeight.bold,
                  color: Theme.colors.text.primary,
                  marginBottom: ms(4),
                }}
              >
                2. Đăng ký nhân viên
              </ThemedText>
            )}
            <ThemedText
              style={{
                fontSize: ms(14),
                color: Theme.colors.text.secondary,
                lineHeight: ms(22),
                marginLeft: isLandscape ? 0 : ms(34),
              }}
            >
              {isLandscape
                ? 'Sử dụng nút "Thêm mới nhân viên" bên dưới.'
                : 'Sử dụng nút "THÊM MỚI NHÂN VIÊN" bên dưới nếu thẻ chưa có hồ sơ.'}
            </ThemedText>
          </View>
        </View>

        <ListeningBadge
          label="TRUY CẬP BỊ TỪ CHỐI"
          color={Theme.colors.danger}
          bgColor={Theme.colors.status.check_out_bg}
          borderColor={Theme.colors.danger}
          style={{ alignSelf: 'center', marginTop: ms(24) }}
          paddingH={isLandscape ? ms(20) : ms(30)}
          paddingV={isLandscape ? ms(10) : ms(12)}
          dotSize={isLandscape ? ms(8) : ms(10)}
          fontSize={isLandscape ? ms(12) : ms(14)}
        />
      </View>
    </View>
  );

  const footerSection = (
    <View style={{ flexDirection: isLandscape ? 'row' : 'column', gap: Theme.spacing.md }}>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor: Theme.colors.danger,
            height: isLandscape ? ms(56) : ms(60),
            ...Theme.shadows.medium,
            shadowColor: Theme.colors.danger,
            elevation: 5,
            ...(isLandscape ? { flex: 1 } : {}),
          },
        ]}
        onPress={() => {
          setError(null);
          readTag();
        }}
      >
        <MaterialCommunityIcons name="refresh" size={ms(20)} color="white" style={{ marginRight: ms(8) }} />
        <ThemedText style={styles.primaryButtonText}>
          THỬ LẠI
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor: Theme.colors.background,
            height: isLandscape ? ms(56) : ms(60),
            borderWidth: 1,
            borderColor: Theme.colors.border,
            ...(isLandscape ? { flex: 1 } : {}),
          },
        ]}
        onPress={handleAddUser}
      >
        <Ionicons name="person-add-outline" size={ms(20)} color="#475569" style={{ marginRight: ms(8) }} />
        <ThemedText style={[styles.primaryButtonText, { color: '#475569', fontSize: isLandscape ? ms(14) : ms(13) }]}>
          {isLandscape ? 'THÊM MỚI' : 'THÊM MỚI NHÂN VIÊN'}
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
