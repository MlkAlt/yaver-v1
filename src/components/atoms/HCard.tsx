import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../tokens/colors';
import { radius, shadows } from '../../tokens/spacing';

type CardVariant = 'surface' | 'tinted' | 'warn' | 'ok' | 'accent' | 'noBorder';

interface HCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}

export function HCard({ children, variant = 'surface', style }: HCardProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    padding: 14,
  } as ViewStyle,
});

const variantStyles: Record<CardVariant, ViewStyle> = {
  surface: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tinted: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warn: {
    backgroundColor: colors.warningLt,
    borderWidth: 1,
    borderColor: colors.warningMd,
  },
  ok: {
    backgroundColor: colors.successLt,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  accent: {
    backgroundColor: colors.accentLt,
    borderWidth: 1.5,
    borderColor: colors.accentMd,
  },
  noBorder: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
