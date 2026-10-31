import { useEffect, useRef } from 'react'
import { hasFinePointer } from '../lib/motion'

const ZOOM = 2

// Cursor de laboratorio: un aro rojo que sobre las fotos se vuelve un
// cuentahílos y amplía x2 lo que tiene abajo. Solo con mouse.
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (!hasFinePointer()) return
    const el = ref.current
    const root = document.documentElement
    root.classList.add('has-cursor')
    let raf = 0
    let last = null

    const update = () => {
      raf = 0
      const e = last
      if (!e) return
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      el.classList.add('is-visible')
      // elementFromPoint y no e.target: al scrollear o cambiar de página, lo
      // que está bajo el cursor cambia sin que el mouse se mueva.
      const target = document.elementFromPoint(e.clientX, e.clientY)
      const img = target?.closest('[data-loupe]')
      if (img && img.complete && img.naturalWidth) {
        const box = img.getBoundingClientRect()
        // Tamaño real de la imagen dentro de la caja (object-fit: cover).
        const nw = img.naturalWidth
        const nh = img.naturalHeight
        const fit = getComputedStyle(img).objectFit
        const scale = fit === 'cover' ? Math.max(box.width / nw, box.height / nh) : box.width / nw
        const rw = nw * scale
        const rh = nh * scale
        const ox = (box.width - rw) / 2
        const oy = (box.height - rh) / 2
        const x = e.clientX - box.left - ox
        const y = e.clientY - box.top - oy
        const size = el.offsetWidth || 168
        el.classList.add('is-loupe')
        el.classList.remove('is-link')
        const src = img.dataset.loupe
        if (el.dataset.src !== src) {
          el.style.backgroundImage = `url("${src}")`
          el.dataset.src = src
        }
        el.style.backgroundSize = `${rw * ZOOM}px ${rh * ZOOM}px`
        el.style.backgroundPosition = `${size / 2 - x * ZOOM}px ${size / 2 - y * ZOOM}px`
      } else {
        el.classList.remove('is-loupe')
        el.style.backgroundImage = ''
        el.dataset.src = ''
        el.classList.toggle('is-link', !!target?.closest('a, button, label, input, textarea, select'))
      }
    }

    const onMove = (e) => {
      // En laptops con pantalla táctil, un toque también mueve el "puntero":
      // ahí el cursor se esconde para que no quede una lupa colgada.
      if (e.pointerType !== 'mouse') {
        last = null
        el.classList.remove('is-visible', 'is-loupe', 'is-link')
        return
      }
      last = e
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onLeave = () => el.classList.remove('is-visible')
    // Al scrollear la foto se mueve bajo el cursor quieto: recalcular.
    const onScroll = () => {
      if (last && !raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    // capture: también escucha el scroll de las tiras, no solo el de la página.
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor" aria-hidden="true" />
}
