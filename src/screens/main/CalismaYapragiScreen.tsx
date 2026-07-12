import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Clock, Award } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { supabase } from '../../lib/supabase';
import { pdfOnizlemeAc } from '../../lib/pdfOnizleme';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CalismaYapragi'>;

type CalismaYapragi = {
  id: number;
  kazanim_kod: string;
  varyasyon_no: number;
  baslik: string;
  tahmini_sure_dk: number | null;
  toplam_puan: number | null;
  html_icerik: string;
};

type Durum = 'loading' | 'error' | 'empty' | 'dolu';

export function CalismaYapragiScreen({ route, navigation }: Props) {
  const { kazanimKodu, kazanimAdi, sinif } = route.params;

  const [durum, setDurum] = useState<Durum>('loading');
  const [yapraklar, setYapraklar] = useState<CalismaYapragi[]>([]);
  const [hazirlaniyorId, setHazirlaniyorId] = useState<number | null>(null);

  const fetchYapraklar = useCallback(async () => {
    setDurum('loading');
    const { data, error } = await supabase
      .from('calisma_yapraklari')
      .select('*')
      .eq('kazanim_kod', kazanimKodu)
      .order('varyasyon_no', { ascending: true });

    if (error) {
      setDurum('error');
      return;
    }
    const rows = (data ?? []) as CalismaYapragi[];
    setYapraklar(rows);
    setDurum(rows.length === 0 ? 'empty' : 'dolu');
  }, [kazanimKodu]);

  useEffect(() => {
    fetchYapraklar();
  }, [fetchYapraklar]);

  const acPdf = useCallback(async (yaprak: CalismaYapragi) => {
    if (hazirlaniyorId !== null) return;
    setHazirlaniyorId(yaprak.id);
    try {
      await pdfOnizlemeAc(yaprak.html_icerik, false, navigation);
    } finally {
      setHazirlaniyorId(null);
    }
  }, [hazirlaniyorId, navigation]);

  const cokVaryasyon = yapraklar.length > 1;

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.blob} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>ÇALIŞMA YAPRAĞI</Text>
        <Text style={styles.baslik}>{kazanimAdi}</Text>

        <View style={styles.heroMeta}>
          {sinif ? (
            <View style={styles.sinifChip}>
              <Text style={styles.sinifChipText}>{sinif}</Text>
            </View>
          ) : null}
          <View style={styles.kodChip}>
            <Text style={styles.kodChipText}>{kazanimKodu}</Text>
          </View>
        </View>
      </View>

      {/* Panel */}
      <View style={styles.panel}>
        {durum === 'loading' && (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        )}

        {durum === 'error' && (
          <View style={styles.stateWrap}>
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>İçerik yüklenemedi</Text>
              <Text style={styles.stateSub}>Bağlantını kontrol edip tekrar dene.</Text>
              <TouchableOpacity style={styles.retryBtn} activeOpacity={0.85} onPress={fetchYapraklar}>
                <Text style={styles.retryBtnText}>Tekrar dene</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {durum === 'empty' && (
          <View style={styles.stateWrap}>
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Bu kazanım için henüz hazır değil</Text>
              <Text style={styles.stateSub}>
                Yaver bu kazanımın çalışma yaprağını hazırlıyor. Çok yakında burada olacak.
              </Text>
            </View>
          </View>
        )}

        {durum === 'dolu' && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {yapraklar.map((y) => {
              const hazirlaniyor = hazirlaniyorId === y.id;
              return (
                <View key={y.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{y.baslik}</Text>
                    {cokVaryasyon && (
                      <View style={styles.varyasyonChip}>
                        <Text style={styles.varyasyonChipText}>Varyasyon {y.varyasyon_no}</Text>
                      </View>
                    )}
                  </View>

                  {(y.tahmini_sure_dk != null || y.toplam_puan != null) && (
                    <View style={styles.metaRow}>
                      {y.tahmini_sure_dk != null && (
                        <View style={styles.metaChip}>
                          <Clock size={12} color={colors.text2} strokeWidth={1.5} />
                          <Text style={styles.metaChipText}>~{y.tahmini_sure_dk} dk</Text>
                        </View>
                      )}
                      {y.toplam_puan != null && (
                        <View style={styles.metaChip}>
                          <Award size={12} color={colors.text2} strokeWidth={1.5} />
                          <Text style={styles.metaChipText}>{y.toplam_puan} puan</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.acBtn, hazirlaniyor && styles.acBtnDisabled]}
                    activeOpacity={0.85}
                    disabled={hazirlaniyorId !== null}
                    onPress={() => acPdf(y)}
                  >
                    {hazirlaniyor ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.acBtnText}>Yazdırmaya hazır aç</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
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

  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  baslik: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginTop: 2,
  } as TextStyle,

  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  } as ViewStyle,

  sinifChip: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  sinifChipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.accent,
  } as TextStyle,

  kodChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  kodChipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text3,
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
    paddingBottom: 60,
  } as ViewStyle,

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
  } as ViewStyle,

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  } as ViewStyle,

  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text1,
    lineHeight: 22,
  } as TextStyle,

  varyasyonChip: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingVertical: 4,
    paddingHorizontal: 10,
  } as ViewStyle,

  varyasyonChipText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  } as TextStyle,

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  } as ViewStyle,

  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 11,
  } as ViewStyle,

  metaChipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  acBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  } as ViewStyle,

  acBtnDisabled: {
    backgroundColor: colors.accentMd,
  } as ViewStyle,

  acBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#fff',
  } as TextStyle,

  stateWrap: {
    padding: spacing.base,
  } as ViewStyle,

  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,

  stateTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text1,
    textAlign: 'center',
  } as TextStyle,

  stateSub: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: 20,
  } as TextStyle,

  retryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 11,
    paddingHorizontal: 24,
    marginTop: spacing.sm,
  } as ViewStyle,

  retryBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#fff',
  } as TextStyle,
});
