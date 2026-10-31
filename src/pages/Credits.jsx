import { useEffect } from 'react'
import { credits } from '../data/credits'

export default function Credits() {
  useEffect(() => {
    document.title = 'Créditos — Inés Varela, fotógrafa'
    return () => {
      document.title = 'Inés Varela — Fotógrafa en Rosario'
    }
  }, [])

  return (
    <main id="contenido" className="credits">
      <h1 className="section-title">Créditos</h1>
      <p style={{ marginTop: 24, maxWidth: '58ch', color: '#d9d2c6' }}>
        Inés Varela es un personaje inventado para este sitio de muestra. Las fotos son de
        fotógrafos reales que las publicaron en Unsplash con licencia libre; los textos, lugares
        y datos de cámara son ficticios.
      </p>
      <table className="mono">
        <thead>
          <tr>
            <th scope="col">Archivo</th>
            <th scope="col">Serie</th>
            <th scope="col">Autor</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c) => (
            <tr key={c.file}>
              <td>
                <a href={c.url} target="_blank" rel="noreferrer">
                  {c.file.replace('/img/', '')}
                </a>
              </td>
              <td>{c.serie}</td>
              <td>
                <a href={c.profile} target="_blank" rel="noreferrer">
                  {c.author}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
