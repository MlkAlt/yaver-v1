import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, ActivityIndicator,
  LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '../../components/layout/Screen';
import { StackBottomNav } from '../../components/layout/StackBottomNav';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { YillikPlan, Kazanim } from '../../lib/planUret';
import { RootStackParamList } from '../../navigation/RootNavigator';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'HaftaDetayi'>;

const ICERIK_TURLERI: { id: string; label: string }[] = [
  { id: 'ders_plani',       label: 'Ders Planı' },
  { id: 'etkinlik',         label: 'Etkinlik' },
  { id: 'calisma_yapragi',  label: 'Çalışma Yaprağı' },
  { id: 'sorular',          label: 'Sorular' },
];

function parseLocal(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatAralik(bas: string, bit: string): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const b = parseLocal(bas);
  const s = parseLocal(bit);
  if (b.getMonth() === s.getMonth()) {
    return `${b.getDate()}–${s.getDate()} ${months[b.getMonth()]}`;
  }
  return `${b.getDate()} ${months[b.getMonth()]}–${s.getDate()} ${months[s.getMonth()]}`;
}

type Grup = { sinif: string; kazanimlar: Kazanim[] };

function groupBySinif(kazanimlar: Kazanim[]): Grup[] {
  const map = new Map<number, Kazanim[]>();
  for (const k of kazanimlar) {
    if (!map.has(k.sinif)) map.set(k.sinif, []);
    map.get(k.sinif)!.push(k);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([sinif, list]) => ({ sinif: `${sinif}. Sınıf`, kazanimlar: list }));
}

export function HaftaDetayiScreen({ route, navigation }: Props) {
  const { haftaNo } = route.params;
  const { plan: ctxPlan } = useOnboarding();
  const [plan, setPlan] = useState<YillikPlan | null>(ctxPlan);
  const [loading, setLoading] = useState(!ctxPlan);
  const [expandedKod, setExpandedKod] = useState<string | null>(null);

  useEffect(() => {
    if (ctxPlan) { setPlan(ctxPlan); setLoading(false); return; }
    AsyncStorage.getItem('@yaver/yillik_plan').then(raw => {
      if (raw) setPlan(JSON.parse(raw));
      setLoading(false);
    });
  }, [ctxPlan]);

  const hafta = plan?.haftalar.find(h => h.hafta_no === haftaNo);
  const gruplar: Grup[] = hafta ? groupBySinif(hafta.kazanimlar) : [];
  const tarih = hafta ? formatAralik(hafta.baslangic, hafta.bitis) : '';
  const toplamKazanim = hafta?.kazanimlar.length ?? 0;

  const toggleExpand = (kod: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedKod(prev => (prev === kod ? null : kod));
  };

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.blob} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.haftaLabel}>HAFTA</Text>
        <Text style={styles.haftaNum}>{haftaNo}</Text>
        <Text style={styles.heroSub}>
          Kazanımı seç, içerik türünü belirt — Yaver hemen hazırlasın.
        </Text>

        <View style={styles.heroMeta}>
          {tarih ? (
            <View style={styles.tarihChip}>
              <Calendar size={12} color={colors.text3} strokeWidth={1.5} />
              <Text style={styles.tarihText}>{tarih}</Text>
            </View>
          ) : null}
          {hafta?.tatil_mi && (
            <View style={styles.tatilChip}>
              <Text style={styles.tatilText}>{hafta.tatil_adi ?? 'Tatil'}</Text>
            </View>
          )}
          {!hafta?.tatil_mi && toplamKazanim > 0 && (
            <View style={styles.kazanimChip}>
              <Text style={styles.kazanimChipText}>{toplamKazanim} kazanım</Text>
            </View>
          )}
        </View>
      </View>

      {/* Panel */}
      <View style={styles.panel}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {hafta?.tatil_mi && (
              <View style={styles.tatilCard}>
                <Text style={styles.tatilCardTitle}>{hafta.tatil_adi ?? 'Tatil'}</Text>
                <Text style={styles.tatilCardSub}>Bu hafta tatil, kazanım yok.</Text>
              </View>
            )}

            {gruplar.map((grup, gi) => (
              <View key={gi} style={styles.grup}>
                <Text style={styles.grupLabel}>{grup.sinif}</Text>
                {grup.kazanimlar.map((k, ki) => {
                  const isOpen = expandedKod === k.kod;
                  return (
                    <View key={ki} style={styles.kazanimCard}>
                      <View style={styles.kazanimTop}>
                        <Text style={styles.kazanimKod}>{k.kod}</Text>
                        <View style={styles.todoChip}>
                          <View style={styles.todoDot} />
                          <Text style={styles.todoChipText}>Hazırlanmadı</Text>
                        </View>
                      </View>
                      <Text style={styles.kazanimAd}>{k.ad}</Text>
                      <Text style={styles.kazanimUnite}>{k.unite}</Text>

                      <TouchableOpacity
                        style={[styles.hazirlaBtn, isOpen && styles.hazirlaBtnOpen]}
                        activeOpacity={0.8}
                        onPress={() => toggleExpand(k.kod)}
                      >
                        <Text style={styles.hazirlaBtnText}>
                          {isOpen ? 'Kapat' : 'Benim yerime hazırla'}
                        </Text>
                      </TouchableOpacity>

                      {isOpen && (
                        <View style={styles.chipRow}>
                          {ICERIK_TURLERI.map(t => (
                            <TouchableOpacity
                              key={t.id}
                              style={styles.chip}
                              activeOpacity={0.75}
                              onPress={() => navigation.navigate('Uretim', {
                                kazanimKodu: k.kod,
                                sinif:       `${k.sinif}. Sınıf`,
                                kazanimAdi:  k.ad,
                                icerikTuru:  t.id,
                              })}
                            >
                              <Text style={styles.chipText}>{t.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}

            {!loading && !hafta && (
              <Text style={styles.emptyText}>Bu hafta bulunamadı.</Text>
            )}
            {!loading && hafta && !hafta.tatil_mi && gruplar.length === 0 && (
              <Text style={styles.emptyText}>Bu hafta için kazanım atanmamış.</Text>
            )}

            {gruplar.length > 1 && (
              <TouchableOpacity style={styles.topluCard} activeOpacity={0.8}>
                <Text style={styles.topluTitle}>Bu haftayı toplu hazırla</Text>
                <Text style={styles.topluSub}>{toplamKazanim} kazanım için içerik seti</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      <StackBottomNav activeIndex={0} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    gap: 4,
  } as ViewStyle,

  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accent,
    opacity: 0.07,
    top: -100,
    right: -70,
  } as ViewStyle,

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  } as ViewStyle,

  backArrow: {
    fontSize: 18,
    color: colors.text1,
    lineHeight: 22,
  } as TextStyle,

  haftaLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  haftaNum: {
    fontSize: 52,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -2,
    lineHeight: 56,
    marginTop: -2,
  } as TextStyle,

  heroSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text2,
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 260,
  } as TextStyle,

  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  } as ViewStyle,

  tarihChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  tarihText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  tatilChip: {
    backgroundColor: colors.catAmberLt,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  tatilText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.catAmber,
  } as TextStyle,

  kazanimChip: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  kazanimChipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.accent,
  } as TextStyle,

  panel: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  } as ViewStyle,

  scroll: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: 100,
  } as ViewStyle,

  tatilCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,

  tatilCardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  tatilCardSub: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  grup: { gap: spacing.sm } as ViewStyle,

  grupLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  } as TextStyle,

  kazanimCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: spacing.base,
    gap: spacing.sm,
  } as ViewStyle,

  kazanimTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as ViewStyle,

  kazanimKod: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  todoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningLt,
    borderRadius: radius.btn,
    paddingVertical: 2,
    paddingHorizontal: 8,
  } as ViewStyle,

  todoDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.warning,
  } as ViewStyle,

  todoChipText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.warning,
  } as TextStyle,

  kazanimAd: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text1,
    lineHeight: 22,
  } as TextStyle,

  kazanimUnite: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  hazirlaBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: spacing.xs,
  } as ViewStyle,

  hazirlaBtnOpen: {
    backgroundColor: colors.text3,
  } as ViewStyle,

  hazirlaBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#fff',
  } as TextStyle,

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  } as ViewStyle,

  chip: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.accentLt,
  } as ViewStyle,

  chipText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  } as TextStyle,

  topluCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: 4,
    alignItems: 'center',
    marginTop: spacing.sm,
  } as ViewStyle,

  topluTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  topluSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginTop: spacing.xl,
  } as TextStyle,
});
