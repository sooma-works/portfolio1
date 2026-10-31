import { ShutterLink } from '../components/Shutter'

export default function NotFound() {
  return (
    <main id="contenido" className="credits">
      <p className="mono" style={{ color: '#a39b8e' }}>Error 404 · fotograma velado</p>
      <h1 className="section-title" style={{ marginTop: 16 }}>
        Esta página se veló.
      </h1>
      <p style={{ marginTop: 24, maxWidth: '44ch', color: '#d9d2c6' }}>
        La dirección no existe o cambió. Volvé al inicio para ver las series.
      </p>
      <p className="mono" style={{ marginTop: 32 }}>
        <ShutterLink to="/#series" className="u" style={{ textDecoration: 'underline' }}>
          Ver las series
        </ShutterLink>
      </p>
    </main>
  )
}
