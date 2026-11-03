import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { hero } from '../data/site'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'

const DEVELOP_MS = 2700
const SLOPE = 5
const NOISE = '/img/hero/revelado-ruido.jpg'
// Duración de cada paso después del revelado (ms).
const FIX_MS = 700 // se apaga la luz roja
const GROW_MS = 1100 // la copia se agranda hasta ocupar la pantalla
const FADE_MS = 450 // aparece el sitio
// La intro corre completa en cada carga de página (también al recargar), pero
// no al volver al inicio navegando dentro del sitio.
let playedThisLoad = false

const ease = (t) => 1 - (1 - t) ** 2.2

// El revelado: el papel en blanco bajo la luz roja, la imagen que aparece en
// manchas irregulares con el contraste subiendo, la luz que se apaga y la
// copia que se agranda hasta volverse la foto del inicio.
export default function Intro() {
  const [mode] = useState(() => (playedThisLoad || prefersReducedMotion() ? 'none' : 'full'))
  const [phase, setPhase] = useState(mode === 'none' ? 'done' : 'develop')
  const [viewBox, setViewBox] = useState(`0 0 ${hero.w} ${hero.h}`)
  const funcRef = useRef(null)
  const imgRef = useRef(null)
  const paperRef = useRef(null)
  const frameRef = useRef(null)
  const clockRef = useRef(null)
  const rafRef = useRef(0)
  const [touch] = useState(() => !hasFinePointer())
  // En pantallas chicas el revelado usa la misma versión liviana que el hero.
  const [devSrc] = useState(() =>
    window.innerWidth * (window.devicePixelRatio || 1) < 1000 ? hero.mobile : hero.small,
  )

  const paint = (t) => {
    const k = ease(t)
    // Umbral del ruido: a 0 no pasa nada de imagen, a 1 pasa toda.
    const intercept = -SLOPE + k * (1 + SLOPE)
    funcRef.current?.setAttribute('intercept', intercept.toFixed(3))
    if (imgRef.current) {
      imgRef.current.style.filter = `brightness(${(2.1 - 1.1 * k).toFixed(3)}) contrast(${(0.45 + 0.55 * k).toFixed(3)})`
    }
    if (clockRef.current) {
      const s = Math.round(t * 90)
      clockRef.current.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    }
  }

  const finish = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    paint(1)
    setPhase((p) => (p === 'develop' ? 'fix' : p))
  }, [])

  // El encuadre del revelado tiene que coincidir con el de la foto del hero
  // (object-fit: cover + el mismo object-position), así al agrandarse la
  // copia termina exactamente donde está la foto de fondo.
  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const { width: w, height: h } = frame.getBoundingClientRect()
    const x = parseFloat(getComputedStyle(frame).getPropertyValue('--hero-x')) || 0.5
    const scale = Math.max(w / hero.w, h / hero.h)
    const vw = w / scale
    const vh = h / scale
    setViewBox(`${((hero.w - vw) * x).toFixed(1)} ${((hero.h - vh) / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`)
  }, [])

  useEffect(() => {
    if (mode !== 'none') playedThisLoad = true
  }, [mode])

  // Mientras está la intro no se scrollea la página.
  const locked = phase !== 'done' && phase !== 'fade'
  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    root.style.overflow = 'hidden'
    root.classList.add('intro-running')
    return () => {
      root.style.overflow = ''
      root.classList.remove('intro-running')
    }
  }, [locked])

  useEffect(() => {
    if (phase === 'develop') {
      paint(0)
      let start = 0
      let hold = 0
      const delay = window.setTimeout(() => {
        const tick = (now) => {
          if (!start) start = now
          const t = Math.min(1, (now - start) / DEVELOP_MS)
          paint(t)
          if (t < 1) rafRef.current = requestAnimationFrame(tick)
          else hold = window.setTimeout(() => setPhase('fix'), 450)
        }
        rafRef.current = requestAnimationFrame(tick)
      }, 500)
      const skip = (e) => {
        if (e.type === 'keydown' && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return
        finish()
      }
      window.addEventListener('keydown', skip)
      return () => {
        window.clearTimeout(delay)
        window.clearTimeout(hold)
        cancelAnimationFrame(rafRef.current)
        window.removeEventListener('keydown', skip)
      }
    }
    if (phase === 'fix') {
      const id = window.setTimeout(() => setPhase('grow'), FIX_MS)
      return () => window.clearTimeout(id)
    }
    if (phase === 'grow') {
      // Se fija la copia donde está y, en el cuadro siguiente, se la lleva a
      // ocupar toda la pantalla; la transición la hace el CSS.
      const el = paperRef.current
      const r = el.getBoundingClientRect()
      Object.assign(el.style, {
        position: 'fixed',
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
        aspectRatio: 'auto',
      })
      void el.offsetWidth
      Object.assign(el.style, {
        left: '0px',
        top: '0px',
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        padding: '0px',
      })
      const id = window.setTimeout(() => setPhase('fade'), GROW_MS)
      return () => window.clearTimeout(id)
    }
    if (phase === 'fade') {
      const id = window.setTimeout(() => setPhase('done'), FADE_MS)
      return () => window.clearTimeout(id)
    }
  }, [phase, mode, finish])

  if (phase === 'done') return null

  return (
    <div className="intro" data-phase={phase} onClick={finish} role="presentation">
      <div className="intro-tray mono" aria-hidden="true">
        <span>Revelador · 20 °C</span>
        <span ref={clockRef}>0:00</span>
      </div>
      {mode !== 'none' && (
        <div className="intro-paper" ref={paperRef} aria-hidden="true">
          <div className="intro-frame" ref={frameRef}>
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter
                  id="dev-noise"
                  filterUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={hero.w}
                  height={hero.h}
                  colorInterpolationFilters="sRGB"
                >
                  {/* Ruido precalculado: más liviano que feTurbulence en cada cuadro. */}
                  <feImage
                    href={NOISE}
                    x="0"
                    y="0"
                    width={hero.w}
                    height={hero.h}
                    preserveAspectRatio="none"
                  />
                  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" />
                  <feComponentTransfer>
                    <feFuncA ref={funcRef} type="linear" slope={SLOPE} intercept={-SLOPE} />
                  </feComponentTransfer>
                </filter>
                <mask id="dev-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={hero.w} height={hero.h}>
                  <rect width={hero.w} height={hero.h} fill="#fff" filter="url(#dev-noise)" />
                </mask>
              </defs>
              <image ref={imgRef} href={devSrc} width={hero.w} height={hero.h} mask="url(#dev-mask)" />
            </svg>
            {/* La copia ya revelada: la misma foto y el mismo encuadre que el hero. */}
            <img
              className="intro-photo"
              src={hero.src}
              srcSet={`${hero.mobile} 800w, ${hero.small} 1200w, ${hero.src} 2400w`}
              sizes="100vw"
              width={hero.w}
              height={hero.h}
              alt=""
            />
          </div>
        </div>
      )}
      <div className="intro-hud mono" aria-hidden="true">
        <span>Varela 400 · Safety film</span>
        <span>{touch ? 'Tocá para saltear' : 'Clic o cualquier tecla para saltear'}</span>
      </div>
    </div>
  )
}
