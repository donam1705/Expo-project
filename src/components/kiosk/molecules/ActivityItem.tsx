import React from 'react';
import { View, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';

interface ActivityItemProps {
  act: {
    avatar?: string | null;
    name: string;
    outTime?: string | null;
    inTime?: string | null;
    date?: string | null;
  };
  showGhiNhan?: boolean;
  paddingVertical?: number;
  paddingValue?: number;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  act,
  showGhiNhan = false,
  paddingVertical,
  paddingValue = 10,
}) => (
  <View
    style={[
      styles.activityItem,
      paddingVertical !== undefined
        ? { paddingVertical }
        : { padding: paddingValue },
    ]}
  >
    <View style={{ position: 'relative', marginRight: 15 }}>
      <View style={styles.avatarContainer}>
        {act.avatar ? (
          <Image
            source={{ uri: `data:image/png;base64,${act.avatar}` }}
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: Theme.colors.background,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome5 name="user-alt" size={20} color={Theme.colors.text.muted} />
          </View>
        )}
      </View>
      <View
        style={[styles.statusBadge, { backgroundColor: act.outTime ? Theme.colors.warning : Theme.colors.success }]}
      >
        <Ionicons
          name={act.outTime ? 'exit-outline' : 'enter-outline'}
          size={12}
          color="white"
        />
      </View>
    </View>

    <View style={{ flex: 1 }}>
      <ThemedText style={styles.infoTextMain} numberOfLines={1}>
        {act.name}
      </ThemedText>
      <ThemedText
        style={[
          styles.infoTextSub,
          act.outTime ? styles.statusTextOut : styles.statusTextIn,
        ]}
      >
        {act.outTime ? 'ĐÃ CHECK-OUT' : 'ĐÃ CHECK-IN'} • {act.date || '--/--'}
      </ThemedText>
    </View>

    <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
      <ThemedText
        style={{ fontSize: showGhiNhan ? 18 : 16, fontWeight: Theme.typography.fontWeight.heavy, color: Theme.colors.text.primary }}
      >
        {act.outTime || act.inTime}
      </ThemedText>
      {showGhiNhan && (
        <ThemedText style={{ fontSize: 10, color: Theme.colors.text.secondary, fontWeight: Theme.typography.fontWeight.bold }}>
          GHI NHẬN
        </ThemedText>
      )}
    </View>
  </View>
);
