import { commissions } from '../data/site'
import { ShutterLink } from './Shutter'

export default function Commissions() {
  return (
    <section className="commissions" id="encargos" aria-labelledby="encargos-title">
      <h2 className="section-title" id="encargos-title">
        Encargos
      </h2>
      <div className="commission-list">
        {commissions.map((c) => (
          <article className="commission" key={c.title}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
      <p className="commission-foot mono">
        <span>Cada trabajo se presupuesta aparte.</span>
        <ShutterLink to="/#contacto">Contame qué tenés en mente</ShutterLink>
      </p>
    </section>
  )
}
