import { useState } from 'react'
import { jobTypes, site } from '../data/site'

const FORM_NAME = 'sobre'

const encode = (data) => new URLSearchParams(data).toString()

// Tilde de lápiz para las casillas del formulario.
function Tick() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 6 C10 11 16 18 23 23" pathLength="1" fill="none" stroke="var(--safelight)" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 5 C17 11 11 17 6 23" pathLength="1" fill="none" stroke="var(--safelight)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// El contacto es un sobre de laboratorio: un formulario impreso que se
// completa a mano. Se envía con Netlify Forms.
export default function Envelope() {
  const [status, setStatus] = useState('idle')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const tipos = data.getAll('tipo').join(', ')
    data.delete('tipo')
    data.set('tipo', tipos)
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(data),
      })
      if (!res.ok) throw new Error(res.statusText)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="envelope-wrap" id="contacto" aria-labelledby="contacto-title">
      <form
        className="envelope"
        name={FORM_NAME}
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={onSubmit}
      >
        <input type="hidden" name="form-name" value={FORM_NAME} />
        <p className="honeypot">
          <label>
            No completar: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <div className="envelope-head">
          <h2 id="contacto-title">
            Contacto
            <br />
            <em>sobre de negativos</em>
          </h2>
          <div className="envelope-order mono">
            Orden n.º
            <span>0412</span>
          </div>
        </div>
        <p className="envelope-intro">
          Completá el sobre como si dejaras un rollo en el laboratorio. Te contesto en unos días.
        </p>

        <div className="field">
          <label className="mono" htmlFor="f-nombre">Nombre</label>
          <input className="hand-input" id="f-nombre" name="nombre" autoComplete="name" required />
        </div>
        <div className="field">
          <label className="mono" htmlFor="f-email">Email</label>
          <input className="hand-input" id="f-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field field--checks" role="group" aria-labelledby="f-tipo">
          <span className="mono field-label" id="f-tipo">Tipo de trabajo</span>
          <div className="checks">
            {jobTypes.map((t) => (
              <label className="check mono" key={t}>
                <input type="checkbox" name="tipo" value={t} />
                <Tick />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="mono" htmlFor="f-fecha">Fecha</label>
          <input className="hand-input" id="f-fecha" name="fecha" placeholder="más o menos cuándo" />
        </div>
        <div className="field field--notes">
          <label className="mono" htmlFor="f-mensaje">Indicaciones</label>
          <textarea
            className="hand-input hand-notes"
            id="f-mensaje"
            name="mensaje"
            rows={4}
            placeholder="qué tenés en mente, dónde, para quién"
            required
          />
        </div>

        <div className="envelope-foot mono">
          <span>
            O escribime a <a href={`mailto:${site.email}`}>{site.email}</a>
          </span>
          <button className="btn-send" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar el sobre'}
          </button>
        </div>
        <div aria-live="polite">
          {status === 'sent' && (
            <p className="stamp">
              Recibido
              <small>te escribo pronto</small>
            </p>
          )}
          {status === 'error' && (
            <p className="form-error mono">
              No se pudo enviar el sobre. Probá de nuevo o escribime por mail.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
