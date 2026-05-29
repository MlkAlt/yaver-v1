import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../tokens/colors';
import { radius } from '../../tokens/spacing';

interface HProgressProps {
  value: number; // 0-100
  color?: string;
  style?: ViewStyle;
}

export function HProgress({ value, color = colors.accent, style }: HProgressProps) {
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: radius.btn,
    overflow: 'hidden',
  } as ViewStyle,
  fill: {
    height: '100%',
    borderRadius: radius.btn,
  } as ViewStyle,
});
