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
  const canvasRef = useRef(null)
  // Todo lo que necesita el canvas para pintar un cuadro (se arma al montar).
  const devRef = useRef(null)
  const paperRef = useRef(null)
  const frameRef = useRef(null)
  const clockRef = useRef(null)
  const rafRef = useRef(0)
  const [touch] = useState(() => !hasFinePointer())
  // En pantallas chicas el revelado usa la misma versión liviana que el hero.
  const [devSrc] = useState(() =>
    window.innerWidth * (window.devicePixelRatio || 1) < 1000 ? hero.mobile : hero.small,
  )

  // Pinta un cuadro del revelado en el canvas. Se hace en canvas (y no con
  // filtros SVG) porque Safari en iPhone no aplica filtros dentro de una
  // máscara SVG ni filtros CSS sobre elementos SVG: ahí no se veía nada.
  const paint = (t) => {
    const k = ease(t)
    const dev = devRef.current
    if (dev?.ready) {
      // Umbral del ruido: a 0 no pasa nada de imagen, a 1 pasa toda.
      const intercept = -SLOPE + k * (1 + SLOPE)
      const { noise, maskData, maskCtx, mask, ctx, photo, crop, w, h } = dev
      const px = maskData.data
      for (let i = 0, j = 3; i < noise.length; i++, j += 4) {
        const a = (SLOPE * noise[i]) / 255 + intercept
        px[j] = a <= 0 ? 0 : a >= 1 ? 255 : a * 255
      }
      maskCtx.putImageData(maskData, 0, 0)
      ctx.globalCompositeOperation = 'copy'
      ctx.drawImage(photo, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h)
      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(mask, 0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
    }
    if (canvasRef.current) {
      canvasRef.current.style.filter = `brightness(${(2.1 - 1.1 * k).toFixed(3)}) contrast(${(0.45 + 0.55 * k).toFixed(3)})`
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
    const canvas = canvasRef.current
    if (!frame || !canvas) return
    const { width: fw, height: fh } = frame.getBoundingClientRect()
    const x = parseFloat(getComputedStyle(frame).getPropertyValue('--hero-x')) || 0.5
    const scale = Math.max(fw / hero.w, fh / hero.h)
    const vw = fw / scale
    const vh = fh / scale
    const vx = (hero.w - vw) * x
    const vy = (hero.h - vh) / 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(fw * dpr)
    const h = Math.round(fh * dpr)
    canvas.width = w
    canvas.height = h
    // La máscara se calcula chica y se agranda: los bordes quedan suaves.
    const mw = 220
    const mh = Math.max(1, Math.round((mw * fh) / fw))
    const mask = document.createElement('canvas')
    mask.width = mw
    mask.height = mh
    const maskCtx = mask.getContext('2d', { willReadFrequently: true })

    const load = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    let cancelled = false
    Promise.all([load(devSrc), load(NOISE)])
      .then(([photo, noiseImg]) => {
        if (cancelled) return
        const kp = photo.naturalWidth / hero.w
        const kn = noiseImg.naturalWidth / hero.w
        maskCtx.drawImage(noiseImg, vx * kn, vy * kn, vw * kn, vh * kn, 0, 0, mw, mh)
        const raw = maskCtx.getImageData(0, 0, mw, mh).data
        const noise = new Uint8Array(mw * mh)
        for (let i = 0; i < noise.length; i++) noise[i] = raw[i * 4]
        const maskData = maskCtx.createImageData(mw, mh)
        for (let i = 0; i < maskData.data.length; i += 4) {
          maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = 255
        }
        devRef.current = {
          ready: true,
          noise,
          maskData,
          maskCtx,
          mask,
          ctx: canvas.getContext('2d'),
          photo,
          crop: { sx: vx * kp, sy: vy * kp, sw: vw * kp, sh: vh * kp },
          w,
          h,
        }
      })
      .catch(() => {
        // Si algo no carga, la intro sigue igual y al final aparece la foto.
      })
    return () => {
      cancelled = true
    }
  }, [devSrc])

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
      let waited = 0
      let delay = 0
      const begin = () => {
        if (!devRef.current?.ready && waited < 2500) {
          waited += 100
          delay = window.setTimeout(begin, 100)
          return
        }
        const tick = (now) => {
          if (!start) start = now
          const t = Math.min(1, (now - start) / DEVELOP_MS)
          paint(t)
          if (t < 1) rafRef.current = requestAnimationFrame(tick)
          else hold = window.setTimeout(() => setPhase('fix'), 450)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      delay = window.setTimeout(begin, 500)
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
      // El destino es la foto del hero tal como está en pantalla (y no el
      // alto de la ventana): en iPhone las barras del navegador hacen que
      // no coincidan, y al terminar la foto "saltaba".
      const target = document.querySelector('.hero-img')?.getBoundingClientRect()
      Object.assign(el.style, {
        left: `${target ? target.left : 0}px`,
        top: `${target ? target.top : 0}px`,
        width: `${target ? target.width : window.innerWidth}px`,
        height: `${target ? target.height : window.innerHeight}px`,
        borderWidth: '0px',
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
            <canvas ref={canvasRef} className="intro-canvas" />
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
