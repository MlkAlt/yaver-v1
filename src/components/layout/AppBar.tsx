import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';

interface AppBarProps {
  title?: string;
  back?: boolean;
  action?: React.ReactNode;
  border?: boolean;
  bg?: string;
}

export function AppBar({ title, back = false, action, border = true, bg = colors.surface }: AppBarProps) {
  const navigation = useNavigation();
  return (
    <View style={[styles.bar, { backgroundColor: bg }, border && styles.border]}>
      {back ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.iconBtn}>
        {action ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  } as ViewStyle,
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  backArrow: {
    fontSize: 18,
    color: colors.text1,
  } as TextStyle,
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text1,
    letterSpacing: -0.2,
  } as TextStyle,
});
