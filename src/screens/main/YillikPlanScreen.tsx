import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { sinifLabel } from '../../lib/sinifLabel';
import { turkceBuyuk } from '../../lib/turkce';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { YillikPlan, PlanHaftasi, Kazanim } from '../../lib/planUret';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Renk paleti (sınıfa göre) ────────────────────────────────────────────────

const SINIF_RENKLER: Record<number, { fg: string; bg: string }> = {
  1:  { fg: colors.catTeal,   bg: colors.catTealLt   },
  2:  { fg: colors.catTeal,   bg: colors.catTealLt   },
  3:  { fg: colors.catTeal,   bg: colors.catTealLt   },
  4:  { fg: colors.catTeal,   bg: colors.catTealLt   },
  5:  { fg: colors.catGreen,  bg: colors.catGreenLt  },
  6:  { fg: colors.catGreen,  bg: colors.catGreenLt  },
  7:  { fg: colors.catGreen,  bg: colors.catGreenLt  },
  8:  { fg: colors.catGreen,  bg: colors.catGreenLt  },
  9:  { fg: colors.catBlue,   bg: colors.catBlueLt   },
  10: { fg: colors.catPurple, bg: colors.catPurpleLt },
  11: { fg: colors.catOrange, bg: colors.catOrangeLt },
  12: { fg: colors.catRed,    bg: colors.catRedLt    },
};

function sinifRenk(sinif: number) {
  return SINIF_RENKLER[sinif] ?? { fg: colors.text3, bg: colors.bg };
}

// ─── Tarih yardımcıları ───────────────────────────────────────────────────────

function parseLocal(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatAralik(bas: string, bit: string): string {
  const M = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
             'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const b = parseLocal(bas);
  const s = parseLocal(bit);
  if (b.getMonth() === s.getMonth()) return `${b.getDate()}–${s.getDate()} ${M[b.getMonth()]}`;
  return `${b.getDate()} ${M[b.getMonth()]} – ${s.getDate()} ${M[s.getMonth()]}`;
}

// ─── Veri yapısı ─────────────────────────────────────────────────────────────

function getAyAdi(dateStr: string): string {
  const M = ['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN',
             'TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'];
  return M[parseLocal(dateStr).getMonth()];
}

type AyGrup   = { ay: string; haftalar: PlanHaftasi[] };
type DonemGrup = {
  baslik: string; aktifSayac: number;
  aylar: AyGrup[];
  yariyil?: boolean; yariyilBas?: string; yariyilBit?: string;
};

function grupByAy(haftalar: PlanHaftasi[]): AyGrup[] {
  const result: AyGrup[] = [];
  for (const h of haftalar) {
    const ay = getAyAdi(h.baslangic);
    const last = result[result.length - 1];
    if (last && last.ay === ay) last.haftalar.push(h);
    else result.push({ ay, haftalar: [h] });
  }
  return result;
}

function grupByDonemAy(haftalar: PlanHaftasi[]): DonemGrup[] {
  const ilk = haftalar.findIndex(h => h.tatil_adi?.includes('Yarıyıl'));
  if (ilk === -1) {
    return [{ baslik: '1. Dönem', aktifSayac: haftalar.filter(h => !h.tatil_mi).length, aylar: grupByAy(haftalar) }];
  }
  let son = ilk;
  while (son + 1 < haftalar.length && haftalar[son + 1].tatil_adi?.includes('Yarıyıl')) son++;

  const d1 = haftalar.slice(0, ilk);
  const yy = haftalar.slice(ilk, son + 1);
  const d2 = haftalar.slice(son + 1);
  return [
    { baslik: '1. Dönem', aktifSayac: d1.filter(h => !h.tatil_mi).length, aylar: grupByAy(d1) },
    { baslik: 'Yarıyıl Tatili', aktifSayac: 0, aylar: [],
      yariyil: true, yariyilBas: yy[0].baslangic, yariyilBit: yy[yy.length - 1].bitis },
    { baslik: '2. Dönem', aktifSayac: d2.filter(h => !h.tatil_mi).length, aylar: grupByAy(d2) },
  ];
}

// ─── Bileşenler ───────────────────────────────────────────────────────────────

function KazanimCard({ k, onPress }: { k: Kazanim; onPress: () => void }) {
  const renk = sinifRenk(k.sinif);
  return (
    <TouchableOpacity style={styles.kazanimCard} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.kazanimBar, { backgroundColor: renk.fg }]} />
      <View style={styles.kazanimIcerik}>
        <View style={styles.kazanimMeta}>
          <View style={[styles.sinifBadge, { backgroundColor: renk.bg }]}>
            <Text style={[styles.sinifBadgeText, { color: renk.fg }]}>{sinifLabel(k.sinif)}</Text>
          </View>
          {k.ders && (
            <View style={styles.dersBadge}>
              <Text style={styles.dersBadgeText} numberOfLines={1}>{k.ders}</Text>
            </View>
          )}
        </View>
        <Text style={styles.kazanimAd} numberOfLines={3}>{k.ad}</Text>
        <Text style={styles.kazanimKod}>{k.kod}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Ana ekran ────────────────────────────────────────────────────────────────

export function YillikPlanScreen() {
  const navigation = useNavigation<Nav>();
  const { plan: ctxPlan, brans, siniflar } = useOnboarding();
  const [plan, setPlan] = useState<YillikPlan | null>(ctxPlan);
  const [loading, setLoading] = useState(!ctxPlan);
  const [secilenSinif, setSecilenSinif] = useState<number | null>(null);

  useEffect(() => {
    if (ctxPlan) { setPlan(ctxPlan); setLoading(false); return; }
    AsyncStorage.getItem('@yaver/yillik_plan').then(raw => {
      if (raw) setPlan(JSON.parse(raw));
      setLoading(false);
    });
  }, [ctxPlan]);

  const sinifListesi: number[] = plan
    ? [...new Set(plan.haftalar.flatMap(h => h.kazanimlar.map(k => k.sinif)))].sort((a, b) => a - b)
    : [...siniflar].sort((a, b) => a - b);

  function filtreliKazanimlar(hafta: PlanHaftasi): Kazanim[] {
    if (secilenSinif === null) return hafta.kazanimlar;
    return hafta.kazanimlar.filter(k => k.sinif === secilenSinif);
  }

  const aktifHafta = plan?.haftalar.filter(h => !h.tatil_mi).length ?? 0;
  const toplamKazanim = plan?.toplam_kazanim ?? 0;
  const donemGruplari = plan ? grupByDonemAy(plan.haftalar) : [];

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="light" />

      {/* ─── Hero gradient ─── */}
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Dekoratif blob */}
        <View style={styles.blob} />

        <Text style={styles.heroBaslik}>{plan?.brans ?? brans}</Text>
        <Text style={styles.heroAlt}>
          Yıllık Plan
          {aktifHafta > 0 ? `  ·  ${aktifHafta} aktif hafta` : ''}
          {toplamKazanim > 0 ? `  ·  ${toplamKazanim} kazanım` : ''}
        </Text>

        {/* Sınıf filtreleri */}
        {sinifListesi.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            style={styles.chipScroll}
          >
            <TouchableOpacity
              style={[styles.chip, secilenSinif === null && styles.chipActive]}
              onPress={() => setSecilenSinif(null)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, secilenSinif === null && styles.chipTextActive]}>
                Tümü
              </Text>
            </TouchableOpacity>
            {sinifListesi.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, secilenSinif === s && styles.chipActive]}
                onPress={() => setSecilenSinif(s)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, secilenSinif === s && styles.chipTextActive]}>
                  {sinifLabel(s)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </LinearGradient>

      {/* ─── Panel ─── */}
      <View style={styles.panel}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xxl }} />
        ) : !plan ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Plan henüz oluşturulmadı.</Text>
            <Text style={styles.emptyHint}>Onboarding'i tamamlayarak başla.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {donemGruplari.map((grup, gi) => {
              if (grup.yariyil) {
                return (
                  <View key={gi} style={styles.yariyilSep}>
                    <View style={styles.yariyilLine} />
                    <View style={styles.yariyilChip}>
                      <Text style={styles.yariyilText}>
                        Yarıyıl Tatili · {formatAralik(grup.yariyilBas!, grup.yariyilBit!)}
                      </Text>
                    </View>
                    <View style={styles.yariyilLine} />
                  </View>
                );
              }

              return (
                <View key={gi} style={styles.donemBlok}>
                  {/* Dönem başlığı */}
                  <View style={styles.donemHeader}>
                    <Text style={styles.donemBaslik}>{turkceBuyuk(grup.baslik)}</Text>
                    <View style={styles.donemChip}>
                      <Text style={styles.donemChipText}>{grup.aktifSayac} aktif hafta</Text>
                    </View>
                  </View>

                  {/* Ay grupları */}
                  {grup.aylar.map((ayGrup, ai) => (
                    <View key={ai} style={styles.ayBlok}>
                      <View style={styles.ayHeader}>
                        <Text style={styles.ayLabel}>{ayGrup.ay}</Text>
                        <View style={styles.ayLine} />
                      </View>

                      {ayGrup.haftalar.map((hafta, hi) => {
                        const kazanimlar = filtreliKazanimlar(hafta);

                        if (hafta.tatil_mi) {
                          return (
                            <View key={hi} style={styles.tatilCard}>
                              <View style={styles.tatilLeft}>
                                <Text style={styles.tatilNo}>{hafta.hafta_no}</Text>
                              </View>
                              <View style={styles.tatilInfo}>
                                <Text style={styles.tatilAd}>{hafta.tatil_adi ?? 'Tatil'}</Text>
                                <Text style={styles.tatilTarih}>{formatAralik(hafta.baslangic, hafta.bitis)}</Text>
                              </View>
                              <View style={styles.tatilBadge}>
                                <Text style={styles.tatilBadgeText}>Tatil</Text>
                              </View>
                            </View>
                          );
                        }

                        if (kazanimlar.length === 0) return null;

                        return (
                          <View key={hi} style={styles.haftaBlok}>
                            <View style={styles.haftaHeader}>
                              <View style={styles.haftaNoBox}>
                                <Text style={styles.haftaNoText}>{hafta.hafta_no}</Text>
                              </View>
                              <Text style={styles.haftaTarih}>{formatAralik(hafta.baslangic, hafta.bitis)}</Text>
                              <View style={styles.haftaSayiChip}>
                                <Text style={styles.haftaSayiText}>{kazanimlar.length} kazanım</Text>
                              </View>
                            </View>
                            <View style={styles.kazanimListesi}>
                              {kazanimlar.map((k, ki) => (
                                <KazanimCard
                                  key={ki}
                                  k={k}
                                  onPress={() => navigation.navigate('HaftaDetayi', { haftaNo: hafta.hafta_no })}
                                />
                              ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: 6,
    overflow: 'hidden',
  } as ViewStyle,

  blob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#fff',
    opacity: 0.06,
    top: -120,
    right: -80,
  } as ViewStyle,

  heroBaslik: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
    color: '#fff',
    letterSpacing: -0.5,
  } as TextStyle,

  heroAlt: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 4,
  } as TextStyle,

  chipScroll: {
    flexGrow: 0,
    marginTop: 4,
  } as ViewStyle,

  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.base,
  } as ViewStyle,

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.btn,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  } as ViewStyle,

  chipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  } as ViewStyle,

  chipText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: 'rgba(255,255,255,0.9)',
  } as TextStyle,

  chipTextActive: {
    color: colors.accent,
  } as TextStyle,

  panel: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -18,
  } as ViewStyle,

  scroll: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingBottom: 110,
    gap: spacing.lg,
  } as ViewStyle,

  // ── Dönem ──
  donemBlok: {
    gap: spacing.md,
  } as ViewStyle,

  donemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  } as ViewStyle,

  donemBaslik: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: 0.8,
  } as TextStyle,

  donemChip: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingHorizontal: 10,
    paddingVertical: 4,
  } as ViewStyle,

  donemChipText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,

  // ── Yarıyıl ayracı ──
  yariyilSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xl,
  } as ViewStyle,

  yariyilLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.warningMd,
  } as ViewStyle,

  yariyilChip: {
    backgroundColor: colors.warningLt,
    borderRadius: radius.btn,
    paddingHorizontal: 12,
    paddingVertical: 6,
  } as ViewStyle,

  yariyilText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.warning,
    letterSpacing: 0.3,
  } as TextStyle,

  // ── Hafta ──
  haftaBlok: {
    gap: spacing.sm,
  } as ViewStyle,

  haftaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: 2,
  } as ViewStyle,

  haftaNoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accentLt,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  haftaNoText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,

  // ── Ay ──
  ayBlok: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  } as ViewStyle,

  ayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  } as ViewStyle,

  ayLabel: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.accent,
    letterSpacing: 1.0,
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingHorizontal: 10,
    paddingVertical: 4,
  } as TextStyle,

  ayLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.accentMd,
  } as ViewStyle,

  haftaTarih: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  haftaSayiChip: {
    height: 22,
    borderRadius: radius.btn,
    backgroundColor: colors.accentLt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  } as ViewStyle,

  haftaSayiText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,

  // ── Kazanım kartı ──
  kazanimListesi: {
    gap: spacing.sm,
  } as ViewStyle,

  kazanimCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  } as ViewStyle,

  kazanimBar: {
    width: 4,
  } as ViewStyle,

  kazanimIcerik: {
    flex: 1,
    padding: spacing.md,
    gap: 5,
  } as ViewStyle,

  kazanimMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,

  sinifBadge: {
    borderRadius: radius.btn,
    paddingHorizontal: 8,
    paddingVertical: 2,
  } as ViewStyle,

  sinifBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  } as TextStyle,

  dersBadge: {
    borderRadius: radius.btn,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 160,
  } as ViewStyle,

  dersBadgeText: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    color: colors.text2,
  } as TextStyle,

  kazanimAd: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text1,
    lineHeight: 19,
  } as TextStyle,

  kazanimKod: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginTop: 1,
  } as TextStyle,

  // ── Tatil ──
  tatilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    opacity: 0.6,
  } as ViewStyle,

  tatilLeft: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  tatilNo: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.text3,
  } as TextStyle,

  tatilInfo: {
    flex: 1,
    gap: 2,
  } as ViewStyle,

  tatilAd: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text2,
  } as TextStyle,

  tatilTarih: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  tatilBadge: {
    backgroundColor: colors.catAmberLt,
    borderRadius: radius.btn,
    paddingVertical: 4,
    paddingHorizontal: 10,
  } as ViewStyle,

  tatilBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.catAmber,
  } as TextStyle,

  // ── Boş durum ──
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  } as ViewStyle,

  emptyText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text2,
  } as TextStyle,

  emptyHint: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,
});
