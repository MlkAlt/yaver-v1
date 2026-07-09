import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { X, Share2 } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { pdfViewerHtmlOlustur } from '../../lib/pdfViewerHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfOnizleme'>;

export function PdfOnizlemeScreen({ route, navigation }: Props) {
  const { uri, base64 } = route.params;
  const html = React.useMemo(() => pdfViewerHtmlOlustur(base64), [base64]);

  async function paylas() {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
  }

  return (
    <Screen bg={colors.bg}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <X size={20} color={colors.text1} strokeWidth={2} />
        </Pressable>
        <Text style={styles.title}>Önizleme</Text>
        <Pressable style={styles.iconBtn} onPress={paylas}>
          <Share2 size={20} color={colors.accent} strokeWidth={2} />
        </Pressable>
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
});
