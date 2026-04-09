import React from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';
import { ScannerCircle } from '../atoms/ScannerCircle';
import { ActivityItem } from '../molecules/ActivityItem';
import { ScreenLayout } from '../ScreenLayout';
import { ms } from '../../../utils/scaling';
import { useKiosk } from '../../../contexts/KioskContext';

interface ScanningScreenProps {
  layout: 'landscape' | 'portrait';
}

export const ScanningScreen: React.FC<ScanningScreenProps> = ({
  layout,
}) => {
  const { pulseAnim, recentActivity } = useKiosk();
  const isLandscape = layout === 'landscape';

  const headerSection = (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <ScannerCircle
        pulseAnim={pulseAnim}
        pulseColor="rgba(0, 86, 210, 0.1)"
        iconName="nfc-variant"
        iconSize={isLandscape ? 60 : 70}
      />
      <View style={[styles.titleContainer, { marginTop: 16, marginBottom: 0 }]}>
        <ThemedText style={[styles.pageTitle, isLandscape && { textAlign: 'center', fontSize: 22 }]}>
          NFC Scan
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, isLandscape && { textAlign: 'center' }]}>
          Sẵn sàng ghi nhận điểm danh
        </ThemedText>
      </View>
    </View>
  );

  const cardSection = (
    <View style={{ flex: 1, width: '100%' }}>
      <View style={[styles.instructionCard, { padding: ms(16), marginBottom: ms(12) }]}>
        <Ionicons name="radio-outline" size={ms(28)} color={Theme.colors.primary} />
        <ThemedText style={[styles.instructionText, { fontSize: ms(15), marginVertical: ms(8) }]}>
          {`SẴN SÀNG QUÉT THẺ${!isLandscape ? '\nChạm thẻ vào vùng cảm biến' : ''}`}
        </ThemedText>
        <View style={styles.listeningBadge}>
          <View style={styles.listeningDot} />
          <ThemedText style={styles.listeningText}>ĐANG CHỜ THẺ...</ThemedText>
        </View>
      </View>

      {recentActivity.length === 0 && isLandscape ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="documents-outline" size={60} color={Theme.colors.border} />
          <ThemedText style={{ color: Theme.colors.text.muted, fontSize: 16, marginTop: 15 }}>
            Chưa có lịch sử điểm danh
          </ThemedText>
        </View>
      ) : recentActivity.length > 0 ? (
        <View
          style={[
            styles.instructionCard,
            styles.historyListCard,
            {
              flex: 1,
              maxHeight: isLandscape ? undefined : 420,
              marginBottom: 0,
              marginTop: 0,
              shadowColor: 'transparent',
              shadowOpacity: 0,
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
              elevation: 0,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardHeaderText}>LỊCH SỬ QUÉT THẺ</ThemedText>
            <MaterialCommunityIcons name="history" size={18} color={Theme.colors.text.secondary} />
          </View>
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator
              persistentScrollbar
              contentContainerStyle={{ paddingRight: 8, paddingBottom: 16 }}
            >
              {recentActivity.map((act, i) => (
                <ActivityItem
                  key={act.uniqueId || i}
                  act={act}
                  showGhiNhan={!isLandscape}
                  paddingVertical={!isLandscape ? 12 : undefined}
                  paddingValue={isLandscape ? 10 : undefined}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}
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
