import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface InfoFieldProps {
  label: string;
  value: string;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  style?: ViewStyle;
}

export const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  labelStyle,
  valueStyle,
  style,
}) => (
  <View style={style}>
    <ThemedText
      style={[
        { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
        labelStyle,
      ]}
    >
      {label}
    </ThemedText>
    <ThemedText
      style={[
        { fontSize: 22, fontWeight: '900', color: '#1e293b', marginTop: 4 },
        valueStyle,
      ]}
    >
      {value}
    </ThemedText>
  </View>
);
