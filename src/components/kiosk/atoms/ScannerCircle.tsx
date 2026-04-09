import React from 'react';
import { View, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../../styles/kioskStyles';
import { Theme } from '../../../constants/Theme';

interface ScannerCircleProps {
  pulseAnim: Animated.Value;
  pulseColor: string;
  circleColor?: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconSize?: number;
  marginTop?: number;
}

export const ScannerCircle: React.FC<ScannerCircleProps> = ({
  pulseAnim,
  pulseColor,
  circleColor = Theme.colors.primary,
  iconName,
  iconSize = 70,
  marginTop,
}) => (
  <View style={[styles.scannerWrapper, marginTop !== undefined ? { marginTop } : undefined]}>
    <Animated.View
      style={[
        styles.pulseCircle,
        {
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.25],
              }),
            },
          ],
          opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }),
          backgroundColor: pulseColor,
        },
      ]}
    />
    <View style={[styles.solidCircle, { backgroundColor: circleColor }]}>
      <MaterialCommunityIcons name={iconName} size={iconSize} color={Theme.colors.text.light} />
    </View>
  </View>
);
