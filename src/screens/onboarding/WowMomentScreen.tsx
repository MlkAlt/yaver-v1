import React from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { HBtn } from '../../components/atoms/HBtn';
import { HProgress } from '../../components/atoms/HProgress';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { useCountUp } from '../../hooks/useCountUp';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'WowMoment'>;

function KazanimHero({ value }: { value: number }) {
  const count = useCountUp(value, 1400, 60);
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.88);

  React.useEffect(() => {
    opacity.value = withDelay(80, withTiming(1, { duration: 500 }));
    scale.value   = withDelay(80, withTiming(1, { duration: 500 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.kazanimHero, animStyle]}>
      <Text style={styles.kazanimNum}>{count}</Text>
      <Text style={styles.kazanimLabel}>kazanım planlandı</Text>
    </Animated.View>
  );
}

export function WowMomentScreen({ navigation }: Props) {
  const { brans, siniflar, plan } = useOnboarding();

  const sinifText = siniflar.length
    ? siniflar.map(s => `${s}`).join('-') + '. Sınıf'
    : '9. Sınıf';

  const toplamKazanim = plan?.toplam_kazanim ?? 0;
  const sinifSayisi = siniflar.length || 1;

  // Her seçili sınıftan bir temsili kazanım (planın kapsamını hissettirmek için)
  const sinifOrnekleri = siniflar.slice(0, 4).map(sinif => {
    const hafta = (plan?.haftalar ?? []).find(
      h => !h.tatil_mi && h.kazanimlar.some(k => k.sinif === sinif)
    );
    const kazanim = hafta?.kazanimlar.find(k => k.sinif === sinif);
    return kazanim ? { sinif, kazanim } : null;
  }).filter((x): x is { sinif: number; kazanim: NonNullable<typeof x>['kazanim'] } => x !== null);

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      <View style={styles.hero}>
        {/* Dekoratif blob */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        {/* Done badge */}
        <View style={styles.doneBadge}>
          <Check size={11} color={colors.success} strokeWidth={2.5} />
          <Text style={styles.doneBadgeText}>Tamamlandı</Text>
        </View>

        <Text style={styles.heading}>Yılın kuruldu.</Text>
        <Text style={styles.meta}>
          {brans || 'Matematik'} · {sinifText} · 2025-2026
        </Text>

        <KazanimHero value={toplamKazanim} />
      </View>

      {/* White scrollable panel */}
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.panelContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Yıl çubuğu */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>YIL ÇUBUĞU</Text>
              <Text style={styles.progressDates}>Eyl 2025 — Haz 2026</Text>
            </View>
            <HProgress value={3} />
            <Text style={styles.progressSub}>Hafta 1 / 36 — bugün başlıyor</Text>
          </View>

          {/* Her sınıftan bir temsili kazanım */}
          {sinifOrnekleri.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>PLAN KAPSAMINDA</Text>
              <View style={styles.previewList}>
                {sinifOrnekleri.map(({ sinif, kazanim }) => (
                  <View key={sinif} style={styles.previewCard}>
                    <View style={styles.previewNum}>
                      <Text style={styles.previewNumText}>{sinif}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewKonu} numberOfLines={2}>
                        {kazanim.ad ?? kazanim.unite ?? `${sinif}. Sınıf`}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* CTA */}
          <HBtn
            onPress={() => navigation.navigate('MainTabs')}
            style={styles.cta}
          >
            Planıma git →
          </HBtn>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,

  blob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.accent,
    opacity: 0.07,
    top: -100,
    right: -80,
  } as ViewStyle,

  blob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accentMd,
    opacity: 0.15,
    bottom: 20,
    left: -20,
  } as ViewStyle,

  doneBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successLt,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  doneBadgeText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.success,
  } as TextStyle,

  heading: {
    fontSize: 32,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -1,
    lineHeight: 36,
  } as TextStyle,

  meta: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text2,
    marginTop: -spacing.xs,
  } as TextStyle,

  kazanimHero: {
    marginTop: spacing.sm,
    gap: 4,
  } as ViewStyle,

  kazanimNum: {
    fontSize: 52,
    fontFamily: fonts.extraBold,
    color: colors.accent,
    letterSpacing: -2,
    lineHeight: 56,
  } as TextStyle,

  kazanimLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  } as ViewStyle,

  panelContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  } as ViewStyle,

  // Progress
  progressSection: {
    gap: spacing.sm,
  } as ViewStyle,

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,

  progressTitle: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  progressDates: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  progressSub: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
    textAlign: 'center',
  } as TextStyle,

  // Preview
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: -spacing.xs,
  } as TextStyle,

  previewList: {
    gap: spacing.sm,
    marginTop: -spacing.xs,
  } as ViewStyle,

  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  } as ViewStyle,

  previewNum: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.accentLt,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,

  previewNumText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,

  previewKonu: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  previewKod: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginTop: 1,
  } as TextStyle,

  previewKazanim: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
    flexShrink: 0,
  } as TextStyle,

  cta: {
    marginTop: spacing.xs,
  } as ViewStyle,
});
