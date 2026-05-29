import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { radius } from '../../tokens/spacing';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'light';

interface HBtnProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  small?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 18, stiffness: 220 };

export function HBtn({ children, onPress, variant = 'primary', small, disabled, style }: HBtnProps) {
  const scale = useSharedValue(1);
  const vs = variantStyles[variant];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => { if (!disabled && onPress) onPress(); }}
      onPressIn={() => { if (!disabled) scale.value = withSpring(0.96, SPRING); }}
      onPressOut={() => { scale.value = withSpring(1.0, SPRING); }}
      disabled={disabled}
      style={[
        styles.base,
        small && styles.small,
        vs.container,
        disabled && styles.disabled,
        style,
        animStyle,
      ]}
    >
      <Text style={[styles.text, small && styles.textSmall, vs.text]}>
        {children}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.btn,
    paddingVertical: 17,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  } as ViewStyle,
  disabled: {
    opacity: 0.4,
  } as ViewStyle,
  text: {
    fontFamily: fonts.bold,
    fontSize: 16,
    letterSpacing: 0.2,
  } as TextStyle,
  textSmall: {
    fontSize: 13,
  } as TextStyle,
});

const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: colors.text1 },
    text: { color: '#fff' },
  },
  accent: {
    container: { backgroundColor: colors.accent },
    text: { color: '#fff' },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    text: { color: colors.text1 },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.text2 },
  },
  danger: {
    container: {
      backgroundColor: colors.warningLt,
      borderWidth: 1.5,
      borderColor: colors.warningMd,
    },
    text: { color: colors.warning },
  },
  light: {
    container: { backgroundColor: '#FFFFFF' },
    text: { color: colors.text1 },
  },
};
