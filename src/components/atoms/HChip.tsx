import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { radius } from '../../tokens/spacing';

interface HChipProps {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function HChip({ children, active, onPress, style }: HChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.base, active ? styles.active : styles.inactive, style]}
    >
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.btn,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  active: {
    backgroundColor: colors.text1,
  } as ViewStyle,
  inactive: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  } as ViewStyle,
  text: {
    fontSize: 13,
  } as TextStyle,
  activeText: {
    color: '#fff',
    fontFamily: fonts.bold,
  } as TextStyle,
  inactiveText: {
    color: colors.text2,
    fontFamily: fonts.medium,
  } as TextStyle,
});
