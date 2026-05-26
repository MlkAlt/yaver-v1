import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { HBtn } from '../../components/atoms/HBtn';
import { HProgress } from '../../components/atoms/HProgress';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EkDersler'>;

// Sınıf Öğretmeni: zorunlu dersler (tüm sınıf öğretmenleri girer)
// + paylasimli dersler (okuldaki branş öğretmeni yoksa sınıf öğretmeni girer)
// ders değerleri DB'deki kazanimlar.ders kolonuyla birebir eşleşmeli
// V1.5: Trafik Güvenliği (4. sınıf) — MEB zorunlu ama kazanımlar henüz seed edilmedi
const DERS_HAVUZU = [
  { ders: 'Türkçe',          siniflar: [1, 2, 3, 4], paylasimli: false },
  { ders: 'Matematik',       siniflar: [1, 2, 3, 4], paylasimli: false },
  { ders: 'Hayat Bilgisi',   siniflar: [1, 2, 3],    paylasimli: false },
  { ders: 'Fen Bilimleri',   siniflar: [3, 4],       paylasimli: false },
  { ders: 'Sosyal Bilgiler', siniflar: [4],          paylasimli: false },
  { ders: 'İnsan Hakları',   siniflar: [4],          paylasimli: false },
  // Paylaşımlı: branş öğretmeni yoksa sınıf öğretmeni girer
  { ders: 'İngilizce',                     siniflar: [2, 3, 4],    paylasimli: true },
  { ders: 'Müzik',                         siniflar: [1, 2, 3, 4], paylasimli: true },
  { ders: 'Görsel Sanatlar',               siniflar: [1, 2, 3, 4], paylasimli: true },
  { ders: 'Beden Eğitimi ve Oyun',         siniflar: [1, 2, 3, 4], paylasimli: true },
  { ders: 'Din Kültürü ve Ahlak Bilgisi',  siniflar: [4],          paylasimli: true },
];

function sinifEtiket(siniflar: number[]): string {
  if (siniflar.length === 1) return `${siniflar[0]}. sınıf`;
  const min = Math.min(...siniflar);
  const max = Math.max(...siniflar);
  return `${min}-${max}. sınıf`;
}

export function EkDerslerScreen({ navigation, route }: Props) {
  const { brans, bransId, okulTipi, setSiniflar: ctxSetSiniflar, setSeciliDersler } = useOnboarding();
  const siniflar: number[] = route.params?.siniflar ?? [];

  // Seçilen sınıflarla örtüşen dersler
  const available = DERS_HAVUZU.filter(d =>
    d.siniflar.some(s => siniflar.includes(s))
  );

  // Varsayılan: yalnızca zorunlu dersler seçili
  const [secili, setSecili] = useState<Set<string>>(
    new Set(available.filter(d => !d.paylasimli).map(d => d.ders))
  );

  const toggle = (ders: string) => {
    setSecili(prev => {
      const next = new Set(prev);
      next.has(ders) ? next.delete(ders) : next.add(ders);
      return next;
    });
  };

  const handleKur = () => {
    const liste = [...secili];
    setSeciliDersler(liste);
    ctxSetSiniflar(siniflar);
    navigation.navigate('Loading', { brans, bransId, siniflar });
  };

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      <HProgress value={90} style={styles.progress} />

      <View style={styles.header}>
        <Text style={styles.step}>Son Adım</Text>
        <Text style={styles.heading}>
          Hangi derslere{'\n'}giriyorsun?
        </Text>
        <Text style={styles.sub}>
          Planına sadece seçtiğin derslerin kazanımları girer.
        </Text>
      </View>

      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {available.map((item, idx) => {
            const isSelected = secili.has(item.ders);
            const gosterilenSiniflar = item.siniflar.filter(s => siniflar.includes(s));
            const prevItem = available[idx - 1];
            const showDivider = item.paylasimli && (!prevItem || !prevItem.paylasimli);
            return (
              <React.Fragment key={item.ders}>
                {showDivider && (
                  <Text style={styles.dividerLabel}>Paylaşımlı — branş öğretmeni yoksa</Text>
                )}
                <TouchableOpacity
                  onPress={() => toggle(item.ders)}
                  activeOpacity={0.75}
                  style={[styles.card, isSelected && styles.cardSelected]}
                >
                  <View style={[styles.check, isSelected && styles.checkSelected]}>
                    {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                      {item.ders}
                    </Text>
                    <Text style={[styles.cardSub, isSelected && styles.cardSubSelected]}>
                      {sinifEtiket(gosterilenSiniflar)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.ctaBar}>
        <HBtn onPress={handleKur} disabled={secili.size === 0}>
          Yılımı kur →
        </HBtn>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { borderRadius: 0 } as ViewStyle,

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  } as ViewStyle,

  step: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  heading: {
    fontSize: 30,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    lineHeight: 36,
    letterSpacing: -0.5,
  } as TextStyle,

  sub: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text2,
  } as TextStyle,

  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  } as ViewStyle,

  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  } as ViewStyle,

  dividerLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.text3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  } as TextStyle,

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.base,
    backgroundColor: colors.surface,
  } as ViewStyle,

  cardSelected: {
    borderColor: colors.accent,
    borderWidth: 1.5,
    backgroundColor: colors.accentLt,
  } as ViewStyle,

  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,

  checkSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,

  cardTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  cardTitleSelected: {
    color: colors.accent,
  } as TextStyle,

  cardSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 2,
  } as TextStyle,

  cardSubSelected: {
    color: colors.accent,
    opacity: 0.7,
  } as TextStyle,

  ctaBar: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  } as ViewStyle,
});
