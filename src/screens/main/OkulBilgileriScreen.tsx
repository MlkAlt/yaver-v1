import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/layout/AppBar';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OkulBilgileri'>;

type FieldConfig = {
  key: keyof OkulBilgileri;
  label: string;
  placeholder: string;
  hint?: string;
};

type OkulBilgileri = {
  ogretmenAdi: string;
  okulAdi: string;
  egitimYili: string;
  mudurAdi: string;
  ilce: string;
  il: string;
};

const FIELDS: FieldConfig[] = [
  { key: 'ogretmenAdi', label: 'Öğretmen Adı Soyadı', placeholder: 'Ahmet Yılmaz' },
  { key: 'okulAdi', label: 'Okul Adı', placeholder: 'Atatürk Anadolu Lisesi' },
  { key: 'egitimYili', label: 'Eğitim-Öğretim Yılı', placeholder: '2025-2026', hint: 'Evraklarda otomatik kullanılır' },
  { key: 'mudurAdi', label: 'Okul Müdürü', placeholder: 'Mehmet Kaya' },
  { key: 'ilce', label: 'İlçe', placeholder: 'Kadıköy' },
  { key: 'il', label: 'İl', placeholder: 'İstanbul' },
];

export function OkulBilgileriScreen({ navigation }: Props) {
  const [form, setForm] = useState<OkulBilgileri>({
    ogretmenAdi: '',
    okulAdi: '',
    egitimYili: '2025-2026',
    mudurAdi: '',
    ilce: '',
    il: '',
  });

  function handleSave() {
    // TODO: AsyncStorage'a kaydet
    Alert.alert('Kaydedildi', 'Okul bilgilerin evraklarda otomatik kullanılacak.', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <Screen bg={colors.bg}>
      <AppBar title="Okul Bilgileri" back />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.description}>
          Bu bilgiler bir kez girilir ve tüm resmi evraklarda, sınav başlıklarında ve tutanaklarda otomatik olarak kullanılır.
        </Text>

        <View style={styles.card}>
          {FIELDS.map((field, i) => (
            <View key={field.key}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {field.hint && <Text style={styles.fieldHint}>{field.hint}</Text>}
                <TextInput
                  style={styles.input}
                  value={form[field.key]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.text3}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.base,
    gap: spacing.md,
  } as ViewStyle,
  description: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
    lineHeight: 21,
  } as TextStyle,
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  } as ViewStyle,
  fieldRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    gap: 4,
  } as ViewStyle,
  fieldLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  } as TextStyle,
  fieldHint: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.accent,
    marginBottom: 2,
  } as TextStyle,
  input: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text1,
    paddingVertical: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  } as TextStyle,
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.base,
  } as ViewStyle,
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.cardMd,
  } as ViewStyle,
  saveBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#fff',
    letterSpacing: 0.2,
  } as TextStyle,
});
