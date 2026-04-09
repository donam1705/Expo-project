import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Theme } from '../../../constants/Theme';
import { ms } from '../../../utils/scaling';

export const KioskLoadingScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ rotate: spin }, { scale: pulseAnim }],
              borderColor: Theme.colors.primary,
              borderStyle: 'dashed',
            }
          ]}
        />

        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.innerLogo}>
            <MaterialCommunityIcons name="nfc-variant" size={ms(60)} color="white" />
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>KIOSK ODOO</ThemedText>
          <ThemedText style={styles.subtitle}>Đang khởi tạo hệ thống...</ThemedText>

          <View style={styles.loadingBarContainer}>
            <Animated.View style={styles.loadingLine} />
          </View>
        </View>
      </View>

      <ThemedText style={styles.footer}>© 2024 - Hệ thống quản lý thẻ Odoo</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: ms(200),
    height: ms(200),
    borderRadius: ms(100),
    borderWidth: 2,
    opacity: 0.3,
  },
  logoContainer: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: 'rgba(0, 86, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
    shadowColor: Theme.colors.primary,
  },
  innerLogo: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: ms(40),
    alignItems: 'center',
  },
  title: {
    fontSize: ms(24),
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: ms(16),
    color: '#64748b',
    marginTop: ms(10),
    fontWeight: '600',
  },
  loadingBarContainer: {
    width: ms(150),
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginTop: ms(25),
    overflow: 'hidden',
  },
  loadingLine: {
    width: '40%',
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: ms(40),
    fontSize: ms(12),
    color: '#94a3b8',
    fontWeight: '700',
  }
});
