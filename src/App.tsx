import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Onboarding
import Welcome from './pages/Onboarding/Welcome'
import BransSecimi from './pages/Onboarding/BransSecimi'
import SinifSecimi from './pages/Onboarding/SinifSecimi'
import Loading from './pages/Onboarding/Loading'
import WowMoment from './pages/Onboarding/WowMoment'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Onboarding */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding/brans" element={<BransSecimi />} />
          <Route path="/onboarding/sinif" element={<SinifSecimi />} />
          <Route path="/onboarding/yukleniyor" element={<Loading />} />
          <Route path="/onboarding/hazir" element={<WowMoment />} />

          {/* Ana uygulama — Hafta 2'de eklenecek */}
          {/* <Route path="/planim" element={<Planim />} /> */}
          {/* <Route path="/ders-icin" element={<DersIcin />} /> */}
          {/* <Route path="/evraklarim" element={<Evraklarim />} /> */}
          {/* <Route path="/profil" element={<Profil />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
