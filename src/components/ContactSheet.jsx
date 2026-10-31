import { useEffect, useRef } from 'react'
import { series } from '../data/series'
import { pencilLoop } from '../lib/pencil'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'
import { ShutterLink } from './Shutter'

// La tira se repite tres veces y el scroll salta de una copia a otra sin que
// se note: el rollo no se termina nunca.
const COPIES = 3
const DRIFT = 12 // px por segundo

function useEndlessStrip(ref, direction) {
  useEffect(() => {
    const el = ref.current
    const setWidth = () => el.scrollWidth / COPIES
    // En pantallas táctiles el rollo no avanza solo: el dedo manda.
    const drifts = hasFinePointer() && !prefersReducedMotion()
    let pos = 0
    let paused = false
    let visible = false
    let resumeTimer = 0
    let settleTimer = 0
    let raf = 0
    let last = 0

    const jump = (to) => {
      pos = to
      el.scrollLeft = Math.round(pos)
    }
    // Volver a la copia del medio. Solo cuando el scroll está quieto, para no
    // cortar la inercia del gesto (en iOS y Android un salto la frena).
    const recenter = () => {
      const w = setWidth()
      if (!w) return
      const inside = ((pos % w) + w) % w
      if (Math.abs(pos - (w + inside)) > 1) jump(w + inside)
    }

    const onScroll = () => {
      // Si el scroll quedó donde lo dejamos nosotros, no lo hizo la persona.
      if (Math.abs(el.scrollLeft - Math.round(pos)) <= 1) return
      pos = el.scrollLeft
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(recenter, 180)
    }
    const onScrollEnd = () => {
      window.clearTimeout(settleTimer)
      recenter()
    }

    // Con mouse, el rollo avanza despacio mientras nadie lo toca.
    const tick = (now) => {
      if (last && !paused && visible) {
        jump(pos + (direction * DRIFT * (now - last)) / 1000)
        const w = setWidth()
        if (pos < w * 0.5 || pos > w * 1.5) recenter()
      }
      last = now
      raf = requestAnimationFrame(tick)
    }
    const pause = () => {
      window.clearTimeout(resumeTimer)
      paused = true
    }
    const resume = (delay = 0) => {
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(() => {
        paused = false
        last = 0
      }, delay)
    }
    const onEnter = (e) => {
      if (e.pointerType === 'mouse') pause()
    }
    const onLeave = (e) => {
      if (e.pointerType === 'mouse') resume()
    }
    const onTouchStart = () => pause()
    const onTouchEnd = () => resume(3000)
    const onFocusIn = () => pause()
    const onFocusOut = (e) => {
      if (!el.contains(e.relatedTarget)) resume()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(el)
    // Al arrancar, la portada queda centrada (así el lápiz no se corta).
    const frame = el.querySelector('.frame')
    jump(setWidth() - (frame ? (el.clientWidth - frame.offsetWidth) / 2 : 0))
    const ro = new ResizeObserver(recenter)
    ro.observe(el)

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('scrollend', onScrollEnd)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)
    if (drifts) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resumeTimer)
      window.clearTimeout(settleTimer)
      io.disconnect()
      ro.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', onScrollEnd)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [ref, direction])
}

// Con el dedo no hay hover: al tocar un fotograma, el lápiz lo marca y
// recién ahí se cierra el obturador.
const markThenGo = (e) => {
  if (hasFinePointer()) return
  e.currentTarget.classList.add('is-marked')
}

function Strip({ s, index }) {
  const frames = [s.cover, ...s.photos]
  const firstFrame = 12 + index * 14
  const scroller = useRef(null)
  const edge = `${s.roll.toUpperCase()} · SAFETY FILM`
  useEndlessStrip(scroller, index % 2 ? -1 : 1)

  return (
    <div className="strip-row">
      <div className="strip-label">
        <h3>{s.title}</h3>
        <span className="mono">
          {s.kind} · {s.treatment}
          <span className="hidden sm:inline"> · {frames.length} fotos</span>
        </span>
      </div>
      <div className="strip">
        <div className="strip-frames" ref={scroller}>
          <div className="strip-track">
            {Array.from({ length: COPIES }, (_, copy) =>
              frames.map((f, i) => {
                const n = firstFrame + i
                const main = copy === 1
                return (
                  <ShutterLink
                    key={`${copy}-${f.src}`}
                    to={`/series/${s.slug}`}
                    className="frame"
                    onClick={markThenGo}
                    delay={hasFinePointer() ? 0 : 420}
                    tabIndex={main && i === 0 ? 0 : -1}
                    aria-hidden={main ? undefined : 'true'}
                    aria-label={main && i === 0 ? `Ver la serie ${s.title}` : undefined}
                  >
                    {i % 3 === 0 && (
                      <span className="frame-edge" aria-hidden="true">
                        {edge}
                      </span>
                    )}
                    <span className="frame-num" aria-hidden="true">
                      <b>{n}</b>
                      {n}A
                    </span>
                    <img
                      className="frame-img"
                      src={f.small}
                      width={f.w > f.h ? 800 : Math.round((800 * f.w) / f.h)}
                      height={f.w > f.h ? Math.round((800 * f.h) / f.w) : 800}
                      alt={main && i > 0 ? f.alt : ''}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      data-loupe={f.src}
                    />
                    <svg className="pencil" viewBox="-13.5 -14 177 128" aria-hidden="true">
                      <path d={pencilLoop(index * 31 + i * 7 + 3)} pathLength="1" />
                    </svg>
                  </ShutterLink>
                )
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactSheet() {
  return (
    <section className="sheet-wrap" id="series" aria-labelledby="series-title">
      <div className="sheet">
        <div className="sheet-head">
          <h2 className="section-title" id="series-title">
            Series
          </h2>
          <p>
            Cada tira es un rollo, copiado en la hoja de contactos tal como salió del laboratorio.
            Elegí cualquier fotograma para ver la serie completa.
          </p>
        </div>
        {series.map((s, i) => (
          <Strip key={s.slug} s={s} index={i} />
        ))}
        <p className="sheet-note" aria-hidden="true">
          hoja de contactos · 4 rollos
        </p>
      </div>
    </section>
  )
}
