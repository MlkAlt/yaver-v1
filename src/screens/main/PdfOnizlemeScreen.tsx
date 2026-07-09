import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { X, Share2, Download } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { pdfViewerHtmlOlustur } from '../../lib/pdfViewerHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfOnizleme'>;

export function PdfOnizlemeScreen({ route, navigation }: Props) {
  const { uri, base64, dosyaAdi } = route.params;
  const html = React.useMemo(() => pdfViewerHtmlOlustur(base64), [base64]);

  // Bu ekran açıkken telefon yatay çevrilince belge de dönebilsin diye kilit
  // açılıyor; ekrandan çıkınca uygulamanın geri kalanı (app.json'da portrait'e
  // sabitli) etkilenmesin diye tekrar dikeye kilitleniyor.
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  async function paylas() {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
  }

  async function indir() {
    const ad = (dosyaAdi ?? 'belge').replace(/\.pdf$/i, '');
    if (Platform.OS === 'android') {
      const izin = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!izin.granted) return;
      try {
        const hedefUri = await FileSystem.StorageAccessFramework.createFileAsync(
          izin.directoryUri, ad, 'application/pdf',
        );
        await FileSystem.writeAsStringAsync(hedefUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('İndirildi', 'PDF seçtiğiniz klasöre kaydedildi.');
      } catch {
        Alert.alert('Hata', 'Dosya kaydedilemedi.');
      }
    } else {
      // iOS'ta ayrı bir "indirme" akışı yok — kaydetme de Dosyalar/iCloud'a
      // paylaşım sheet'i üzerinden yapılıyor (sistemin kendi davranışı).
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    }
  }

  return (
    <Screen bg={colors.bg}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <X size={20} color={colors.text1} strokeWidth={2} />
        </Pressable>
        <Text style={styles.title}>Önizleme</Text>
        <View style={{ width: 36 }} />
      </View>

      <WebView
        source={{ html }}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.yukleniyor}>
            <ActivityIndicator color={colors.accent} />
          </View>
        )}
        originWhitelist={['*']}
      />

      <View style={styles.altBar}>
        <Pressable
          style={({ pressed }) => [styles.indirBtn, pressed && { opacity: 0.85 }]}
          onPress={indir}
        >
          <Download size={17} color={colors.text1} strokeWidth={2} />
          <Text style={styles.indirBtnText}>İndir</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.paylasBtn, pressed && { opacity: 0.85 }]}
          onPress={paylas}
        >
          <Share2 size={18} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.paylasBtnText}>Paylaş</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  iconBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  title: { fontSize: 15, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  yukleniyor: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg,
  } as ViewStyle,

  altBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,
  indirBtn: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.btn,
    borderWidth: 1.5, borderColor: colors.border,
  } as ViewStyle,
  indirBtnText: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  paylasBtn: {
    flexDirection: 'row',
    flex: 1.4,
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.btn,
    backgroundColor: colors.accent,
  } as ViewStyle,
  paylasBtnText: { fontSize: 15, fontFamily: fonts.bold, color: '#FFFFFF' } as TextStyle,
});
