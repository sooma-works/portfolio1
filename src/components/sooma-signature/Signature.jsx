import logo from './assets/sooma-tile-sobre-oscuro-ocre-tinta.svg'
import './Signature.css'

export function Signature({ variant = 'color', logo: logoSrc = logo }) {
  const variantClass = variant !== 'color' ? ` signature--${variant}` : ''
  return (
    <a
      className={`signature signature--swap${variantClass}`}
      href="https://soomaworks.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Hecho por Sooma"
    >
      <span className="sig-mark" aria-hidden="true">
        <img src={logoSrc} alt="" />
      </span>
      <span className="sig-hecho">Hecho por&nbsp;</span>
      <span className="sig-sooma">
        sooma<span className="logo-dot">.</span>
      </span>
    </a>
  )
}
