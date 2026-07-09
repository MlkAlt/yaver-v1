import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
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

  // Supabase Google girişinde nonce'ın SHA-256 hash'ini bekliyor: ham (hash'lenmemiş)
  // hâli Google'a değil signInWithIdToken'a verilir, Google'a giden hash'lenmiş
  // olandır — expo-auth-session'ın kendi otomatik nonce'ı bu hash adımını yapmıyor,
  // bu yüzden elle üretilip extraParams ile geçiriliyor.
  const [googleNonce, setGoogleNonce] = useState<{ ham: string; hashli: string } | null>(null);
  useEffect(() => {
    (async () => {
      const ham = Crypto.randomUUID();
      const hashli = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, ham);
      setGoogleNonce({ ham, hashli });
    })();
  }, []);

  const [, googleResponse, googleIstekBaslat] = Google.useIdTokenAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    responseType: ResponseType.IdToken,
    extraParams: googleNonce ? { nonce: googleNonce.hashli } : undefined,
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
    if (googleResponse?.type !== 'success' || !googleNonce) return;
    const idToken = googleResponse.params.id_token;
    if (!idToken) return;
    (async () => {
      setGirisYapiliyor(true);
      try {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
          nonce: googleNonce.ham,
        });
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
    if (!googleNonce) {
      throw new Error('Giriş hazırlanıyor, birkaç saniye sonra tekrar dene.');
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
