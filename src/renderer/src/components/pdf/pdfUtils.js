// src/renderer/src/components/pdf/pdfUtils.js

export const secLabel = (v) => {
  if (v === 'si') return 'Sí'
  if (v === 'no') return 'No'
  if (v === 'parcial') return 'Parcial / Algunos'
  return v || 'No especificado'
}

export const arrStr = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr || '—')

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

export const riskColorFor = (nivel) => {
  if (nivel === 'Muy Alto' || nivel === 'muy alto') return '#b91c1c'
  if (nivel === 'Alto' || nivel === 'alto') return '#ff7b00'
  if (nivel === 'Medio' || nivel === 'medio') return '#d97706'
  if (nivel === 'En Cumplimiento' || nivel === 'en cumplimiento') return '#16a34a'
  return '#16a34a'
}

export const objetivoGeneral =
  'Evaluar y verificar políticas, controles, procedimientos y seguridad en los recursos dedicados al manejo de la información en las estaciones de trabajo; su utilización, eficiencia y seguridad de la institución, a fin de que por medio del señalamiento de cursos alternativos se logre una utilización más eficiente y segura de la información que servirá para una adecuada toma de decisiones.'

export const alcancesPredeterminados = [
  'Sistemas Operativos y Licencias: Versiones de Windows/Linux instaladas y el estado de sus actualizaciones.',
  'Formación del personal: Capacitación sobre el uso correcto de los sistemas de información.',
  'Sistemas de Información: Bases de datos de producción, el software central y las estaciones de trabajo de los usuarios.',
  'Infraestructura y Redes: Servidores, firewalls, normativas de seguridad ambiental.'
]

export const buildInventarioRows = (d3) =>
  [
    ['Total de equipos', d3.totalEquipos],
    ['Tipo de equipo', d3.tipoEquipo],
    ['Marca(s)', arrStr(d3.marcaEquipo)],
    ['Sistema operativo', d3.sistemasOperativos || arrStr(d3.soChips)],
    ['Memoria RAM', arrStr(d3.ram)],
    ['Almacenamiento', arrStr(d3.discoDuro)],
    ['Procesador', arrStr(d3.procesador)],
    ['Año de fabricación', d3.anoFabricacion],
    ['Tipo de red', arrStr(d3.tipoRed)],
    ['Monitor propio', secLabel(d3.tieneMonitor)],
    ['Estado general', d3.estadoEquipos]
  ].filter(([, v]) => v && v !== '—')

export const buildResumen = (alto, medio, muyAlto, enCumplimiento, totalAreas) => {
  const conVerbo = (n, texto) => `${n} ${n === 1 ? 'tiene' : 'tienen'} ${texto}`
  const parts = []
  if (alto > 0) parts.push(conVerbo(alto, 'violaciones de riesgo alto'))
  if (medio > 0) parts.push(conVerbo(medio, 'violaciones de riesgo medio'))
  if (muyAlto > 0) parts.push(`${muyAlto} en estado crítico`)
  const cola = parts.length ? `, ${parts.join(', ')}` : ''
  return `De ${totalAreas} áreas evaluadas, ${enCumplimiento} están en cumplimiento normativo${cola}.`
}
