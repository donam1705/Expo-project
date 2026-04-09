import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/Theme';

interface ScreenLayoutProps {
  layout: 'portrait' | 'landscape';
  headerSection: React.ReactNode;
  cardSection: React.ReactNode;
  footerSection?: React.ReactNode;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  layout,
  headerSection,
  cardSection,
  footerSection,
}) => {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) + 16;

  if (layout === 'landscape') {
    const safeLandscapeBottom = Math.max(insets.bottom, 8) + 8;
    return (
      <View style={ls.container}>
        <View style={ls.leftCol}>{headerSection}</View>

        <View style={[ls.rightCol, { paddingBottom: safeLandscapeBottom }]}>
          <View style={ls.card}>{cardSection}</View>
          {footerSection != null && (
            <View style={ls.footer}>{footerSection}</View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[pt.container, { paddingBottom: safeBottom }]}>
      <View style={pt.header}>{headerSection}</View>
      <View style={pt.card}>{cardSection}</View>
      {footerSection != null && (
        <View style={pt.footer}>{footerSection}</View>
      )}
    </View>
  );
};

const pt = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    flex: 1,
    width: '100%',
  },
  footer: {
    width: '100%',
    paddingTop: 12,
    gap: Theme.spacing.md,
  },
});

const ls = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftCol: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20,
  },
  rightCol: {
    width: '60%',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 30,
    paddingTop: 20,
    flexDirection: 'column',
  },
  card: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
    gap: Theme.spacing.md,
  },
});
