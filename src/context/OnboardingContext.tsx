import React, { createContext, useContext, useState } from 'react';
import { YillikPlan } from '../lib/planUret';

interface OnboardingState {
  brans: string;
  bransId: string;
  bransSlug: string;
  okulTipi: string;
  seciliDersler: string[];
  dersFiltesi: string[] | undefined;
  siniflar: number[];
  plan: YillikPlan | null;
  setBrans: (b: string) => void;
  setBransId: (id: string) => void;
  setBransSlug: (s: string) => void;
  setOkulTipi: (t: string) => void;
  setSeciliDersler: (d: string[]) => void;
  setDersFiltesi: (d: string[] | undefined) => void;
  setSiniflar: (s: number[]) => void;
  setPlan: (p: YillikPlan) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [brans, setBrans] = useState('');
  const [bransId, setBransId] = useState('');
  const [bransSlug, setBransSlug] = useState('');
  const [okulTipi, setOkulTipi] = useState('');
  const [seciliDersler, setSeciliDersler] = useState<string[]>([]);
  const [dersFiltesi, setDersFiltesi] = useState<string[] | undefined>(undefined);
  const [siniflar, setSiniflar] = useState<number[]>([]);
  const [plan, setPlan] = useState<YillikPlan | null>(null);

  return (
    <OnboardingContext.Provider value={{
      brans, bransId, bransSlug, okulTipi, seciliDersler, dersFiltesi, siniflar, plan,
      setBrans, setBransId, setBransSlug, setOkulTipi, setSeciliDersler, setDersFiltesi, setSiniflar, setPlan,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
