import React, { createContext, useContext, ReactNode } from 'react';
import { useKioskLogic } from '../hooks/useKioskLogic';

type KioskContextType = ReturnType<typeof useKioskLogic>;

const KioskContext = createContext<KioskContextType | null>(null);

export const KioskProvider = ({ children }: { children: ReactNode }) => {
  const kioskLogic = useKioskLogic();
  return (
    <KioskContext.Provider value={kioskLogic}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
