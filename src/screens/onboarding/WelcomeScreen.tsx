import React, { useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withTiming, Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const SPRING = { damping: 22, stiffness: 180 };

function useFadeUp(delay: number) {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(20);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const run = () => {
    opacity.value    = withDelay(delay, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withSpring(0, SPRING));
  };
  return { style, run };
}

export function WelcomeScreen({ navigation }: Props) {
  const logo     = useFadeUp(0);
  const headline = useFadeUp(200);
  const cta      = useFadeUp(380);

  useEffect(() => {
    logo.run();
    headline.run();
    cta.run();
  }, []);

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Animated.View style={[styles.logoRow, logo.style]}>
          <View style={styles.logoMark}>
            <Text style={styles.logoGlyph}>Y</Text>
          </View>
          <Text style={styles.logoName}>Yaver</Text>
        </Animated.View>

        <View style={styles.illustrationArea}>
          <View style={styles.illustrationCard}>
            <View style={styles.shape1} />
            <View style={styles.shape2} />
            <View style={styles.shape3} />
            <View style={styles.centerBox}>
              <Text style={styles.centerGlyph}>✦</Text>
            </View>
            {__DEV__ && <Text style={styles.illustrationLabel}>[ illüstrasyon ]</Text>}
          </View>
        </View>

        <Animated.View style={[styles.headlineBlock, headline.style]}>
          <Text style={styles.pre}>Merhaba,</Text>
          <Text style={styles.display}>öğretmenim.</Text>
          <Text style={styles.tagline}>
            Haftalık ders hazırlığını bitiren asistanın artık burada.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.ctaArea, cta.style]}>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate('Brans')}
        >
          <Text style={styles.btnText}>Başlayalım →</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Giris')}
          style={({ pressed }) => [styles.loginLink, pressed && { opacity: 0.5 }]}
        >
          <Text style={styles.loginText}>Zaten hesabım var — Giriş yap</Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  } as ViewStyle,

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.text1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  logoGlyph: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    lineHeight: 22,
  } as TextStyle,
  logoName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  } as ViewStyle,
  illustrationCard: {
    width: 280,
    height: 220,
    backgroundColor: colors.accentLt,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: spacing.sm,
  } as ViewStyle,
  shape1: {
    position: 'absolute',
    top: 20,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    opacity: 0.22,
  } as ViewStyle,
  shape2: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.catTeal,
    opacity: 0.35,
    transform: [{ rotate: '15deg' }],
  } as ViewStyle,
  shape3: {
    position: 'absolute',
    top: 52,
    left: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.catGreen,
    opacity: 0.55,
  } as ViewStyle,
  centerBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,
  centerGlyph: {
    fontSize: 34,
    color: colors.text1,
  } as TextStyle,
  illustrationLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
    fontStyle: 'italic',
  } as TextStyle,

  headlineBlock: {
    gap: 6,
    paddingBottom: spacing.xs,
  } as ViewStyle,
  pre: {
    fontSize: 18,
    fontFamily: fonts.italic,
    color: colors.text2,
  } as TextStyle,
  display: {
    fontSize: 38,
    fontFamily: fonts.extraBold,
    color: colors.accent,
    letterSpacing: -0.5,
    lineHeight: 46,
  } as TextStyle,
  tagline: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text2,
    lineHeight: 22,
    marginTop: spacing.xs,
  } as TextStyle,

  ctaArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  } as ViewStyle,
  btn: {
    backgroundColor: colors.text1,
    borderRadius: radius.btn,
    paddingVertical: 17,
    alignItems: 'center',
  } as ViewStyle,
  btnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  } as TextStyle,
  loginLink: {
    alignItems: 'center',
    paddingVertical: 14,
  } as ViewStyle,
  loginText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,
});
