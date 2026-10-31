// Trazos "a mano" de lápiz graso. Pseudoaleatorio con semilla para que cada
// fotograma tenga siempre el mismo trazo (y no cambie entre renders).

function rng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Un lazo irregular alrededor de un rectángulo de 150 × 100 (3:2), dibujado
// en un viewBox con margen. Arranca arriba a la izquierda y se pasa de largo
// al cerrar, como cuando se marca una copia apurado.
export function pencilLoop(seed) {
  const r = rng(seed)
  const j = (n) => (r() - 0.5) * n
  const cx = 75 + j(4)
  const cy = 50 + j(3)
  const rx = 80 + j(6)
  const ry = 57 + j(5)
  const start = -2.5 + j(0.6)
  const turns = 1.12 + r() * 0.08
  const steps = 26
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = start + (i / steps) * Math.PI * 2 * turns
    // Superelipse: más "caja" que óvalo, como se marcan los contactos.
    const c = Math.cos(t)
    const s = Math.sin(t)
    const k = 0.55
    const x = cx + rx * Math.sign(c) * Math.abs(c) ** k + j(3)
    const y = cy + ry * Math.sign(s) * Math.abs(s) ** k + j(3)
    // La segunda vuelta se abre un poco, el pulso se afloja.
    const drift = i > steps * 0.86 ? (i - steps * 0.86) * 0.9 : 0
    pts.push([x + drift * 0.4, y - drift])
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    d += ` Q${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  d += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`
  return d
}
