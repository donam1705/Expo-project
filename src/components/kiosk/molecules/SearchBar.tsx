import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      borderRadius: 20,
      paddingHorizontal: 20,
      height: 60,
    }}
  >
    <Ionicons name="search" size={22} color="#94a3b8" />
    <TextInput
      style={{ flex: 1, marginLeft: 15, fontSize: 16, color: '#1e293b' }}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#94a3b8"
    />
  </View>
);
