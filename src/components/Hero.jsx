import { hero, site } from '../data/site'

// Marcas de recorte en lápiz graso: el único rojo del hero. Cada esquina
// es un trazo suelto, apenas torcido, como hecho a mano sobre la copia.
// El trazo escala con la esquina (viewBox de 48), por eso va fino.
const corners = [
  { pos: 'tl', d: 'M3 44 C4 30 2 16 4 4 C16 2 30 4 44 3' },
  { pos: 'tr', d: 'M4 3 C18 4 30 2 42 4 C44 16 42 30 44 43' },
  { pos: 'br', d: 'M43 4 C42 18 44 30 42 42 C30 44 16 42 3 44' },
  { pos: 'bl', d: 'M42 44 C30 42 16 44 4 43 C2 30 4 16 3 4' },
]

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-name">
      <img
        className="hero-img"
        src={hero.src}
        srcSet={`${hero.mobile} 800w, ${hero.small} 1200w, ${hero.src} 2400w`}
        sizes="100vw"
        width={hero.w}
        height={hero.h}
        alt={hero.alt}
        fetchPriority="high"
        data-loupe={hero.src}
      />
      <div className="hero-crop" aria-hidden="true">
        {corners.map((c) => (
          <svg key={c.pos} className={`hero-corner hero-corner--${c.pos}`} viewBox="0 0 48 48">
            <path d={c.d} pathLength="1" fill="none" stroke="var(--safelight)" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        ))}
      </div>
      <h1 className="hero-name" id="hero-name">
        <span>Inés</span>
        <span>Varela</span>
      </h1>
      <div className="hero-meta mono">
        <span>
          {site.role} · {site.base}
        </span>
        <span className="fixer">
          {hero.exif} · {hero.place}, {hero.year}
        </span>
      </div>
    </section>
  )
}
