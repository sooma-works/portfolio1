import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { prefersReducedMotion } from '../lib/motion'

const ShutterContext = createContext(null)
const HALF = 210 // ms que tarda cada lámina en cerrarse

const SPEEDS = ['1/60', '1/125', '1/250', '1/500']

export function ShutterProvider({ children }) {
  const navigate = useNavigate()
  const [closed, setClosed] = useState(false)
  const [speed, setSpeed] = useState(SPEEDS[1])
  const busy = useRef(false)

  const go = useCallback(
    (to) => {
      if (busy.current) return
      if (prefersReducedMotion()) {
        navigate(to)
        return
      }
      busy.current = true
      setSpeed(SPEEDS[Math.floor(Math.random() * SPEEDS.length)])
      setClosed(true)
      window.setTimeout(() => {
        navigate(to)
        // Dos cuadros para que la página nueva pinte antes de abrir.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setClosed(false)
            busy.current = false
          }),
        )
      }, HALF + 40)
    },
    [navigate],
  )

  return (
    <ShutterContext.Provider value={go}>
      {children}
      <div className={`shutter${closed ? ' is-closed' : ''}`} aria-hidden="true">
        <div className="shutter-blade shutter-blade--top" />
        <div className="shutter-blade shutter-blade--bottom" />
        <span className="shutter-speed mono">{speed}</span>
      </div>
    </ShutterContext.Provider>
  )
}

const useShutter = () => useContext(ShutterContext)

// El código de las series (con GSAP) se descarga recién cuando alguien
// muestra intención de abrir una: mouse encima, foco o primer toque.
let seriesPrefetched = false
const prefetchSeries = () => {
  if (seriesPrefetched) return
  seriesPrefetched = true
  import('../pages/Series')
}

// Link que navega "a través" del obturador. Respeta clic con modificadores
// (abrir en pestaña nueva) y los anclas dentro de la misma página.
export function ShutterLink({ to, onClick, delay = 0, children, ...props }) {
  const go = useShutter()
  const location = useLocation()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    const [path, hash] = to.split('#')
    if ((path || '/') === location.pathname) {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        history.replaceState(null, '', `#${hash}`)
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
      return
    }
    if (delay) window.setTimeout(() => go(to), delay)
    else go(to)
  }

  const intent = to.startsWith('/series/') ? prefetchSeries : undefined

  return (
    <a href={to} onClick={handleClick} onPointerEnter={intent} onFocus={intent} onTouchStart={intent} {...props}>
      {children}
    </a>
  )
}

// Al cambiar de ruta: arriba de todo, o al ancla si la hay.
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else if (tries++ < 20) requestAnimationFrame(tick)
      }
      tick()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}
