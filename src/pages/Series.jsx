import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getSeries, nextSeries } from '../data/series'
import { ShutterLink } from '../components/Shutter'
import { pencilLoop } from '../lib/pencil'
import NotFound from './NotFound'

gsap.registerPlugin(ScrollTrigger)

const HORIZONTAL = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

function Reel({ s }) {
  const horizontal = useMedia(HORIZONTAL)
  const root = useRef(null)
  const track = useRef(null)
  const perfs = useRef([])

  // Scroll vertical → la tira corre en horizontal. Las perforaciones van a
  // otra velocidad para que se sienta la película pasando por la cámara.
  useLayoutEffect(() => {
    if (!horizontal) return
    const ctx = gsap.context(() => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      // Las perforaciones tienen que alcanzar para todo el recorrido.
      gsap.set(perfs.current, { width: () => track.current.scrollWidth * 1.2 + window.innerWidth })
      tl.to(track.current, { x: () => -distance() }, 0)
      tl.to(perfs.current, { x: () => -distance() * 1.12 }, 0)
    }, root)
    // Las fotos llegan después: recalcular el largo cuando cargan.
    const imgs = [...root.current.querySelectorAll('img')]
    const refresh = () => ScrollTrigger.refresh()
    imgs.forEach((img) => img.addEventListener('load', refresh))
    return () => {
      imgs.forEach((img) => img.removeEventListener('load', refresh))
      ctx.revert()
    }
  }, [horizontal, s.slug])

  const frames = [s.cover, ...s.photos]
  const edge = `${s.roll.toUpperCase()} · SAFETY FILM · `.repeat(80)

  return (
    <section ref={root} className={`reel${horizontal ? '' : ' is-vertical'}`} aria-label={`Fotos de ${s.title}`}>
      <div className="reel-pin">
        <div className="reel-band">
        <div ref={(el) => (perfs.current[0] = el)} className="perfs perfs--top" aria-hidden="true" />
        <div ref={(el) => (perfs.current[1] = el)} className="reel-edge reel-edge--top" aria-hidden="true">
          {edge}
        </div>
        <div ref={track} className="reel-track">
          {frames.map((f, i) => (
            <figure className="reel-frame" key={f.src}>
              <img
                src={f.src}
                srcSet={`${f.small} 800w, ${f.src} 2000w`}
                sizes={horizontal ? `${Math.round((70 * f.w) / f.h)}vh` : '100vw'}
                width={f.w}
                height={f.h}
                alt={f.alt}
                loading={horizontal || i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                data-loupe={f.src}
              />
              <figcaption className="mono">
                <b>{String(i + 1).padStart(2, '0')}A</b>
                <span>{f.exif}</span>
                <span>
                  {f.place}, {f.year}
                </span>
              </figcaption>
            </figure>
          ))}
          <div className="reel-end" aria-hidden="true">
            <p className="reel-end-title">Fin del rollo</p>
            <p className="mono">{frames.length} fotogramas · {s.roll}</p>
          </div>
        </div>
        <div ref={(el) => (perfs.current[2] = el)} className="perfs perfs--bottom" aria-hidden="true" />
        <div ref={(el) => (perfs.current[3] = el)} className="reel-edge reel-edge--bottom" aria-hidden="true">
          {edge}
        </div>
        </div>
      </div>
    </section>
  )
}

export default function Series() {
  const { slug } = useParams()
  const s = getSeries(slug)

  useEffect(() => {
    if (s) document.title = `${s.title} — Inés Varela, fotógrafa`
    return () => {
      document.title = 'Inés Varela — Fotógrafa en Rosario'
    }
  }, [s])

  if (!s) return <NotFound />
  const next = nextSeries(slug)
  const [first, ...restWords] = s.title.split(' ')

  return (
    <main id="contenido">
      <header className="series-head">
        <ShutterLink to="/#series" className="back-link mono">
          ← Todas las series
        </ShutterLink>
        <h1 className="series-title">
          {first}
          {restWords.length > 0 && (
            <>
              {' '}
              <em>{restWords.join(' ')}</em>
            </>
          )}
        </h1>
        <div className="series-intro">
          <dl className="series-meta mono">
            <div>
              <dt>Tipo</dt>
              <dd>{s.kind}</dd>
            </div>
            <div>
              <dt>Tratamiento</dt>
              <dd>{s.treatment === 'B/N' ? 'Blanco y negro' : 'Color'}</dd>
            </div>
            <div>
              <dt>Años</dt>
              <dd>{s.years}</dd>
            </div>
            <div>
              <dt>Película</dt>
              <dd>{s.roll}</dd>
            </div>
            <div>
              <dt>Fotogramas</dt>
              <dd>{s.photos.length + 1}</dd>
            </div>
          </dl>
          <div className="series-text">
            {s.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </header>
      <Reel key={s.slug} s={s} />
      <nav className="next-wrap" aria-label="Más series">
        <ShutterLink to={`/series/${next.slug}`} className="next">
          <span className="next-frame">
            <img
              src={next.cover.small}
              width={next.cover.w > next.cover.h ? 800 : Math.round((800 * next.cover.w) / next.cover.h)}
              height={next.cover.w > next.cover.h ? Math.round((800 * next.cover.h) / next.cover.w) : 800}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <svg className="pencil" viewBox="-13.5 -14 177 128" aria-hidden="true">
              <path d={pencilLoop(next.slug.length * 17 + 5)} pathLength="1" />
            </svg>
          </span>
          <span className="next-body">
            <span className="mono next-kicker">Siguiente rollo</span>
            <span className="next-title">{next.title}</span>
            <span className="mono next-meta">
              {next.kind} · {next.treatment} · {next.photos.length + 1} fotos
            </span>
          </span>
        </ShutterLink>
        <ShutterLink to="/#series" className="next-all mono">
          Ver todas las series
        </ShutterLink>
      </nav>
    </main>
  )
}
