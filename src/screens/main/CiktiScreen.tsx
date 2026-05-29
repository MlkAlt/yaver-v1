import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RefreshCw, Pencil, Download, Check, ThumbsUp, Minus, ThumbsDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { StackBottomNav } from '../../components/layout/StackBottomNav';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Cikti'>;
type FeedbackType = 'cok_guzel' | 'iyi' | 'begenmedi' | null;

const TIP_LABELS: Record<string, string> = {
  sorular: 'Sorular',
  etkinlik: 'Etkinlik',
  ders: 'Ders Planı',
  yaprak: 'Çalışma Yaprağı',
};

export function CiktiScreen({ route, navigation }: Props) {
  const { tip, baglam } = route.params;
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [snackVisible, setSnackVisible] = useState(true);
  const snackAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(snackAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
        setSnackVisible(false)
      );
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const tipLabel = TIP_LABELS[tip] ?? 'İçerik';

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      {/* Dark output header */}
      <View style={styles.hero}>
        <View style={styles.blob} />

        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Hazır badge */}
        <View style={styles.hazirBadge}>
          <Check size={11} color={colors.success} strokeWidth={2.5} />
          <Text style={styles.hazirBadgeText}>Hazırlandı</Text>
        </View>

        <Text style={styles.heroTitle}>{tipLabel}</Text>
        <Text style={styles.heroBaglam}>{baglam}</Text>
      </View>

      {/* White panel */}
      <View style={styles.panel}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* İçerik */}
          <View style={styles.icerikCard}>
            <Text style={styles.icerikText} selectable>
              {route.params.icerik || '—'}
            </Text>
          </View>

          {/* Aksiyon satırı */}
          <View style={styles.aksiyonRow}>
            <TouchableOpacity style={styles.aksiyonBtn} activeOpacity={0.8}>
              <RefreshCw size={14} color={colors.text2} strokeWidth={1.5} />
              <Text style={styles.aksiyonBtnText}>Yeniden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aksiyonBtn} activeOpacity={0.8}>
              <Pencil size={14} color={colors.text2} strokeWidth={1.5} />
              <Text style={styles.aksiyonBtnText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aksiyonBtn, styles.aksiyonBtnPrimary]} activeOpacity={0.8}>
              <Download size={14} color="#fff" strokeWidth={1.5} />
              <Text style={styles.aksiyonBtnPrimaryText}>İndir</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Bu hazırlık nasıl oldu?</Text>
            <View style={styles.feedbackRow}>
              {[
                { key: 'cok_guzel' as FeedbackType, Icon: ThumbsUp,   label: 'Çok güzel',  color: colors.success },
                { key: 'iyi'       as FeedbackType, Icon: Minus,       label: 'İyiydi',     color: colors.warning },
                { key: 'begenmedi' as FeedbackType, Icon: ThumbsDown,  label: 'Beğenmedim', color: colors.text3 },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key!}
                  onPress={() => setFeedback(f.key)}
                  activeOpacity={0.8}
                  style={[styles.feedbackCard, feedback === f.key && styles.feedbackCardActive]}
                >
                  <f.Icon size={18} color={feedback === f.key ? f.color : colors.text3} strokeWidth={1.5} />
                  <Text style={[styles.feedbackLabel, feedback === f.key && styles.feedbackLabelActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Snackbar */}
        {snackVisible && (
          <Animated.View style={[styles.snackbar, { opacity: snackAnim }]}>
            <Check size={14} color="#fff" strokeWidth={2} />
            <Text style={styles.snackText}>Plana kaydedildi</Text>
            <TouchableOpacity>
              <Text style={styles.snackAction}>GÖR</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    opacity: 0.07,
    top: -80,
    right: -50,
  } as ViewStyle,

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  } as ViewStyle,

  backArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 22,
  } as TextStyle,

  hazirBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(45,122,80,0.18)',
    borderRadius: radius.btn,
    paddingVertical: 5,
    paddingHorizontal: 12,
  } as ViewStyle,

  hazirBadgeText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.success,
  } as TextStyle,

  heroTitle: {
    fontSize: 32,
    fontFamily: fonts.extraBold,
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 36,
  } as TextStyle,

  heroBaglam: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.40)',
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
    paddingBottom: 100,
  } as ViewStyle,

  icerikCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  } as ViewStyle,

  icerikText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text1,
    lineHeight: 22,
  } as TextStyle,

  aksiyonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  } as ViewStyle,

  aksiyonBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    borderRadius: radius.btn,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,

  aksiyonBtnText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  aksiyonBtnPrimary: {
    backgroundColor: colors.text1,
    borderColor: colors.text1,
  } as ViewStyle,

  aksiyonBtnPrimaryText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#fff',
  } as TextStyle,

  feedbackSection: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  } as ViewStyle,

  feedbackTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text2,
    textAlign: 'center',
  } as TextStyle,

  feedbackRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  } as ViewStyle,

  feedbackCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
  } as ViewStyle,

  feedbackCardActive: {
    backgroundColor: colors.accentLt,
    borderColor: colors.accent,
  } as ViewStyle,

  feedbackLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  feedbackLabelActive: {
    color: colors.accent,
    fontFamily: fonts.semiBold,
  } as TextStyle,

  snackbar: {
    position: 'absolute',
    bottom: 16,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.text1,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  } as ViewStyle,

  snackText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#fff',
    flex: 1,
  } as TextStyle,

  snackAction: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,
});
