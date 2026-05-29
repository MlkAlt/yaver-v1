import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/layout/AppBar';
import { StackBottomNav } from '../../components/layout/StackBottomNav';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SablonDoldurma'>;

type FormField = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
};

const ZUMRE_FIELDS: FormField[] = [
  { key: 'tarih', label: 'Toplantı Tarihi', placeholder: 'ör. 23 Nisan 2026' },
  { key: 'no', label: 'Tutanak No', placeholder: 'ör. 2026/03' },
  { key: 'katilimcilar', label: 'Katılımcılar', placeholder: 'İsimleri virgülle ayır', multiline: true },
  { key: 'gundem', label: 'Gündem Maddeleri', placeholder: 'Her maddeyi yeni satıra yaz', multiline: true },
  { key: 'karar', label: 'Alınan Kararlar', placeholder: 'Toplantıda alınan kararlar...', multiline: true },
];

const DEFAULT_FIELDS: FormField[] = [
  { key: 'tarih', label: 'Tarih', placeholder: 'ör. 23 Nisan 2026' },
  { key: 'konu', label: 'Konu / Başlık', placeholder: 'Evrakın konusu...' },
  { key: 'aciklama', label: 'Açıklama / İçerik', placeholder: 'Detayları buraya yaz...', multiline: true },
];

export function SablonDoldurmaScreen({ route, navigation }: Props) {
  const { sablonId, sablonAdi } = route.params;
  const fields = sablonId === 'zumre' ? ZUMRE_FIELDS : DEFAULT_FIELDS;

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, '']))
  );

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const filled = Object.values(values).filter(Boolean).length;
  const allFilled = filled === fields.length;

  return (
    <Screen bg={colors.surface}>
      <AppBar title={sablonAdi} back />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Açıklama */}
        <View style={styles.infoCard}>
          <Sparkles size={18} color={colors.accent} strokeWidth={1.5} />
          <Text style={styles.infoText}>
            Birkaç bilgiyi doldur, gerisini Yaver halleder. Bu evrak <Text style={styles.infoAccent}>ücretsiz</Text> oluşturulur.
          </Text>
        </View>

        {/* Form alanları */}
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={[styles.fieldInput, field.multiline && styles.fieldInputMulti]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.text3}
              value={values[field.key]}
              onChangeText={(v) => setValue(field.key, v)}
              multiline={field.multiline}
              textAlignVertical={field.multiline ? 'top' : 'center'}
            />
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaBar}>
        {!allFilled && (
          <Text style={styles.ctaHint}>{filled}/{fields.length} alan dolduruldu</Text>
        )}
        <TouchableOpacity
          style={[styles.ctaBtn, !allFilled && styles.ctaBtnDisabled]}
          activeOpacity={allFilled ? 0.85 : 1}
          onPress={() => {
            if (!allFilled) return;
            navigation.navigate('Cikti', {
              tip: 'evrak',
              icerik: JSON.stringify(values),
              baglam: sablonAdi,
            });
          }}
        >
          <Text style={styles.ctaBtnText}>
            Evrakı oluştur →
          </Text>
        </TouchableOpacity>
      </View>
      <StackBottomNav activeIndex={2} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.base, gap: spacing.base } as ViewStyle,

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accentLt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  } as ViewStyle,
  infoEmoji: { fontSize: 18, marginTop: 1 } as TextStyle,
  infoText: { flex: 1, fontSize: 13, fontFamily: fonts.medium, color: colors.text2, lineHeight: 18 } as TextStyle,
  infoAccent: { fontFamily: fonts.bold, color: colors.accent } as TextStyle,

  fieldGroup: { gap: spacing.xs } as ViewStyle,
  fieldLabel: { fontSize: 13, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  fieldInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text1,
    height: 48,
  } as TextStyle,
  fieldInputMulti: {
    height: 88,
    paddingTop: spacing.md,
  } as TextStyle,

  ctaBar: {
    padding: spacing.base,
    paddingBottom: spacing.base,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  } as ViewStyle,
  ctaHint: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text3,
    textAlign: 'center',
  } as TextStyle,
  ctaBtn: {
    backgroundColor: colors.text1,
    borderRadius: radius.btn,
    paddingVertical: 16,
    alignItems: 'center',
  } as ViewStyle,
  ctaBtnDisabled: { backgroundColor: colors.border } as ViewStyle,
  ctaBtnText: { fontSize: 15, fontFamily: fonts.bold, color: '#fff' } as TextStyle,
});
