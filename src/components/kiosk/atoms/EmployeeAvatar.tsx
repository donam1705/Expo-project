import React from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface EmployeeAvatarProps {
  avatar?: string | null;
  size?: number;
  borderRadius?: number;
  fallbackVariant?: 'account' | 'user-alt';
  style?: ViewStyle;
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({
  avatar,
  size = 60,
  borderRadius,
  fallbackVariant = 'account',
  style,
}) => {
  const br = borderRadius ?? size / 2;
  const iconSize = Math.floor(size * 0.5);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: br,
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {avatar ? (
        <Image
          source={{ uri: `data:image/png;base64,${avatar}` }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      ) : fallbackVariant === 'user-alt' ? (
        <FontAwesome5 name="user-alt" size={iconSize} color="#cbd5e1" />
      ) : (
        <MaterialCommunityIcons name="account" size={iconSize} color="#cbd5e1" />
      )}
    </View>
  );
};
