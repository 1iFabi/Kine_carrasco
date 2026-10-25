export const DOCTORALIA_URL = 'https://www.doctoralia.cl/perfil/jose-antonio-carrasco-gomez'
// shortcut: WhatsApp number not provided yet, replace [NÚMERO] before launch
export const WHATSAPP_URL = '#whatsapp'

export const NAV_LINKS = [
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#opiniones', label: 'Opiniones' },
  { href: '#atencion', label: 'Dónde atiendo' },

]

// From his Doctoralia profile. Prices only where Doctoralia lists one.
export const SPECIALTIES = [
  {
    group: 'Rehabilitación',
    note: 'En consulta o a domicilio',
    items: [
      { name: 'Traumatología', zones: ['hombro', 'espalda', 'rodilla'], detail: 'Desgarros, tendinitis, bursitis, lumbago, ciática y escoliosis.', value: 'Adultos y niños' },
      { name: 'Rehabilitación deportiva', zones: ['rodilla'], detail: 'Vuelta al deporte después de una lesión.', value: 'Reintegro' },
      { name: 'Kinesiología respiratoria', zones: ['pecho'], detail: 'Ejercicios respiratorios y terapia para el pecho.', value: 'Desde guaguas' },
      { name: 'Neurorrehabilitación', zones: ['cabeza'], detail: 'Recuperar movimiento después de un ACV u otra lesión neurológica.', value: 'Adultos' },
      { name: 'Terapia manual y electroterapia', zones: ['hombro', 'espalda'], detail: 'Con las manos y con equipos, según lo que necesites.', value: 'Consultar' },
      { name: 'Gimnasia médica', zones: ['espalda', 'rodilla'], detail: 'Ejercicio guiado para fortalecer y prevenir.', value: 'Consultar' },
    ],
  },
  {
    group: 'Estética',
    note: 'Sin cirugía',
    items: [{ name: 'Criolipólisis', zones: ['cintura'], detail: 'Reducción de grasa localizada, sin cirugía.', value: 'Desde $45.000' }],
  },
]

// José's own Google Maps pin for the clinic (Consultorio y Laboratorio Médico San Lúcas)
export const DIRECTIONS_URL = 'https://maps.app.goo.gl/7H8UGtBENNxBVffZ7'

// The clinic, from the Google Maps pin.
export const MAP_POINTS = {
  rancagua: { longitude: -70.7420217, latitude: -34.1654847 },
}

export const PLACES = [
  { name: 'Consulta en Rancagua', lines: ["Av. Libertador Bernardo O'Higgins 560", 'Centro de Salud San Lucas, Box D'] },
  { name: 'A domicilio · $35.000', lines: ['Voy a tu casa en Rancagua y Machalí.'] },
]

// Real Doctoralia reviews, verbatim, used with José's approval. "…" marks text cut by Doctoralia's preview.
export const REVIEWS = [
  { quote: 'Muy buen especialista, explica todo detalladamente aparte que mejoró a mi hijo con su tratamiento full recomendado', author: 'Daniela F.', date: 'sep 2026' },
  { quote: 'Me gustó mucho, atendió a mi hija de 3 años y tuvo mucha paciencia. Muy eficiente, mi hija ya está mucho mejor', author: 'Damaris M.', date: 'sep 2026' },
  { quote: 'Muy buen profesional, atento y explica todo lo que va aplicar, trato a mi hijo de 1 año y 8 meses, un seco!', author: 'Diego Y.', date: 'ago 2026' },
  { quote: 'Me habían dado buenas referencias de él y están en lo cierto. Muy buen kine, atiende a mi bebé de 1 año (tema respiratorio)…', author: 'María Paz D.', date: 'sep 2026' },
  { quote: '100 % recomendado. Profesional en todo sentido. Cordialidad . Enfocado personal en todo momento con el paciente.', author: 'Antonio', date: 'sep 2026' },
  { quote: 'Les recomiendo atenderse con el kinesiologo José Carrasco. Me ha ayudado con mi diagnóstico y he mejorado muchísimo,…', author: 'Marisol F.', date: 'sep 2026' },
  { quote: 'Excelente kinesiólogo, muy profesional en su trabajo. Además, es una persona muy amable y sabe cómo tratar a sus pacientes…', author: 'Nela', date: 'sep 2026' },
  { quote: 'Excelente atención y puntualidad las explicaciones muy detallada', author: 'Daniela N.', date: 'ago 2026' },
  { quote: 'Muy buen trabajo, dedicación y muy buen trato. Muy profesional', author: 'M. M. M.', date: 'oct 2026' },
]
