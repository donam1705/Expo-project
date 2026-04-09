import React from 'react';
import { View, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';

interface ListeningBadgeProps {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  style?: ViewStyle;
  fontSize?: number;
  dotSize?: number;
  paddingH?: number;
  paddingV?: number;
}

export const ListeningBadge: React.FC<ListeningBadgeProps> = ({
  label,
  color,
  bgColor,
  borderColor,
  style,
  fontSize = 12,
  dotSize,
  paddingH = 20,
  paddingV = 10,
}) => (
  <View
    style={[
      styles.listeningBadge,
      {
        backgroundColor: bgColor,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: 20,
        borderWidth: 1,
        borderColor,
      },
      style,
    ]}
  >
    <View
      style={[
        styles.listeningDot,
        {
          backgroundColor: color,
          ...(dotSize ? { width: dotSize, height: dotSize } : {}),
        },
      ]}
    />
    <ThemedText style={[styles.listeningText, { color, fontSize, fontWeight: '900' }]}>
      {label}
    </ThemedText>
  </View>
);
