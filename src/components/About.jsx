import { about } from '../data/site'

// Broche de madera, como los que cuelgan las copias a secar.
function Clip() {
  return (
    <svg className="clip" viewBox="0 0 26 64" aria-hidden="true">
      <rect x="3" y="0" width="9" height="64" rx="2" fill="#8b6a45" />
      <rect x="14" y="0" width="9" height="64" rx="2" fill="#7a5c3b" />
      <rect x="1" y="22" width="24" height="7" rx="1.5" fill="#b9b2a6" />
    </svg>
  )
}

export default function About() {
  const [lede, ...rest] = about.paragraphs
  return (
    <section className="about" id="sobre-mi" aria-labelledby="about-title">
      <div className="line">
        <figure className="print">
          <Clip />
          <img
            src={about.portrait.small}
            srcSet={`${about.portrait.small} 800w, ${about.portrait.src} 1333w`}
            sizes="(max-width: 767px) 300px, 40vw"
            width={about.portrait.w}
            height={about.portrait.h}
            alt={about.portrait.alt}
            loading="lazy"
            decoding="async"
            data-loupe={about.portrait.src}
          />
          <figcaption>
            <span>Autorretrato, 2024</span>
            <span>n.º 7</span>
          </figcaption>
        </figure>
      </div>
      <div className="about-text">
        <h2 className="section-title" id="about-title">
          Sobre mí
        </h2>
        <p className="about-lede">{lede}</p>
        <div className="about-body">
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="facts">
          {about.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="mono">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
