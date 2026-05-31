import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sunrise, Bell, BookOpen, Pencil, Zap, ClipboardList,
  Calendar, AlertCircle, ChevronRight, FolderOpen, CircleUser,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { YillikPlan, PlanHaftasi } from '../../lib/planUret';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Tile tanımları ───────────────────────────────────────────────────────────

type LucideIconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const HIZLI_TIPLER: { id: string; label: string; Icon: LucideIconType; bg: string; fg: string }[] = [
  { id: 'ders',     label: 'Ders Planı',      Icon: BookOpen,     bg: colors.catBlueLt,   fg: colors.catBlue   },
  { id: 'sorular',  label: 'Sınav',            Icon: Pencil,   bg: colors.catPurpleLt, fg: colors.catPurple },
  { id: 'etkinlik', label: 'Etkinlik',         Icon: Zap,    bg: colors.catOrangeLt, fg: colors.catOrange },
  { id: 'yaprak',   label: 'Çalışma Yaprağı', Icon: ClipboardList, bg: colors.catGreenLt, fg: colors.catGreen  },
];

const SON_HAZIRLANLAR: { id: string; tip: string; baslik: string; sinif: string; tarih: string; Icon: LucideIconType; bg: string; fg: string }[] = [
  { id: '1', tip: 'Sınav',      baslik: 'Üslü İfadeler', sinif: '9-A',  tarih: 'Bugün',      Icon: Pencil,    bg: colors.catPurpleLt, fg: colors.catPurple },
  { id: '2', tip: 'Ders Planı', baslik: 'Polinomlar',    sinif: '10-B', tarih: 'Dün',        Icon: BookOpen,      bg: colors.catBlueLt,   fg: colors.catBlue   },
  { id: '3', tip: 'Etkinlik',   baslik: 'Trigonometri',  sinif: '11-A', tarih: '2 gün önce', Icon: Zap,     bg: colors.catOrangeLt, fg: colors.catOrange },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBugun(): { gun: string; tarih: string } {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const d = new Date();
  return { gun: days[d.getDay()], tarih: `${d.getDate()} ${months[d.getMonth()]}` };
}

function parseLocal(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatAralik(bas: string, bit: string): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const b = parseLocal(bas);
  const s = parseLocal(bit);
  if (b.getMonth() === s.getMonth())
    return `${b.getDate()}–${s.getDate()} ${months[b.getMonth()]}`;
  return `${b.getDate()} ${months[b.getMonth()]} – ${s.getDate()} ${months[s.getMonth()]}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type KazanimPeek = { kod: string; sinif: string; konu: string; hazir: boolean };

type HaftaData = {
  no: number;
  tarihAraligi: string;
  kazanimSayisi: number;
  hazirSayisi: number;
  tamamlandi: boolean;
  simdiki: boolean;
  tatil?: boolean;
  tatilAdi?: string;
  kazanimlar: KazanimPeek[];
};

function buildHaftaList(haftalar: PlanHaftasi[]): { list: HaftaData[]; currentIdx: number } {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  let currentIdx = -1;

  const list: HaftaData[] = haftalar.map((h, idx) => {
    const bas = parseLocal(h.baslangic);
    const bit = parseLocal(h.bitis);
    bit.setHours(23, 59, 59, 999);
    const isCurrentWeek = !h.tatil_mi && today >= bas && today <= bit;
    if (isCurrentWeek) currentIdx = idx;
    const tamamlandi = !h.tatil_mi && !isCurrentWeek && today > bit;
    return {
      no: h.hafta_no,
      tarihAraligi: formatAralik(h.baslangic, h.bitis),
      kazanimSayisi: h.kazanimlar.length,
      hazirSayisi: 0,
      tamamlandi,
      simdiki: isCurrentWeek,
      tatil: h.tatil_mi,
      tatilAdi: h.tatil_adi ?? undefined,
      kazanimlar: h.kazanimlar.map(k => ({
        kod: k.kod,
        sinif: `${k.sinif}. Sınıf`,
        konu: k.ad,
        hazir: false,
      })),
    };
  });

  if (currentIdx === -1) {
    const lastBit = parseLocal(haftalar[haftalar.length - 1]?.bitis ?? '2000-01-01');
    lastBit.setHours(23, 59, 59, 999);
    if (today > lastBit) {
      const rev = [...list].reverse().findIndex(h => !h.tatil);
      if (rev >= 0) { const ri = list.length - 1 - rev; list[ri].simdiki = true; list[ri].tamamlandi = false; currentIdx = ri; }
    } else {
      const next = haftalar.findIndex(h => !h.tatil_mi && parseLocal(h.baslangic) > today);
      if (next >= 0) { list[next].simdiki = true; list[next].tamamlandi = false; currentIdx = next; }
      else {
        const rev = [...list].reverse().findIndex(h => !h.tatil);
        if (rev >= 0) { const ri = list.length - 1 - rev; list[ri].simdiki = true; list[ri].tamamlandi = false; currentIdx = ri; }
      }
    }
  }
  return { list, currentIdx };
}

function findNextTatil(haftalar: HaftaData[], currentIdx: number): string | null {
  for (let i = currentIdx + 1; i <= Math.min(currentIdx + 2, haftalar.length - 1); i++) {
    if (haftalar[i].tatil) return haftalar[i].tatilAdi ?? 'Tatil';
  }
  return null;
}

// ─── Gradient Header ──────────────────────────────────────────────────────────

function GradientHeader({
  gun, tarih, ad, brans, aktifNo, toplam, onProfilPress,
}: {
  gun: string; tarih: string; ad: string;
  brans: string | null; aktifNo: number; toplam: number;
  onProfilPress: () => void;
}) {
  const yuzde = toplam > 0 ? Math.max(0, aktifNo - 1) / toplam : 0;
  return (
    <LinearGradient
      colors={['#2563EB', '#1D4ED8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      {/* İkon + zil */}
      <View style={styles.headerTop}>
        <LinearGradient
          colors={['#F59E0B', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetIcon}
        >
          <Sunrise size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <Bell size={18} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellBtn} onPress={onProfilPress} activeOpacity={0.7}>
            <CircleUser size={18} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selamlama — hero metin */}
      <Text style={styles.greetText}>Merhaba, {ad}!</Text>

      {/* Branş — belirgin */}
      {brans && <Text style={styles.bransLabel}>{brans}</Text>}

      {/* Tarih — ikincil */}
      <Text style={styles.dateCompact}>{gun}, {tarih}</Text>

      {/* Hafta bağlamı */}
      {aktifNo > 0 && (
        <Text style={styles.headerMeta}>
          Hafta {aktifNo} / {toplam}
        </Text>
      )}

      {/* Dönem progress */}
      <View style={styles.headerTrack}>
        <View style={[styles.headerFill, { width: `${Math.max(yuzde * 100, 1)}%` as any }]} />
      </View>
    </LinearGradient>
  );
}

// ─── Tatil Uyarısı ────────────────────────────────────────────────────────────

function TatilUyarisi({ tatilAdi }: { tatilAdi: string }) {
  return (
    <View style={styles.tatilStrip}>
      <Calendar size={15} color={colors.warning} strokeWidth={2.5} />
      <Text style={styles.tatilText}>
        Önümüzdeki hafta <Text style={styles.tatilBold}>{tatilAdi}</Text> — planlamayı buna göre ayarla.
      </Text>
    </View>
  );
}

// ─── Proaktif Öneri ───────────────────────────────────────────────────────────

function ProaktifOneri({ kalan, onPress }: { kalan: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.oneriStrip} onPress={onPress} activeOpacity={0.8}>
      <AlertCircle size={15} color={colors.accent} strokeWidth={2.5} />
      <Text style={styles.oneriText}>
        Bu hafta {kalan} kazanım henüz hazırlanmadı.
      </Text>
      <ChevronRight size={14} color={colors.accent} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

// ─── Bu Hafta kartı ───────────────────────────────────────────────────────────

function BuHaftaCard({ hafta, onDetay }: { hafta: HaftaData; onDetay: () => void }) {
  const progress = hafta.kazanimSayisi > 0 ? hafta.hazirSayisi / hafta.kazanimSayisi : 0;
  const peek = hafta.kazanimlar.slice(0, 3);
  const remaining = hafta.kazanimSayisi - peek.length;

  return (
    <View style={styles.buHaftaCard}>
      <View style={styles.buHaftaTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.buHaftaEtiket}>Bu Hafta</Text>
          <Text style={styles.buHaftaNo}>Hafta {hafta.no} · {hafta.tarihAraligi}</Text>
        </View>
        <TouchableOpacity style={styles.detayBtn} onPress={onDetay} activeOpacity={0.7}>
          <Text style={styles.detayBtnText}>Tümünü gör</Text>
          <ChevronRight size={13} color={colors.accent} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <Text style={styles.progressLabel}>
        {hafta.hazirSayisi} / {hafta.kazanimSayisi} kazanım hazır
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 1)}%` as any }]} />
      </View>

      {peek.length > 0 && (
        <View style={styles.peekList}>
          {peek.map((k, i) => (
            <View key={i} style={[styles.peekRow, i < peek.length - 1 && styles.peekRowDivider]}>
              <View style={[
                styles.peekDot,
                { backgroundColor: k.hazir ? colors.success : colors.warning },
              ]} />
              <Text style={styles.peekKonu} numberOfLines={1}>{k.konu}</Text>
              <Text style={styles.peekSinif}>{k.sinif}</Text>
            </View>
          ))}
          {remaining > 0 && (
            <TouchableOpacity style={styles.peekMore} onPress={onDetay} activeOpacity={0.7}>
              <Text style={styles.peekMoreText}>ve {remaining} kazanım daha</Text>
              <ChevronRight size={12} color={colors.text3} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Hızlı Hazırla ────────────────────────────────────────────────────────────

function HizliHazirla({ onTipSec }: { onTipSec: (id: string) => void }) {
  return (
    <View style={styles.hizliGrid}>
      {([0, 2] as const).map(start => (
        <View key={start} style={styles.hizliRow}>
          {HIZLI_TIPLER.slice(start, start + 2).map(tip => (
            <TouchableOpacity
              key={tip.id}
              style={[styles.hizliTile, { backgroundColor: tip.bg, borderColor: tip.fg }]}
              onPress={() => onTipSec(tip.id)}
              activeOpacity={0.8}
            >
              <tip.Icon size={28} color={tip.fg} />
              <Text style={[styles.hizliLabel, { color: tip.fg }]}>{tip.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Son Hazırlananlar ────────────────────────────────────────────────────────

function SonHazirlanlar() {
  return (
    <View style={styles.sonSection}>
      <Text style={styles.sectionTitle}>Son Hazırlananlar</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sonScroll}
      >
        {SON_HAZIRLANLAR.map(item => (
          <TouchableOpacity key={item.id} style={styles.sonCard} activeOpacity={0.8}>
            <View style={[styles.sonIcon, { backgroundColor: item.bg }]}>
              <item.Icon size={18} color={item.fg} />
            </View>
            <Text style={styles.sonTip}>{item.tip}</Text>
            <Text style={styles.sonBaslik} numberOfLines={2}>{item.baslik}</Text>
            <View style={styles.sonMeta}>
              <Text style={styles.sonSinif}>{item.sinif}</Text>
              <Text style={styles.sonTarih}>{item.tarih}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Önümüzdeki Haftalar ──────────────────────────────────────────────────────

function OnumUzdekiHaftalar({ haftalar }: { haftalar: HaftaData[] }) {
  const sonraki = haftalar
    .filter(h => !h.tamamlandi && !h.simdiki && !h.tatil)
    .slice(0, 2);
  if (sonraki.length === 0) return null;
  return (
    <View style={styles.onumSection}>
      <Text style={styles.sectionTitle}>Önümüzdeki Haftalar</Text>
      <View style={styles.onumCard}>
        {sonraki.map((h, i) => (
          <View key={h.no} style={[styles.compactRow, i < sonraki.length - 1 && styles.compactDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.compactLabel}>Hafta {h.no}</Text>
              <Text style={styles.compactSub}>{h.tarihAraligi}</Text>
            </View>
            {h.kazanimSayisi > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{h.kazanimSayisi} kazanım</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────

export function PlanimScreen() {
  const navigation = useNavigation<Nav>();
  const { plan: ctxPlan } = useOnboarding();
  const [plan, setPlan]         = useState<YillikPlan | null>(ctxPlan);
  const [loading, setLoading]   = useState(!ctxPlan);
  const [kullaniciAdi, setAd]   = useState('Ayşe Kaya');

  useEffect(() => {
    if (ctxPlan) { setPlan(ctxPlan); setLoading(false); }
  }, [ctxPlan]);

  useEffect(() => {
    if (!ctxPlan) {
      AsyncStorage.getItem('@yaver/yillik_plan').then(raw => {
        if (raw) setPlan(JSON.parse(raw));
        setLoading(false);
      });
    }
    AsyncStorage.getItem('@yaver/kullanici_adi').then(ad => {
      if (ad) setAd(ad);
    });
  }, []);

  const { list: haftalar, currentIdx } = plan
    ? buildHaftaList(plan.haftalar)
    : { list: [], currentIdx: -1 };

  const aktifHafta  = currentIdx >= 0 ? haftalar[currentIdx] : null;
  const aktifHaftalar = haftalar.filter(h => !h.tatil);
  const toplam      = aktifHaftalar.length;
  // Aktif hafta sırası: tatilsiz haftalar arasında kaçıncı? (hafta_no ≠ sıra numarası)
  const aktifSira   = aktifHafta
    ? aktifHaftalar.findIndex(h => h.no === aktifHafta.no) + 1
    : 1;
  const tatilUyari  = aktifHafta ? findNextTatil(haftalar, currentIdx) : null;
  const { gun, tarih } = formatBugun();

  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, []);
  const fadeSlide = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ translateY: (1 - anim.value) * 12 }],
  }));

  function handleDetay() {
    if (aktifHafta) navigation.navigate('HaftaDetayi', { haftaNo: aktifHafta.no });
  }

  if (loading) {
    return (
      <Screen bg={colors.bg}>
        <ActivityIndicator color={colors.accent} style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="light" />

      <GradientHeader
        gun={gun} tarih={tarih} ad={kullaniciAdi}
        brans={plan?.brans ?? null}
        aktifNo={aktifSira}
        toplam={toplam}
        onProfilPress={() => navigation.navigate('Profil')}
      />

      {plan ? (
        <Animated.ScrollView
          style={[{ flex: 1 }, fadeSlide]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tatilUyari && <TatilUyarisi tatilAdi={tatilUyari} />}

          {aktifHafta && aktifHafta.hazirSayisi < aktifHafta.kazanimSayisi && (
            <ProaktifOneri
              kalan={aktifHafta.kazanimSayisi - aktifHafta.hazirSayisi}
              onPress={handleDetay}
            />
          )}

          {aktifHafta && <BuHaftaCard hafta={aktifHafta} onDetay={handleDetay} />}

          <TouchableOpacity
            style={styles.dersProgramiStrip}
            onPress={() => navigation.navigate('DersProgrami')}
            activeOpacity={0.8}
          >
            <Calendar size={15} color={colors.text3} />
            <Text style={styles.dersProgramiText}>Ders programını ekle</Text>
            <ChevronRight size={13} color={colors.text3} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Hızlı Hazırla</Text>
            <HizliHazirla
              onTipSec={(id) => navigation.navigate('Uretim', { icerikTuru: id })}
            />
          </View>

          <SonHazirlanlar />
          <OnumUzdekiHaftalar haftalar={haftalar} />

          <View style={{ height: 100 }} />
        </Animated.ScrollView>
      ) : (
        <Animated.View style={[styles.emptyContainer, fadeSlide]}>
          <FolderOpen size={52} color={colors.text3} strokeWidth={1} />
          <Text style={styles.emptyTitle}>Henüz bir planın yok.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('Brans')}
          >
            <Text style={styles.emptyBtnText}>Planı Kur →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Screen>
  );
}

// ─── Stiller ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // Header
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: 14,
    gap: 5,
  } as ViewStyle,
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  greetIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  greetText: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: '#fff',
    letterSpacing: -0.3,
    lineHeight: 28,
  } as TextStyle,
  bransLabel: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: -0.2,
  } as TextStyle,
  dateCompact: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.72)',
  } as TextStyle,
  headerMeta: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.45)',
  } as TextStyle,
  headerTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginTop: 2,
  } as ViewStyle,
  headerFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  } as ViewStyle,

  // Scroll
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: 14,
  } as ViewStyle,

  // Tatil uyarısı
  tatilStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.warningLt,
    borderWidth: 1,
    borderColor: colors.warningMd,
    borderRadius: radius.card,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 10,
  } as ViewStyle,
  tatilText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.warning,
    lineHeight: 18,
  } as TextStyle,
  tatilBold: { fontFamily: fonts.bold } as TextStyle,

  // Proaktif öneri
  oneriStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentLt,
    borderWidth: 1,
    borderColor: colors.accentMd,
    borderRadius: radius.card,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 12,
  } as ViewStyle,
  oneriText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.accent,
  } as TextStyle,

  // Bu Hafta — neon glow
  buHaftaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 14,
    marginBottom: 14,
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  } as ViewStyle,
  buHaftaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  } as ViewStyle,
  buHaftaEtiket: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.accent,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  } as TextStyle,
  buHaftaNo: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text1,
    letterSpacing: -0.2,
  } as TextStyle,
  detayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
    paddingTop: 2,
    flexShrink: 0,
  } as ViewStyle,
  detayBtnText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  } as TextStyle,
  progressLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  } as ViewStyle,
  progressFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  } as ViewStyle,
  peekList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 2,
  } as ViewStyle,
  peekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 9,
  } as ViewStyle,
  peekRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  peekDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
  } as ViewStyle,
  peekKonu: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text1,
  } as TextStyle,
  peekSinif: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.text3,
    flexShrink: 0,
  } as TextStyle,
  peekMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    gap: 3,
  } as ViewStyle,
  peekMoreText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  // Ders programı CTA
  dersProgramiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 14,
  } as ViewStyle,
  dersProgramiText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  // Section
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text2,
    marginBottom: 10,
  } as TextStyle,
  sectionWrap: { marginBottom: 14 } as ViewStyle,

  // Hızlı Hazırla
  hizliGrid: { gap: 10, marginBottom: 0 } as ViewStyle,
  hizliRow:  { flexDirection: 'row', gap: 10 } as ViewStyle,
  hizliTile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  } as ViewStyle,
  hizliLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  } as TextStyle,

  // Son Hazırlananlar
  sonSection: { marginBottom: 14 } as ViewStyle,
  sonScroll:  { gap: 10, paddingRight: 4 } as ViewStyle,
  sonCard: {
    width: 148,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 6,
    ...shadows.card,
  } as ViewStyle,
  sonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  } as ViewStyle,
  sonTip: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  } as TextStyle,
  sonBaslik: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text1,
    lineHeight: 18,
  } as TextStyle,
  sonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  } as ViewStyle,
  sonSinif: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  } as TextStyle,
  sonTarih: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text3,
  } as TextStyle,

  // Önümüzdeki Haftalar
  onumSection: { marginBottom: 14 } as ViewStyle,
  onumCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  } as ViewStyle,
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: spacing.sm,
  } as ViewStyle,
  compactDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  compactLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text2,
  } as TextStyle,
  compactSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 2,
  } as TextStyle,
  countBadge: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
  } as ViewStyle,
  countBadgeText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.base,
  } as ViewStyle,
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text2,
    textAlign: 'center',
  } as TextStyle,
  emptyBtn: {
    backgroundColor: colors.text1,
    borderRadius: radius.btn,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
  } as ViewStyle,
  emptyBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#fff',
  } as TextStyle,
});
