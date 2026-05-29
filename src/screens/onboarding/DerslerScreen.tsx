import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  TouchableOpacity, ScrollView, Modal, FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Check, Plus, X } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { HBtn } from '../../components/atoms/HBtn';
import { HProgress } from '../../components/atoms/HProgress';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';
import {
  getZorunluDersler, getSecmeliDersler,
} from '../../data/secmeliDersler';

type Props = NativeStackScreenProps<RootStackParamList, 'Dersler'>;

function sinifEtiket(siniflar: number[]): string {
  if (siniflar.length === 0) return '';
  if (siniflar.length === 1) return `${siniflar[0]}. sınıf`;
  const min = Math.min(...siniflar);
  const max = Math.max(...siniflar);
  return `${min}-${max}. sınıf`;
}

export function DerslerScreen({ navigation, route }: Props) {
  const { brans, bransId, bransSlug, okulTipi, setSiniflar: ctxSetSiniflar, setDersFiltesi } = useOnboarding();
  const siniflar: number[] = route.params?.siniflar ?? [];

  const zorunlu = getZorunluDersler(bransSlug, siniflar, okulTipi || undefined);
  const secmeliList = getSecmeliDersler(bransSlug, siniflar, okulTipi || undefined);

  const [seciliZorunlu, setSeciliZorunlu] = useState<Set<string>>(
    new Set(zorunlu.map(d => d.ad))
  );
  const [seciliSecmeli, setSeciliSecmeli] = useState<Set<string>>(
    new Set(secmeliList.filter(d => d.onceden_secili).map(d => d.ad))
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleZorunlu = (ders: string) => {
    setSeciliZorunlu(prev => {
      const next = new Set(prev);
      next.has(ders) ? next.delete(ders) : next.add(ders);
      return next;
    });
  };

  const toggleSecmeli = (ders: string) => {
    setSeciliSecmeli(prev => {
      const next = new Set(prev);
      next.has(ders) ? next.delete(ders) : next.add(ders);
      return next;
    });
  };

  const handleKur = () => {
    ctxSetSiniflar(siniflar);
    // okulTipi SinifScreen'de tile seçimiyle set edildi; burada override etme
    const filtre = [...seciliZorunlu, ...seciliSecmeli];
    setDersFiltesi(filtre.length > 0 ? filtre : undefined);
    navigation.navigate('Loading', { brans, bransId, siniflar });
  };

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />
      <HProgress value={90} style={styles.progress} />

      <View style={styles.header}>
        <Text style={styles.step}>Son Adım</Text>
        <Text style={styles.heading}>
          Bu sınıflarda{'\n'}ne okutuyorsun?
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
          {/* Ana dersler */}
          {zorunlu.map(item => {
            const isSelected = seciliZorunlu.has(item.ad);
            const gosterilenSiniflar = item.siniflar.filter(s => siniflar.includes(s));
            return (
              <TouchableOpacity
                key={item.ad}
                onPress={() => toggleZorunlu(item.ad)}
                activeOpacity={0.75}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <View style={[styles.check, isSelected && styles.checkSelected]}>
                  {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.ad}
                  </Text>
                  <Text style={[styles.cardSub, isSelected && styles.cardSubSelected]}>
                    {sinifEtiket(gosterilenSiniflar)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Seçilen seçmeli dersler */}
          {seciliSecmeli.size > 0 && (
            <View style={styles.secmeliSection}>
              <Text style={styles.secmeliLabel}>Seçmeli Dersler</Text>
              {[...seciliSecmeli].map(ad => {
                const item = secmeliList.find(d => d.ad === ad);
                const gosterilenSiniflar = item ? item.siniflar.filter(s => siniflar.includes(s)) : [];
                return (
                  <View key={ad} style={[styles.card, styles.cardSelected]}>
                    <View style={[styles.check, styles.checkSelected]}>
                      <Check size={13} color="#fff" strokeWidth={3} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, styles.cardTitleSelected]}>{ad}</Text>
                      <Text style={[styles.cardSub, styles.cardSubSelected]}>
                        {sinifEtiket(gosterilenSiniflar)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleSecmeli(ad)} hitSlop={8}>
                      <X size={16} color={colors.accent} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Seçmeli ders ekle butonu */}
          {secmeliList.length > 0 && (
            <TouchableOpacity
              onPress={() => setSheetOpen(true)}
              activeOpacity={0.75}
              style={styles.ekleBtn}
            >
              <Plus size={16} color={colors.accent} strokeWidth={2.5} />
              <Text style={styles.ekleBtnText}>Seçmeli ders ekle</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={styles.ctaBar}>
        <HBtn onPress={handleKur} disabled={seciliZorunlu.size === 0}>
          Yılımı kur →
        </HBtn>
      </View>

      {/* Seçmeli dersler bottom sheet */}
      <Modal
        visible={sheetOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setSheetOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setSheetOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Seçmeli Dersler</Text>
          <Text style={styles.sheetSub}>
            Kazanımları yakında eklenecek — şimdiden işaretleyebilirsin.
          </Text>
          <FlatList
            data={secmeliList}
            keyExtractor={item => item.ad}
            contentContainerStyle={styles.sheetList}
            renderItem={({ item }) => {
              const isSelected = seciliSecmeli.has(item.ad);
              const gosterilenSiniflar = item.siniflar.filter(s => siniflar.includes(s));
              return (
                <TouchableOpacity
                  onPress={() => toggleSecmeli(item.ad)}
                  activeOpacity={0.75}
                  style={[styles.card, isSelected && styles.cardSelected, styles.sheetCard]}
                >
                  <View style={[styles.check, isSelected && styles.checkSelected]}>
                    {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                      {item.ad}
                    </Text>
                    <Text style={[styles.cardSub, isSelected && styles.cardSubSelected]}>
                      {sinifEtiket(gosterilenSiniflar)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.sheetCta}>
            <HBtn onPress={() => setSheetOpen(false)}>
              Tamam
            </HBtn>
          </View>
        </View>
      </Modal>
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

  cardTitleSelected: { color: colors.accent } as TextStyle,

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

  secmeliSection: { gap: spacing.sm } as ViewStyle,

  secmeliLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.text3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  } as TextStyle,

  ekleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: radius.card,
    backgroundColor: colors.accentLt,
  } as ViewStyle,

  ekleBtnText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  } as TextStyle,

  ctaBar: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  } as ViewStyle,

  // Bottom sheet
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  } as ViewStyle,

  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
    maxHeight: '75%',
  } as ViewStyle,

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  } as ViewStyle,

  sheetTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text1,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  } as TextStyle,

  sheetSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text3,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
    lineHeight: 17,
  } as TextStyle,

  sheetList: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  } as ViewStyle,

  sheetCard: { marginBottom: spacing.sm } as ViewStyle,

  sheetCta: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  } as ViewStyle,
});
