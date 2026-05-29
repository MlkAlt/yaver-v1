import React from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';

interface SLabelProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SLabel({ children, style }: SLabelProps) {
  return (
    <View style={style}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.text3,
  } as TextStyle,
});
