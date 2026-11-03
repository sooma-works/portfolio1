import { useEffect, useState } from 'react'
import { ShutterLink } from './Shutter'

const links = [
  ['/#series', 'Series'],
  ['/#sobre-mi', 'Sobre mí'],
  ['/#encargos', 'Encargos'],
  ['/#contacto', 'Contacto'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  // Arriba del todo la barra flota sobre la foto; apenas se scrollea toma
  // fondo para que se lea sobre cualquier contenido.
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <ShutterLink to="/" className="nav-mark" aria-label="IV · Inés Varela, inicio">
        IV
      </ShutterLink>
      <nav aria-label="Principal">
        <ul className="nav-links mono">
          {links.map(([to, label]) => (
            <li key={to}>
              <ShutterLink to={to}>{label}</ShutterLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
