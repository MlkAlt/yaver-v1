import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

// Google Cloud Console'da oluşturulacak "Web application" tipi OAuth client ID —
// Supabase signInWithIdToken(google) bu client ID'yi bekliyor (Android/iOS client
// ID'leri değil). Değer boşken Google girişi denenirse anlaşılır bir hata verir.
const GOOGLE_WEB_CLIENT_ID = '';

interface AuthState {
  session: Session | null;
  yukleniyor: boolean;
  girisYapiliyor: boolean;
  appleGirisiMevcut: boolean;
  appleIleGiris: () => Promise<void>;
  googleIleGiris: () => Promise<void>;
  cikisYap: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [girisYapiliyor, setGirisYapiliyor] = useState(false);
  const [appleGirisiMevcut, setAppleGirisiMevcut] = useState(false);

  const [, googleResponse, googleIstekBaslat] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setYukleniyor(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    AppleAuthentication.isAvailableAsync().then(setAppleGirisiMevcut);
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (googleResponse?.type !== 'success') return;
    const idToken = googleResponse.authentication?.idToken;
    if (!idToken) return;
    (async () => {
      setGirisYapiliyor(true);
      try {
        const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
        if (error) throw error;
      } finally {
        setGirisYapiliyor(false);
      }
    })();
  }, [googleResponse]);

  async function appleIleGiris() {
    setGirisYapiliyor(true);
    try {
      const kimlikBilgisi = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });
      if (!kimlikBilgisi.identityToken) throw new Error('Apple kimlik doğrulama tokenı alınamadı.');
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: kimlikBilgisi.identityToken,
      });
      if (error) throw error;
    } finally {
      setGirisYapiliyor(false);
    }
  }

  async function googleIleGiris() {
    if (!GOOGLE_WEB_CLIENT_ID) {
      throw new Error('Google girişi henüz yapılandırılmadı (Google Cloud Console OAuth client ID eksik).');
    }
    await googleIstekBaslat();
  }

  async function cikisYap() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ session, yukleniyor, girisYapiliyor, appleGirisiMevcut, appleIleGiris, googleIleGiris, cikisYap }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
