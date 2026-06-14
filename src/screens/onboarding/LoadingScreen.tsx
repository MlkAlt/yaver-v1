import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withRepeat, withSequence, Easing, runOnJS,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { planUret } from '../../lib/planUret';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const BENEFIT_TEXTS = [
  'Bir öğretmen yılda ortalama\n200 saat hazırlık yapıyor',
  'Bunun büyük kısmı müfredatı\ntakip etmek, evrak doldurmak',
  'Yaver bu yükü omuzlamak\niçin tasarlandı',
  'Yılın hazır.\nHaftana odaklanabilirsin.',
];

export function LoadingScreen({ route, navigation }: Props) {
  const { brans, bransSlug, okulTipi, seciliDersler, dersFiltesi, siniflar, setSiniflar, setPlan } = useOnboarding();
  const [stepIdx, setStepIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navDone = useRef(false);

  const ring1Scale   = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.28);
  const ring2Scale   = useSharedValue(1);
  const ring2Opacity = useSharedValue(0.16);
  const coreScale    = useSharedValue(1);
  const textOpacity  = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

  useEffect(() => {
    // ring 1: dışarı doğru genişle
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1.7, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 0 }),
      ),
      -1,
      false,
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1100 }),
        withTiming(0.28, { duration: 0 }),
      ),
      -1,
      false,
    );
    // ring 2: gecikmeli
    ring2Scale.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 400 }),
        withTiming(1.7, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 0 }),
      ),
      -1,
      false,
    );
    ring2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.16, { duration: 400 }),
        withTiming(0, { duration: 1100 }),
        withTiming(0.16, { duration: 0 }),
      ),
      -1,
      false,
    );
    // core: hafif nefes
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  function advanceText(idx: number) {
    progressWidth.value = withTiming((idx / (BENEFIT_TEXTS.length - 1)) * 100, { duration: 500 });
    textOpacity.value = withTiming(0, { duration: 220 }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(setStepIdx)(idx);
        textOpacity.value = withTiming(1, { duration: 380 });
      }
    });
  }

  function goToWow() {
    if (navDone.current) return;
    navDone.current = true;
    navigation.replace('WowMoment');
  }

  useEffect(() => {
    let cancelled = false;

    async function uret() {
      try {
        const planBrans     = route.params?.brans   ?? brans;
        const planBransSlug = bransSlug;
        const planSiniflar  = route.params?.siniflar?.length
          ? route.params.siniflar
          : siniflar;

        setSiniflar(planSiniflar);
        await AsyncStorage.removeItem('@yaver/yillik_plan');

        advanceText(1);
        if (cancelled) return;

        if (!planBransSlug) throw new Error('Branş seçilmedi — bransSlug boş');
        const plan = await planUret(
          planBrans || 'Matematik',
          planBransSlug,
          planSiniflar.length ? planSiniflar : [9],
          okulTipi || undefined,
          seciliDersler?.length ? seciliDersler : undefined,
          dersFiltesi,
        );
        if (cancelled) return;

        advanceText(2);
        if (cancelled) return;

        setPlan(plan);
        await AsyncStorage.setItem('@yaver/yillik_plan', JSON.stringify(plan));
        if (cancelled) return;

        advanceText(3);
        if (cancelled) return;

        await new Promise(r => setTimeout(r, 900));
        if (cancelled) return;

        goToWow();
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error('[LoadingScreen] planUret hatası:', msg);
          setErrorMsg(msg);
        }
      }
    }

    uret();
    return () => { cancelled = true; };
  }, []);

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Ripple + core */}
        <View style={styles.pulseWrapper}>
          <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
          <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
          <Animated.View style={[styles.core, coreStyle]} />
        </View>

        {/* Başlık */}
        <Text style={styles.heading}>Yılın kuruluyor...</Text>

        {/* Fayda metni */}
        <Animated.Text style={[styles.benefitText, textStyle]}>
          {BENEFIT_TEXTS[stepIdx]}
        </Animated.Text>

        {/* Progress */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        {/* Hata */}
        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Bir hata oluştu</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.retryBtnText}>Geri dön</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  } as ViewStyle,

  pulseWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  ring: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.accent,
  } as ViewStyle,

  ring1: {
    width: 140,
    height: 140,
  } as ViewStyle,

  ring2: {
    width: 140,
    height: 140,
  } as ViewStyle,

  core: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
  } as ViewStyle,

  heading: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -0.4,
    textAlign: 'center',
  } as TextStyle,

  benefitText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: 24,
    minHeight: 52,
  } as TextStyle,

  progressTrack: {
    width: '70%',
    height: 2,
    backgroundColor: colors.border,
    borderRadius: radius.btn,
    overflow: 'hidden',
  } as ViewStyle,

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
  } as ViewStyle,

  errorBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,

  errorTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.warning,
  } as TextStyle,

  errorMsg: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
    textAlign: 'center',
  } as TextStyle,

  retryBtn: {
    backgroundColor: colors.bg,
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  } as ViewStyle,

  retryBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,
});
