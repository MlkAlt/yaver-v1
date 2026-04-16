/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base — Spec G4
        paper: '#FAF7F2',      // cream background — saf beyaz yasak
        ink: '#1C1B17',        // primary text
        smoke: '#6B6760',      // secondary text (opacity 0.7 equivalent)
        mist: '#9B968D',       // tertiary text (opacity 0.5 equivalent)

        // Accents — Spec G4
        sienna: '#B5481E',     // primary accent (burnt sienna) — 20% kullanım
        moss: '#4A5D3A',       // success / hazır state (yeşil)
        amber: '#D97706',      // warning / hazırlanmadı state (turuncu)

        // Surfaces — Spec G4
        card: '#FFFFFF',       // kart yüzeyi (paper üstünde beyaz kart OK)
        divider: '#E8E2D5',    // bölücü çizgiler
      },
      fontFamily: {
        // Karakterli tipografi — Spec G2 + G4
        display: ['Bricolage Grotesque', 'serif'],   // başlıklar — karakterli
        body: ['DM Sans', 'system-ui', 'sans-serif'], // metinler — okunabilir
      },
      borderRadius: {
        // Asimetrik köşeler — Spec G4 + G7
        sm: '8px',    // küçük elementler (buton, chip)
        md: '12px',   // kartlar
        lg: '20px',   // sheet, modal, bottom sheet
        full: '9999px', // pill, avatar
      },
      // Boşluk hiyerarşisi — Spec G7
      spacing: {
        // Özel boşluklar (standard Tailwind'e ek)
        'section': '48px',    // section gap — açık ayrım
        'component': '16px',  // component gap — yakın ilişki
      },
    },
  },
  plugins: [],
}
