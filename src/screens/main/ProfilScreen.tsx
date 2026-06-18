import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import {
  User, Building2, CalendarDays, Bell, Sparkles,
  GraduationCap, Users, Send, CircleHelp, Lock, ChevronRight,
} from 'lucide-react-native';
import { sinifLabel } from '../../lib/sinifLabel';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useOnboarding } from '../../context/OnboardingContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type SettingRowProps = {
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  accent?: boolean;
};

function SettingRow({ Icon, label, value, toggle, toggleValue, onToggle, onPress, accent }: SettingRowProps) {
  const iconColor = accent ? colors.accent : colors.text2;
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={toggle ? 1 : 0.7}
    >
      <View style={[styles.settingIconBox, accent && styles.settingIconBoxAccent]}>
        <Icon size={16} color={iconColor} strokeWidth={1.5} />
      </View>
      <Text style={[styles.settingLabel, accent && styles.settingLabelAccent]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <ChevronRight size={16} color={colors.text3} strokeWidth={1.5} />
      )}
    </TouchableOpacity>
  );
}

export function ProfilScreen() {
  const navigation = useNavigation<Nav>();
  const { brans, siniflar } = useOnboarding();
  const [bildirimAcik, setBildirimAcik] = useState(true);

  const sinifText = siniflar.length > 0 ? siniflar.map(sinifLabel).join(', ') : 'Seçilmedi';
  const bransText = brans || 'Seçilmedi';

  return (
    <Screen bg={colors.bg}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Profil</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hesap kartı */}
        <View style={styles.hesapKarti}>
          <View style={styles.avatarBox}>
            <User size={22} color={colors.accent} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hesapBrans}>{bransText} Öğretmeni</Text>
            <Text style={styles.hesapSiniflar}>{sinifText}</Text>
          </View>
          <TouchableOpacity style={styles.duzenleBtn}>
            <Text style={styles.duzenleBtnText}>Düzenle →</Text>
          </TouchableOpacity>
        </View>

        {/* Kullanım kartı */}
        <View style={styles.kullanimKarti}>
          <Text style={styles.kullanimBaslik}>Bu Ay</Text>
          <View style={styles.kullanimRow}>
            <View style={styles.kullanimStat}>
              <Text style={styles.kullanimSayi}>12</Text>
              <Text style={styles.kullanimEtiket}>Üretim</Text>
            </View>
            <View style={styles.kullanimDivider} />
            <View style={styles.kullanimStat}>
              <Text style={styles.kullanimSayi}>3</Text>
              <Text style={styles.kullanimEtiket}>Evrak</Text>
            </View>
            <View style={styles.kullanimDivider} />
            <View style={styles.kullanimStat}>
              <Text style={styles.kullanimSayi}>5</Text>
              <Text style={styles.kullanimEtiket}>Yaver</Text>
            </View>
          </View>
        </View>

        {/* Ayarlar */}
        <Text style={styles.sectionLabel}>AYARLAR</Text>
        <View style={styles.settingsCard}>
          <SettingRow Icon={Building2} label="Okul Bilgileri" onPress={() => navigation.navigate('OkulBilgileri')} />
          <View style={styles.divider} />
          <SettingRow Icon={CalendarDays} label="Ders Programım" onPress={() => navigation.navigate('DersProgrami')} />
          <View style={styles.divider} />
          <SettingRow
            Icon={Bell}
            label="Bildirimler"
            toggle
            toggleValue={bildirimAcik}
            onToggle={setBildirimAcik}
          />
          <View style={styles.divider} />
          <SettingRow Icon={GraduationCap} label="Branş ve Sınıflar" value={bransText} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={Users} label="Şubelerim" onPress={() => {}} />
        </View>

        {/* Diğer */}
        <Text style={styles.sectionLabel}>DİĞER</Text>
        <View style={styles.settingsCard}>
          <SettingRow Icon={Send} label="Öneri Gönder" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={CircleHelp} label="Yardım" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={Lock} label="Gizlilik Politikası" onPress={() => {}} />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.cikisBtn}>
            <Text style={styles.cikisBtnText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  } as ViewStyle,
  pageTitle: { fontSize: 24, fontFamily: fonts.extraBold, color: colors.text1 } as TextStyle,

  scroll: { padding: spacing.base, gap: spacing.md } as ViewStyle,

  hesapKarti: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
    ...shadows.card,
  } as ViewStyle,
  avatarBox: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentLt,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  hesapBrans: { fontSize: 15, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  hesapSiniflar: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2, marginTop: 2 } as TextStyle,
  duzenleBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.btn,
    borderWidth: 1.5, borderColor: colors.border,
  } as ViewStyle,
  duzenleBtnText: { fontSize: 12, fontFamily: fonts.semiBold, color: colors.text2 } as TextStyle,

  kullanimKarti: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
    ...shadows.card,
  } as ViewStyle,
  kullanimBaslik: { fontSize: 12, fontFamily: fonts.bold, color: colors.text3 } as TextStyle,
  kullanimRow: { flexDirection: 'row', alignItems: 'center' } as ViewStyle,
  kullanimStat: { flex: 1, alignItems: 'center', gap: 4 } as ViewStyle,
  kullanimSayi: { fontSize: 28, fontFamily: fonts.extraBold, color: colors.text1 } as TextStyle,
  kullanimEtiket: { fontSize: 12, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  kullanimDivider: { width: 1, height: 36, backgroundColor: colors.border } as ViewStyle,

  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  } as TextStyle,

  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  } as ViewStyle,
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    gap: spacing.md,
  } as ViewStyle,
  settingIconBox: {
    width: 32, height: 32,
    borderRadius: 8,
    backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  settingIconBoxAccent: { backgroundColor: colors.accentLt } as ViewStyle,
  settingLabel: { flex: 1, fontSize: 14, fontFamily: fonts.medium, color: colors.text1 } as TextStyle,
  settingLabelAccent: { color: colors.accent, fontFamily: fonts.semiBold } as TextStyle,
  settingValue: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 60 } as ViewStyle,

  cikisBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
  } as ViewStyle,
  cikisBtnText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.warning } as TextStyle,
});
