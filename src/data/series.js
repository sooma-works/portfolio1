// Las cuatro series del portfolio. Cada foto lleva su "receta" (EXIF
// inventado pero verosímil), lugar y año. La foto 00 es la portada.

const p = (serie, file, w, h, alt, exif, place, year) => ({
  src: `/img/${serie}/${file}.jpg`,
  small: `/img/${serie}/${file}-800.jpg`,
  thumb: `/img/${serie}/${file}-400.jpg`,
  w,
  h,
  alt,
  exif,
  place,
  year,
})

export const series = [
  {
    slug: 'rio-marron',
    title: 'Río marrón',
    kind: 'Documental',
    treatment: 'B/N',
    years: '2019–2024',
    roll: 'Varela 400',
    text: [
      'Durante cinco inviernos crucé al otro lado del Paraná con los mismos pescadores. Salíamos antes de que aclare y volvíamos con lo que hubiera.',
      'El río no es azul nunca. Arrastra tierra de medio continente y te devuelve todo del mismo color: las canoas, las redes, la piel.',
      'No quise contar la pobreza ni la épica. Quise contar el tiempo que pasa entre que tirás la red y la levantás.',
    ],
    cover: p('rio-marron', '00', 2000, 1333, 'Dos hombres de pie en una canoa larga, sobre agua quieta, junto a un banco de arena.', 'f/8 · 1/500 · ISO 400 · 50mm', 'Islas frente a Rosario', 2022),
    photos: [
      p('rio-marron', '01', 2000, 1333, 'Una canoa chica cruza el río frente a una costa de cañaverales tupidos.', 'f/5.6 · 1/250 · ISO 400 · 85mm', 'Arroyo Leyes, Santa Fe', 2021),
      p('rio-marron', '02', 2000, 1126, 'Un pescador rema sentado en una canoa de madera, delante de una maraña de raíces en la orilla.', 'f/4 · 1/250 · ISO 400 · 135mm', 'Isla El Charigüé', 2020),
      p('rio-marron', '03', 2000, 1126, 'El mismo pescador de perfil, con gorra, quieto en su canoa bajo las raíces de la costa.', 'f/4 · 1/125 · ISO 400 · 135mm', 'Isla El Charigüé', 2020),
      p('rio-marron', '04', 2000, 1353, 'Un pescador metido en el río hasta la cintura lanza una red que se abre como una tela blanca.', 'f/5.6 · 1/1000 · ISO 400 · 50mm', 'Puerto Gaboto', 2023),
      p('rio-marron', '05', 1333, 2000, 'Vista desde arriba de una canoa angosta; un hombre se asoma por la borda con una red en la mano.', 'f/8 · 1/500 · ISO 400 · 28mm', 'Victoria, Entre Ríos', 2022),
      p('rio-marron', '06', 2000, 1312, 'Tres siluetas de pie sobre un muelle de madera al amanecer, con el río quieto detrás.', 'f/11 · 1/250 · ISO 400 · 35mm', 'San Pedro', 2019),
      p('rio-marron', '07', 2000, 1500, 'Un hombre avanza dentro del río con el agua por las rodillas, buscando algo con las manos.', 'f/5.6 · 1/500 · ISO 400 · 85mm', 'Villa Constitución', 2024),
      p('rio-marron', '08', 2000, 1333, 'Un pescador con sombrero, agachado en la orilla, sostiene una red de mano sobre el agua.', 'f/4 · 1/500 · ISO 400 · 50mm', 'Isla Verde, Rosario', 2021),
      p('rio-marron', '09', 2000, 1333, 'Un nene salta en la orilla mientras un hombre lanza una red al río.', 'f/8 · 1/1000 · ISO 400 · 35mm', 'Isla Verde, Rosario', 2023),
    ],
  },
  {
    slug: 'oficios',
    title: 'Oficios',
    kind: 'Retrato',
    treatment: 'B/N',
    years: '2021–2025',
    roll: 'Varela 400',
    text: [
      'Empezó con el afilador de mi cuadra, que me dejó sentarme en su taller una tarde entera sin preguntarme para qué.',
      'Después vinieron un zapatero, una panadera que arranca a las cuatro, un luthier que tarda un año en terminar una guitarra.',
      'Les pedí lo mismo a todos: que siguieran trabajando. Las manos saben posar mejor que las caras.',
    ],
    cover: p('oficios', '00', 1600, 2000, 'Un hombre mayor de anteojos sentado en su taller, entre una amoladora y estantes con herramientas.', 'f/2.8 · 1/60 · ISO 800 · 35mm', 'Barrio Echesortu, Rosario', 2021),
    photos: [
      p('oficios', '01', 1334, 2000, 'Manos que recortan con una trincheta el borde de una suela sobre la mesa de trabajo.', 'f/2.8 · 1/125 · ISO 800 · 50mm', 'Barrio Refinería, Rosario', 2022),
      p('oficios', '02', 1333, 2000, 'Un zapatero joven, inclinado sobre un zapato que sostiene entre las rodillas.', 'f/2 · 1/60 · ISO 800 · 35mm', 'Córdoba', 2022),
      p('oficios', '03', 2000, 1622, 'Dos hombres con delantal conversan en un taller lleno de máquinas y herramientas colgadas.', 'f/4 · 1/60 · ISO 1600 · 28mm', 'Avellaneda, Buenos Aires', 2023),
      p('oficios', '04', 2000, 1333, 'La mano de una panadera alinea bollos de masa sobre la mesa enharinada.', 'f/2.8 · 1/125 · ISO 800 · 50mm', 'Funes, Santa Fe', 2024),
      p('oficios', '05', 1333, 2000, 'Una mano cubierta de harina apoyada sobre la masa, con la luz rasante de la madrugada.', 'f/2 · 1/60 · ISO 1600 · 50mm', 'Funes, Santa Fe', 2024),
      p('oficios', '06', 2000, 1333, 'Taller de luthier: violines y violonchelos colgados de la pared, maderas apiladas abajo.', 'f/4 · 1/30 · ISO 800 · 28mm', 'San Telmo, Buenos Aires', 2023),
      p('oficios', '07', 2000, 1502, 'El cuerpo de una guitarra sin terminar sobre el banco de trabajo, con virutas alrededor.', 'f/2.8 · 1/60 · ISO 800 · 50mm', 'San Telmo, Buenos Aires', 2023),
      p('oficios', '08', 2000, 1331, 'Un carpintero cepilla una tabla en su banco; la luz entra de costado por una ventana.', 'f/4 · 1/125 · ISO 400 · 35mm', 'Tandil', 2025),
      p('oficios', '09', 1333, 2000, 'Un hombre concentrado trabaja una pieza de madera con la mirada baja.', 'f/2.8 · 1/60 · ISO 800 · 50mm', 'Tandil', 2025),
    ],
  },
  {
    slug: 'domingo',
    title: 'Domingo',
    kind: 'Documental',
    treatment: 'Color',
    years: '2020–2025',
    roll: 'Varela 200 Color',
    text: [
      'El domingo en el barrio tiene un orden que nadie escribió: la parrilla prendida a las once, el partido de veteranos, el truco que se estira hasta que oscurece.',
      'Lo fotografié en color porque así me acuerdo de esos días: amarillentos, un poco gastados, con olor a carbón.',
      'Casi todas las fotos son de gente que conozco. Algunas se las devolví impresas y ahora están pegadas en una heladera.',
    ],
    cover: p('domingo', '00', 2000, 1125, 'Un partido de veteranos en una cancha de pasto; en primer plano, un jugador de espaldas con camiseta blanca.', 'f/5.6 · 1/500 · ISO 200 · 85mm', 'Club Sportivo, Granadero Baigorria', 2023),
    photos: [
      p('domingo', '01', 2000, 1333, 'Un hombre de camisa a cuadros da vuelta la carne en una parrilla al aire libre, entre plantas.', 'f/2.8 · 1/250 · ISO 200 · 50mm', 'Pérez, Santa Fe', 2022),
      p('domingo', '02', 2000, 1312, 'Tres jubilados juegan a las cartas en una mesa de cemento de una plaza.', 'f/5.6 · 1/250 · ISO 200 · 35mm', 'Plaza López, Rosario', 2021),
      p('domingo', '03', 2000, 1333, 'Una pareja mayor juega a las cartas en la mesa del comedor, después de comer.', 'f/2.8 · 1/60 · ISO 400 · 35mm', 'Barrio Fisherton, Rosario', 2024),
      p('domingo', '04', 1333, 2000, 'Una mesa larga bajo una galería de madera, llena de gente almorzando.', 'f/4 · 1/125 · ISO 400 · 28mm', 'Colonia Caroya, Córdoba', 2020),
      p('domingo', '05', 2000, 1333, 'Siete hombres alrededor de una mesa de paño verde, en el buffet de un club.', 'f/2.8 · 1/60 · ISO 400 · 35mm', 'Club Unión, Arroyo Seco', 2022),
      p('domingo', '06', 1600, 2000, 'Un chico con camiseta a rayas patea una pelota en una cancha de barrio.', 'f/4 · 1/1000 · ISO 200 · 85mm', 'Villa Gobernador Gálvez', 2023),
      p('domingo', '07', 2000, 1334, 'Gente sentada en el pasto de la costanera, bajo los sauces, en una tarde de sol.', 'f/8 · 1/500 · ISO 200 · 35mm', 'Costanera norte, Rosario', 2025),
      p('domingo', '08', 2000, 1333, 'Chorizos y carne sobre la parrilla; una mano acomoda todo con la pinza.', 'f/2.8 · 1/250 · ISO 200 · 50mm', 'Pérez, Santa Fe', 2022),
      p('domingo', '09', 2000, 1594, 'Dos chicos juegan en una calle de tierra, con el polvo suspendido en la luz.', 'f/4 · 1/500 · ISO 200 · 50mm', 'Barrio Ludueña, Rosario', 2021),
    ],
  },
  {
    slug: 'editorial',
    title: 'Encargos editoriales',
    kind: 'Moda y marcas',
    treatment: 'Color',
    years: '2024',
    roll: 'Varela 200 Color',
    text: [
      'Campaña de otoño para Ulmo, una marca chica de abrigos de Rosario. Teníamos una terraza de estacionamiento, una hora de sol y un tapado rosa.',
      'Trabajé con flash directo cuando se fue la luz, como en las fotos de cumpleaños de los noventa. La marca quería algo que no pareciera de catálogo.',
      'Las mismas reglas que en mis series: poca gente en el set, mucho tiempo mirando antes de disparar.',
    ],
    cover: p('editorial', '00', 1351, 2000, 'Una modelo con tapado rosa se apoya contra una pared pintada del mismo color.', 'f/4 · 1/250 · ISO 200 · 50mm', 'Rosario, centro', 2024),
    photos: [
      p('editorial', '01', 1336, 2000, 'La modelo con tapado rosa en una terraza, con el pelo levantado por el viento.', 'f/5.6 · 1/500 · ISO 200 · 35mm', 'Rosario, centro', 2024),
      p('editorial', '02', 1336, 2000, 'La modelo, de anteojos oscuros, de pie en medio de un estacionamiento vacío al atardecer.', 'f/4 · 1/250 · ISO 200 · 35mm', 'Rosario, centro', 2024),
      p('editorial', '03', 2000, 1336, 'La modelo sentada sobre un muro de la terraza, con la ciudad detrás.', 'f/5.6 · 1/250 · ISO 200 · 28mm', 'Rosario, centro', 2024),
      p('editorial', '04', 1336, 2000, 'La modelo apoyada en una columna de hormigón, con la última luz de la tarde.', 'f/2.8 · 1/125 · ISO 400 · 50mm', 'Rosario, centro', 2024),
      p('editorial', '05', 1336, 2000, 'La modelo en cuclillas sobre el asfalto, iluminada con flash directo de noche.', 'f/8 · 1/60 · ISO 400 · 28mm · flash', 'Rosario, centro', 2024),
      p('editorial', '06', 2000, 1336, 'Retrato de la modelo frente a la ciudad al atardecer, mirando hacia un costado.', 'f/2.8 · 1/250 · ISO 200 · 85mm', 'Rosario, centro', 2024),
      p('editorial', '07', 1336, 2000, 'La modelo sentada en el borde de un muro, con los borcegos en primer plano.', 'f/5.6 · 1/250 · ISO 200 · 28mm', 'Rosario, centro', 2024),
      p('editorial', '08', 2000, 1336, 'Vista desde arriba: la modelo sentada en el piso del estacionamiento, entre líneas pintadas.', 'f/8 · 1/60 · ISO 400 · 28mm · flash', 'Rosario, centro', 2024),
    ],
  },
]

export const getSeries = (slug) => series.find((s) => s.slug === slug)

export const nextSeries = (slug) => {
  const i = series.findIndex((s) => s.slug === slug)
  return series[(i + 1) % series.length]
}
