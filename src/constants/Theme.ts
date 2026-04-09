import { ms } from '../utils/scaling';

export const Theme = {
  colors: {
    primary: '#0056D2',
    secondary: '#1e293b',
    success: '#00b894',
    danger: '#ef4444',
    warning: '#ff9f43',
    info: '#3b82f6',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8',
      light: '#ffffff',
    },
    status: {
      check_in: '#00b894',
      check_out: '#ff9f43',
      check_in_bg: 'rgba(0, 184, 148, 0.1)',
      check_out_bg: 'rgba(255, 159, 67, 0.1)',
    }
  },
  spacing: {
    xs: ms(4),
    sm: ms(8),
    md: ms(16),
    lg: ms(24),
    xl: ms(32),
    xxl: ms(40),
  },
  borderRadius: {
    sm: ms(8),
    md: ms(12),
    lg: ms(16),
    xl: ms(24),
    xxl: ms(32),
    full: 9999,
  },
  typography: {
    fontSizes: {
      xs: ms(12),
      sm: ms(14),
      md: ms(16),
      lg: ms(20),
      xl: ms(24),
      xxl: ms(32),
    },
    fontWeight: {
      normal: '400',
      bold: '700',
      heavy: '900',
    } as const,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
  }
};
