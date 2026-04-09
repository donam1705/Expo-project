import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

interface NfcTagBannerProps {
  tagId: string;
  compact?: boolean;
}

export const NfcTagBanner: React.FC<NfcTagBannerProps> = ({ tagId, compact = false }) => {
  if (compact) {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#eff6ff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#bfdbfe',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#3b82f6',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <MaterialCommunityIcons name="nfc-variant" size={18} color="white" />
          </View>
          <ThemedText style={{ fontSize: 11, fontWeight: '900', color: '#1e40af', letterSpacing: 1 }}>
            THẺ ĐANG ĐƯỢC CHỜ GÁN
          </ThemedText>
        </View>
        <ThemedText style={{ fontSize: 14, fontWeight: '800', color: '#1e293b' }}>
          ID: {tagId}
        </ThemedText>
        <ThemedText style={{ fontSize: 13, color: '#3b82f6', marginTop: 5 }}>
          Nhấn vào nhân viên bên phải để cấp phát
        </ThemedText>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#eff6ff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#3b82f6',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <MaterialCommunityIcons name="nfc-variant" size={18} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 10, fontWeight: '800', color: '#3b82f6' }}>
          NFC TOKEN HOẠT ĐỘNG (chưa gán)
        </ThemedText>
        <ThemedText style={{ fontSize: 13, fontWeight: '900', color: '#1e293b' }}>
          ID: {tagId}
        </ThemedText>
      </View>
      <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
    </View>
  );
};
