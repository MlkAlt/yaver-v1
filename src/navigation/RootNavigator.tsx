import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { BottomNav } from '../components/layout/BottomNav';
import { TAB_ROUTES } from './tabRoutes';

// Onboarding
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { BransScreen } from '../screens/onboarding/BransScreen';
import { SinifScreen } from '../screens/onboarding/SinifScreen';
import { EkDerslerScreen } from '../screens/onboarding/EkDerslerScreen';
import { DerslerScreen } from '../screens/onboarding/DerslerScreen';
import { LoadingScreen } from '../screens/onboarding/LoadingScreen';
import { WowMomentScreen } from '../screens/onboarding/WowMomentScreen';

// Ana ekranlar
import { PlanimScreen } from '../screens/main/PlanimScreen';
import { HaftaDetayiScreen } from '../screens/main/HaftaDetayiScreen';
import { UretimScreen } from '../screens/main/UretimScreen';
import { CiktiScreen } from '../screens/main/CiktiScreen';
import { DersIcinScreen } from '../screens/main/DersIcinScreen';
import { EvraklarimScreen } from '../screens/main/EvraklarimScreen';
import { SablonDoldurmaScreen } from '../screens/main/SablonDoldurmaScreen';
import { SinavAnaliziScreen } from '../screens/main/SinavAnaliziScreen';
import { ProfilScreen } from '../screens/main/ProfilScreen';
import { OkulBilgileriScreen } from '../screens/main/OkulBilgileriScreen';
import { DersProgramiScreen } from '../screens/main/DersProgramiScreen';
import { YillikPlanScreen } from '../screens/main/YillikPlanScreen';
import { GirisScreen } from '../screens/auth/GirisScreen';
import { PdfOnizlemeScreen } from '../screens/main/PdfOnizlemeScreen';
import { CalismaYapragiScreen } from '../screens/main/CalismaYapragiScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Brans: undefined;
  Sinif: undefined;
  EkDersler: { siniflar: number[] };
  Dersler: { siniflar: number[] };
  Loading: { brans?: string; bransId?: string; siniflar?: number[] } | undefined;
  WowMoment: undefined;
  MainTabs: undefined;
  HaftaDetayi: { haftaNo: number };
  Uretim: { kazanimKodu?: string; sinif?: string; kazanimAdi?: string; icerikTuru?: string } | undefined;
  CalismaYapragi: { kazanimKodu: string; kazanimAdi: string; sinif?: string };
  Cikti: { tip: string; icerik: string; baglam: string };
  SablonDoldurma: { sablonId: string; sablonAdi: string };
  SinavAnalizi: undefined;
  OkulBilgileri: undefined;
  DersProgrami: { fromOnboarding?: boolean } | undefined;
  Profil: undefined;
  Giris: undefined;
  PdfOnizleme: { uri: string; base64: string; dosyaAdi?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <BottomNav
          activeIndex={state.index}
          onTabPress={(i) => navigation.navigate(TAB_ROUTES[i])}
        />
      )}
    >
      <Tab.Screen name="Planim" component={PlanimScreen} />
      <Tab.Screen name="YillikPlan" component={YillikPlanScreen} />
      <Tab.Screen name="DersIcin" component={DersIcinScreen} />
      <Tab.Screen name="Evraklarim" component={EvraklarimScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Brans" component={BransScreen} />
      <Stack.Screen name="Sinif" component={SinifScreen} />
      <Stack.Screen name="EkDersler" component={EkDerslerScreen} />
      <Stack.Screen name="Dersler" component={DerslerScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="WowMoment" component={WowMomentScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="HaftaDetayi" component={HaftaDetayiScreen} />
      <Stack.Screen name="Uretim" component={UretimScreen} />
      <Stack.Screen name="CalismaYapragi" component={CalismaYapragiScreen} />
      <Stack.Screen name="Cikti" component={CiktiScreen} />
      <Stack.Screen name="SablonDoldurma" component={SablonDoldurmaScreen} />
      <Stack.Screen name="SinavAnalizi" component={SinavAnaliziScreen} />
      <Stack.Screen name="OkulBilgileri" component={OkulBilgileriScreen} />
      <Stack.Screen name="DersProgrami" component={DersProgramiScreen} />
      <Stack.Screen name="Profil" component={ProfilScreen} />
      <Stack.Screen name="Giris" component={GirisScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="PdfOnizleme" component={PdfOnizlemeScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
