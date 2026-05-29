import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { StackBottomNav } from '../../components/layout/StackBottomNav';
import { HBtn } from '../../components/atoms/HBtn';
import { HChip } from '../../components/atoms/HChip';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { supabase } from '../../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Uretim'>;

const TIPLER = [
  { id: 'sorular',  label: 'Sorular',        sub: 'Test / açık uç' },
  { id: 'etkinlik', label: 'Etkinlik',        sub: 'Sınıf aktivitesi' },
  { id: 'ders',     label: 'Ders Planı',      sub: 'Kazanım bazlı' },
  { id: 'yaprak',   label: 'Çalışma Yaprağı', sub: 'Bireysel çalışma' },
];

const SORU_SAYILARI = [5, 10, 15, 20];
const ZORLUKLAR = ['Kolay', 'Karışık', 'Zor'];
const SORU_TIPLERI = ['Çoktan Seçmeli', 'Açık Uçlu', 'Karışık'];

export function UretimScreen({ route, navigation }: Props) {
  const baglam = route.params;
  const [seciliTip, setSeciliTip] = useState('sorular');
  const [soruSayisi, setSoruSayisi] = useState(10);
  const [zorluk, setZorluk] = useState('Karışık');
  const [soruTipi, setSoruTipi] = useState('Karışık');
  const [loading, setLoading] = useState(false);

  async function hazirla() {
    setLoading(true);
    try {
      const sinifNo = parseInt(baglam?.sinif ?? '9') || 9;
      const tipMap: Record<string, string> = {
        sorular: 'sorular', etkinlik: 'etkinlik', ders: 'ders_plani', yaprak: 'calisma_yapragi',
      };
      const zorlukMap: Record<string, string> = { 'Kolay': 'kolay', 'Karışık': 'orta', 'Zor': 'zor' };
      const formatMap: Record<string, string> = {
        'Çoktan Seçmeli': 'coktan_secmeli', 'Açık Uçlu': 'kisa_cevap', 'Karışık': 'coktan_secmeli',
      };

      const ayarlar: Record<string, unknown> =
        seciliTip === 'sorular' ? { sayi: soruSayisi, zorluk: zorlukMap[zorluk] ?? 'orta', format: formatMap[soruTipi] ?? 'coktan_secmeli' } :
        seciliTip === 'etkinlik' ? { sure: 20, yapi: 'bireysel' } :
        seciliTip === 'ders'     ? { sure: 40 } :
                                   { sayi: 10, format: 'karisik' };

      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          kazanimKod: baglam?.kazanimKodu ?? '',
          kazanimAd:  baglam?.kazanimAdi  ?? '',
          sinif:      sinifNo,
          tip:        tipMap[seciliTip] ?? 'sorular',
          ayarlar,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      navigation.navigate('Cikti', {
        tip: seciliTip,
        icerik: data?.icerik ?? '',
        baglam: `${baglam?.kazanimKodu ?? ''} · ${baglam?.sinif ?? ''}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      {/* Dark bağlam header */}
      <View style={styles.hero}>
        <View style={styles.blob} />

        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Kazanım bilgisi */}
        <Text style={styles.heroLabel}>BAĞLAM</Text>
        <Text style={styles.heroKazanim} numberOfLines={2}>
          {baglam?.kazanimAdi ?? 'Kazanım'}
        </Text>
        <View style={styles.heroMeta}>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>{baglam?.kazanimKodu ?? '—'}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>{baglam?.sinif ?? '9. Sınıf'}</Text>
          </View>
        </View>
      </View>

      {/* Form panel — warm bg */}
      <View style={styles.panel}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tip seçici */}
          <Text style={styles.sectionLabel}>NE HAZIRLANSIN?</Text>
          <View style={styles.tipGrid}>
            {TIPLER.map((t) => {
              const isActive = seciliTip === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSeciliTip(t.id)}
                  activeOpacity={0.8}
                  style={[styles.tipCard, isActive && styles.tipCardActive]}
                >
                  <Text style={[styles.tipLabel, isActive && styles.tipLabelActive]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.tipSub, isActive && styles.tipSubActive]}>
                    {t.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Soru ayarları */}
          {seciliTip === 'sorular' && (
            <View style={styles.ayarlar}>
              <Text style={styles.ayarBaslik}>Soru sayısı</Text>
              <View style={styles.chipRow}>
                {SORU_SAYILARI.map((n) => (
                  <HChip key={n} active={soruSayisi === n} onPress={() => setSoruSayisi(n)}>
                    {n}
                  </HChip>
                ))}
              </View>

              <Text style={styles.ayarBaslik}>Zorluk</Text>
              <View style={styles.chipRow}>
                {ZORLUKLAR.map((z) => (
                  <HChip key={z} active={zorluk === z} onPress={() => setZorluk(z)}>
                    {z}
                  </HChip>
                ))}
              </View>

              <Text style={styles.ayarBaslik}>Soru tipi</Text>
              <View style={styles.chipRow}>
                {SORU_TIPLERI.map((s) => (
                  <HChip key={s} active={soruTipi === s} onPress={() => setSoruTipi(s)}>
                    {s}
                  </HChip>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* CTA bar */}
        <View style={styles.ctaBar}>
          <HBtn onPress={hazirla} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : 'Benim yerime hazırla →'}
          </HBtn>
        </View>
      </View>

      <StackBottomNav activeIndex={0} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Hero
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    gap: 6,
  } as ViewStyle,

  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.accent,
    opacity: 0.07,
    top: -90,
    right: -60,
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
    marginBottom: spacing.sm,
  } as ViewStyle,

  backArrow: {
    fontSize: 18,
    color: colors.text1,
    lineHeight: 22,
  } as TextStyle,

  heroLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  heroKazanim: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -0.4,
    lineHeight: 28,
  } as TextStyle,

  heroMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  } as ViewStyle,

  metaChip: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingVertical: 4,
    paddingHorizontal: 10,
  } as ViewStyle,

  metaChipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.accent,
  } as TextStyle,

  // Panel
  panel: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  } as ViewStyle,

  scroll: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: 16,
  } as ViewStyle,

  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  tipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,

  tipCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: 4,
  } as ViewStyle,

  tipCardActive: {
    backgroundColor: colors.text1,
    borderColor: colors.text1,
  } as ViewStyle,

  tipLabel: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  tipLabelActive: {
    color: '#fff',
  } as TextStyle,

  tipSub: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  tipSubActive: {
    color: 'rgba(255,255,255,0.55)',
  } as TextStyle,

  ayarlar: {
    gap: spacing.base,
  } as ViewStyle,

  ayarBaslik: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  } as ViewStyle,

  ctaBar: {
    padding: spacing.base,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  } as ViewStyle,
});
