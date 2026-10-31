import { Signature } from './sooma-signature/Signature.jsx'
import soomaPapel from './sooma-signature/assets/sooma-tile-papel-tinta.svg'
import { ShutterLink } from './Shutter'
import { site } from '../data/site'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sign">
        {/* Caja de ancho fijo: la firma se anima adentro sin empujar el texto. */}
        <span className="sooma-slot">
          <Signature variant="white" logo={soomaPapel} />
        </span>
        <span className="mono">Proyecto demo · contenido ficticio</span>
      </div>
      <div className="footer-info mono">
        <span>© {YEAR} {site.name}</span>
        <span>{site.instagram}</span>
        <ShutterLink to="/creditos" className="u">
          Fotos: Unsplash · créditos
        </ShutterLink>
      </div>
    </footer>
  )
}
