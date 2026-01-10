/**
 * Nuur Fashion Design System
 * Design tokens extracted from mockup HTML files
 */

import { Platform, StyleSheet } from 'react-native';

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const palette = {
  // Primary
  primary: '#BC6C4D',
  primaryLight: '#D4A088',
  primaryDark: '#9A5539',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Backgrounds
  background: '#F9F8F6',
  surface: '#FFFFFF',
  accent: '#F9F8F6',

  // Text
  text: '#0F172A',          // slate-900
  textSecondary: '#64748B', // slate-500
  textMuted: '#94A3B8',     // slate-400
  textInverse: '#FFFFFF',

  // Borders
  border: '#E2E8F0',        // slate-200
  borderLight: '#F1F5F9',   // slate-100

  // Status
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Dark Mode
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkAccent: '#2A2A2A',
} as const;

// =============================================================================
// COLORS (Light & Dark Theme)
// =============================================================================

export const Colors = {
  light: {
    primary: palette.primary,
    background: palette.background,
    surface: palette.surface,
    accent: palette.accent,
    text: palette.text,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    border: palette.border,
    borderLight: palette.borderLight,
    icon: palette.textSecondary,
    tint: palette.primary,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.text,
    error: palette.error,
    success: palette.success,
  },
  dark: {
    primary: palette.primary,
    background: palette.darkBackground,
    surface: palette.darkSurface,
    accent: palette.darkAccent,
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
    icon: '#94A3B8',
    tint: palette.primary,
    tabIconDefault: '#64748B',
    tabIconSelected: '#F8FAFC',
    error: palette.error,
    success: palette.success,
  },
} as const;

// =============================================================================
// SPACING (4px grid system)
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const fontFamilies = {
  display: 'Playfair_700Bold',
  displayItalic: 'Playfair_700Bold_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const typography = StyleSheet.create({
  // Display (Playfair)
  displayLarge: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    lineHeight: 40,
  },
  displayMedium: {
    fontFamily: fontFamilies.display,
    fontSize: 24,
    lineHeight: 32,
  },
  displaySmall: {
    fontFamily: fontFamilies.display,
    fontSize: 20,
    lineHeight: 28,
  },

  // Titles (Inter)
  titleLarge: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 16,
    lineHeight: 22,
  },

  // Body (Inter)
  bodyLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    lineHeight: 16,
  },

  // Labels
  labelLarge: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Button
  button: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
});

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = StyleSheet.create({
  sm: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as object,
  md: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }) as object,
  lg: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }) as object,
});

// =============================================================================
// COMMON STYLES
// =============================================================================

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenPadding: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
