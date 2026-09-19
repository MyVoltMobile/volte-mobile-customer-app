export const Colors = {
  brand: {
    primary: '#5D42C5',
    secondary: '#C01C70',
    primaryPressed: '#4932A4',
    secondaryPressed: '#9E175C',
  },

  background: {
    app: '#EFF1F6',
    surface: '#FFFFFF',
    subtle: '#F8F9FC',
  },

  text: {
    primary: '#171922',
    secondary: '#697185',
    inverse: '#FFFFFF',
  },

  border: {
    default: '#DDE0E8',
    strong: '#D4D7E2',
  },

  status: {
    success: '#16854B',
    warning: '#F59E0B',
    danger: '#DC2626',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const Typography = {
  family: {
    regular: undefined,
    medium: undefined,
    semibold: undefined,
    bold: undefined,
  },

  size: {
    caption: 12,
    bodySmall: 14,
    body: 16,
    titleSmall: 20,
    title: 28,
    display: 36,
  },

  lineHeight: {
    caption: 16,
    bodySmall: 20,
    body: 24,
    titleSmall: 26,
    title: 34,
    display: 42,
  },
} as const;
