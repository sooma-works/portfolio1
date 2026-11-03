import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ScrollManager, ShutterProvider } from './components/Shutter'
import Grain from './components/Grain'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// GSAP solo hace falta en las series: se carga aparte.
const Series = lazy(() => import('./pages/Series'))
const Credits = lazy(() => import('./pages/Credits'))

export default function App() {
  return (
    <ShutterProvider>
      <ScrollManager />
      <a href="#contenido" className="skip-link sr-only-focusable mono">
        Saltar al contenido
      </a>
      <Nav />
      <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series/:slug" element={<Series />} />
          <Route path="/creditos" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Grain />
      <Cursor />
    </ShutterProvider>
  )
}
