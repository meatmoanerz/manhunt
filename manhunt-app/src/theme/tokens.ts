export const colors = {
  black: '#0A0A0A',
  white: '#F5F0E8',
  yellow: '#FFE040',
  red: '#FF2D2D',
  green: '#00E676',
  blue: '#1A6BFF',
  orange: '#FF6B00',
  gray100: '#F0EBE0',
  gray300: '#C8C0B0',
  gray600: '#6B6560',
  gray900: '#1A1714',
  primary: '#FFE040',
  danger: '#FF2D2D',
  success: '#00E676',
  warning: '#FF6B00',
  info: '#1A6BFF',
} as const;

export const typography = {
  display: { fontFamily: 'BarlowCondensed_800ExtraBold' },
  displayBold: { fontFamily: 'BarlowCondensed_900Black' },
  body: { fontFamily: 'SpaceMono_400Regular' },
  bodyBold: { fontFamily: 'SpaceMono_700Bold' },
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 16,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 72,
  '5xl': 96,
} as const;

export const shadows = {
  sm: {
    shadowOffset: { width: 3, height: 3 },
    shadowColor: '#0A0A0A',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  md: {
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#0A0A0A',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  lg: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: '#0A0A0A',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 12, height: 12 },
    shadowColor: '#0A0A0A',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  yellow: {
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#FFE040',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  red: {
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#FF2D2D',
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
} as const;

export const borders = {
  sm: { borderWidth: 2, borderColor: '#0A0A0A' },
  md: { borderWidth: 3, borderColor: '#0A0A0A' },
  lg: { borderWidth: 4, borderColor: '#0A0A0A' },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  none: 0,
  sm: 4,
} as const;
