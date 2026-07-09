import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, Alert, ActivityIndicator, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Giris'>;

export function GirisScreen({ navigation }: Props) {
  const { girisYapiliyor, appleGirisiMevcut, appleIleGiris, googleIleGiris } = useAuth();

  async function handleApple() {
    try {
      await appleIleGiris();
      navigation.goBack();
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Giriş yapılamadı', e?.message ?? 'Bilinmeyen bir hata oluştu.');
    }
  }

  async function handleGoogle() {
    try {
      await googleIleGiris();
    } catch (e: any) {
      Alert.alert('Giriş yapılamadı', e?.message ?? 'Bilinmeyen bir hata oluştu.');
    }
  }

  return (
    <Screen bg={colors.bg}>
      <View style={styles.content}>
        <Pressable style={styles.kapatBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.kapatBtnText}>Kapat</Text>
        </Pressable>

        <View style={styles.headlineBlock}>
          <Text style={styles.display}>Giriş yap</Text>
          <Text style={styles.tagline}>
            Hesabınla girersen satın alman/geri yüklemen telefon değişse de kaybolmaz.
          </Text>
        </View>

        <View style={styles.btnGroup}>
          {Platform.OS === 'ios' && appleGirisiMevcut && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radius.btn}
              style={styles.appleBtn}
              onPress={handleApple}
            />
          )}

          <Pressable
            style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.85 }]}
            onPress={handleGoogle}
            disabled={girisYapiliyor}
          >
            <Text style={styles.googleBtnText}>Google ile devam et</Text>
          </Pressable>

          {girisYapiliyor && (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.sm }} />
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  } as ViewStyle,

  kapatBtn: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4 } as ViewStyle,
  kapatBtnText: { fontSize: 14, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,

  headlineBlock: { marginTop: spacing.xl, marginBottom: spacing.xl } as ViewStyle,
  display: { fontSize: 28, fontFamily: fonts.extraBold, color: colors.text1 } as TextStyle,
  tagline: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
    marginTop: spacing.sm,
    lineHeight: 20,
  } as TextStyle,

  btnGroup: { gap: spacing.sm } as ViewStyle,
  appleBtn: { height: 52, width: '100%' } as ViewStyle,
  googleBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.btn,
    paddingVertical: 17,
    alignItems: 'center',
  } as ViewStyle,
  googleBtnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text1,
    letterSpacing: 0.2,
  } as TextStyle,
});
