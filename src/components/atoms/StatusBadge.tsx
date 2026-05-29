import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { radius } from '../../tokens/spacing';

type BadgeType = 'todo' | 'ready' | 'auto';

interface StatusBadgeProps {
  type: BadgeType;
}

const config: Record<BadgeType, { bg: string; dot: string; color: string; text: string }> = {
  todo:  { bg: colors.warningLt, dot: colors.warning,  color: colors.warning,  text: 'Hazırlanmadı' },
  ready: { bg: colors.successLt, dot: colors.success,  color: colors.success,  text: 'Hazır' },
  auto:  { bg: colors.autoBg,    dot: colors.autoText, color: colors.autoText, text: 'Otomatik' },
};

export function StatusBadge({ type }: StatusBadgeProps) {
  const c = config[type];
  return (
    <View style={[styles.base, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[styles.text, { color: c.color }]}>{c.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.btn,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  } as ViewStyle,
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  } as ViewStyle,
  text: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  } as TextStyle,
});
