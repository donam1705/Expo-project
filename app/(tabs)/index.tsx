import React from 'react';
import { MainLayout } from '../../src/components/kiosk/MainLayout';
import { KioskProvider } from '../../src/contexts/KioskContext';

export default function HomeScreen() {
  return (
    <KioskProvider>
      <MainLayout />
    </KioskProvider>
  );
}