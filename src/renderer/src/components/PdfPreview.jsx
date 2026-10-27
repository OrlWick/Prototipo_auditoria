/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { useAuditoriaStore, useAuthStore } from '../store/useStore'
import { ArrowLeft, Download, LayoutDashboard, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { evaluarAuditoria } from '../config/reglasAuditoria'

// ── Helpers compartidos ────────────────────────────────────────────────────
const secLabel = (v) => {
  if (v === 'si') return 'Sí'
  if (v === 'no') return 'No'
  if (v === 'parcial') return 'Parcial / Algunos'
  return v || 'No especificado'
}

const arrStr = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr || '—')

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

const riskColorFor = (nivel) => {
  if (nivel === 'muy alto') return '#b91c1c'
  if (nivel === 'alto') return '#ff7b00'
  if (nivel === 'medio') return '#d97706'
  if (nivel === 'En cumplimiento') return '#16a34a'
  return '#16a34a'
}

const objetivoGeneral =
  'Evaluar y verificar políticas, controles, procedimientos y seguridad en los recursos dedicados al manejo de la información en las estaciones de trabajo; su utilización, eficiencia y seguridad de la institución, a fin de que por medio del señalamiento de cursos alternativos se logre una utilización más eficiente y segura de la información que servirá para una adecuada toma de decisiones.'

const alcancesPredeterminados = [
  'Sistemas Operativos y Licencias: Versiones de Windows/Linux instaladas y el estado de sus actualizaciones.',
  'Formación del personal: Capacitación sobre el uso correcto de los sistemas de información.',
  'Sistemas de Información: Bases de datos de producción, el software central y las estaciones de trabajo de los usuarios.',
  'Infraestructura y Redes: Servidores, firewalls, normativas de seguridad ambiental.'
]

const buildInventarioRows = (d3) =>
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

const buildResumen = (alto, medio, muyAlto, enCumplimiento, totalAreas) => {
  const conVerbo = (n, texto) => `${n} ${n === 1 ? 'tiene' : 'tienen'} ${texto}`
  const parts = []
  if (alto > 0) parts.push(conVerbo(alto, 'violaciones de riesgo alto'))
  if (medio > 0) parts.push(conVerbo(medio, 'violaciones de riesgo medio'))
  if (muyAlto > 0) parts.push(`${muyAlto} en estado crítico`)
  const cola = parts.length ? `, ${parts.join(', ')}` : ''
  return `De ${totalAreas} áreas evaluadas, ${enCumplimiento} están en cumplimiento normativo${cola}.`
}

// ── Estilos PDF ──────────────────────────────────────────────────────────────
const pdfStyles = StyleSheet.create({
  page: {
    padding: '36px 44px',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a2e',
    backgroundColor: '#ffffff'
  },
  // Portada
  portadaDate: { alignSelf: 'flex-end', fontSize: 10, color: '#888', marginBottom: 26 },
  portadaTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1d3a6b',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 1.35
  },
  idBlock: { marginBottom: 6 },
  idRow: { flexDirection: 'row', marginBottom: 7 },
  idLabel: { fontFamily: 'Helvetica-Bold', width: 250, fontSize: 10, color: '#1d3a6b' },
  idValue: { flex: 1, fontSize: 10, color: '#333' },
  sectionTitleDark: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1d3a6b',
    marginTop: 18,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#4f8ef7'
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    backgroundColor: '#4f8ef7',
    padding: '6px 10px',
    borderRadius: 4,
    marginBottom: 10
  },
  listItem: { flexDirection: 'row', marginBottom: 7 },
  bullet: { width: 16, fontSize: 10, color: '#1d3a6b', fontFamily: 'Helvetica-Bold' },
  listText: { flex: 1, fontSize: 10, color: '#333', lineHeight: 1.5 },
  textBlock: { fontSize: 9, color: '#444', lineHeight: 1.6, marginBottom: 6 },
  // Tablas
  table: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14
  },
  tableRowHeader: { flexDirection: 'row', backgroundColor: '#1d3a6b' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  tableCell: { flex: 1, padding: '6px 8px', fontSize: 8, color: '#333', lineHeight: 1.45 },
  tableCellHeader: {
    flex: 1,
    padding: '7px 8px',
    fontSize: 8,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold'
  },
  // KPIs
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  kpiBox: { flex: 1, borderWidth: 1, borderRadius: 8, padding: '10px 6px', alignItems: 'center' },
  kpiNum: { fontSize: 22, fontFamily: 'Helvetica-Bold', lineHeight: 1.1, marginBottom: 4 },
  kpiLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  summaryBox: {
    backgroundColor: '#f0f7ff',
    padding: '10px 12px',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4f8ef7',
    marginBottom: 16
  },
  // Hallazgos
  findingBlock: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 14,
    overflow: 'hidden'
  },
  findingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: '8px 12px',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  findingEmpresa: { fontSize: 7.5, color: '#64748b', marginBottom: 2 },
  findingArea: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#1d3a6b' },
  findingRisk: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    padding: '3px 10px',
    borderRadius: 10
  },
  findingField: {
    flexDirection: 'row',
    padding: '7px 12px',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },
  findingFieldLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#1d3a6b',
    width: 82,
    paddingTop: 1
  },
  findingFieldValue: { flex: 1, fontSize: 8, color: '#333', lineHeight: 1.5 },
  // Conclusiones
  conclusionItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#4f8ef7',
    padding: '9px 12px',
    backgroundColor: '#f8fafc',
    marginBottom: 10,
    borderRadius: 4
  },
  conclusionObj: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1d3a6b',
    marginBottom: 4,
    lineHeight: 1.45
  },
  conclusionText: { fontSize: 9, color: '#333', lineHeight: 1.6 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 6
  },
  footerText: { fontSize: 8, color: '#999' }
})

// ── Pie de página ─────────────────────────────────────────────────────────
function Footer({ now }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text style={pdfStyles.footerText}>AuditTech — Informe generado el {now}</Text>
      <Text
        style={pdfStyles.footerText}
        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
      />
    </View>
  )
}

// ── Bloque de hallazgo ────────────────────────────────────────────────────
function FindingBlock({ h, org }) {
  const color = riskColorFor(h.nivel_riesgo)
  return (
    <View style={pdfStyles.findingBlock}>
      <View style={pdfStyles.findingHeader}>
        <View style={{ flex: 1 }}>
          <Text style={pdfStyles.findingEmpresa}>Empresa: {org || '—'}</Text>
          <Text style={pdfStyles.findingArea}>Área Auditada: {h.area}</Text>
        </View>
        <Text style={[pdfStyles.findingRisk, { backgroundColor: color }]}>
          Riesgo {h.nivel_riesgo?.toUpperCase()}
        </Text>
      </View>
      <View style={pdfStyles.findingField}>
        <Text style={pdfStyles.findingFieldLabel}>Problema</Text>
        <Text style={pdfStyles.findingFieldValue}>{h.problema}</Text>
      </View>
      <View style={pdfStyles.findingField}>
        <Text style={pdfStyles.findingFieldLabel}>Criterio</Text>
        <Text style={pdfStyles.findingFieldValue}>{h.criterio}</Text>
      </View>
      <View style={pdfStyles.findingField}>
        <Text style={pdfStyles.findingFieldLabel}>Efecto</Text>
        <Text style={pdfStyles.findingFieldValue}>{h.efecto}</Text>
      </View>
      <View style={pdfStyles.findingField}>
        <Text style={pdfStyles.findingFieldLabel}>Recomendación</Text>
        <Text style={pdfStyles.findingFieldValue}>{h.recomendacion}</Text>
      </View>
    </View>
  )
}

// ── Documento PDF ────────────────────────────────────────────────────────────
export function InformePDF({ datos, auditoria, auditorNombre }) {
  const d1 = datos[1] || {}
  const d2 = datos[2] || {}
  const d3 = datos[3] || {}
  const d8 = datos[8] || {}
  const objetivos = d2.objetivos || []

  const evaluacion = evaluarAuditoria(datos)
  const resultadosPorArea = evaluacion.resultadosPorArea || []
  const hallazgos = evaluacion.hallazgosGenerados || []
  const conclusionesSugeridas = evaluacion.conclusionesSugeridas || []
  const conclusionesFinal =
    Array.isArray(d8.conclusiones) && d8.conclusiones.some((c) => c && c.trim())
      ? d8.conclusiones
      : conclusionesSugeridas

  const muyAlto = hallazgos.filter((h) => h.nivel_riesgo === 'muy alto').length
  const alto = hallazgos.filter((h) => h.nivel_riesgo === 'alto').length
  const medio = hallazgos.filter((h) => h.nivel_riesgo === 'medio').length
  const enCumplimiento = resultadosPorArea.filter((a) => a.conforme).length
  const totalAreas = resultadosPorArea.length

  const invRows = buildInventarioRows(d3)
  const now = format(new Date(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
  const fechaInicio = auditoria?.fecha_inicio
    ? format(new Date(auditoria.fecha_inicio), "d 'de' MMMM 'del' yyyy", { locale: es })
    : d1.fechaProgramada
      ? format(new Date(d1.fechaProgramada), "d 'de' MMMM 'del' yyyy", { locale: es })
      : 'No disponible'
  const fechaPresentacion = capitalize(
    format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  )
  const organizacion = d1.organizacion || auditoria?.organizacion || '—'

  const findingPages = []
  for (let i = 0; i < hallazgos.length; i += 2) {
    findingPages.push(hallazgos.slice(i, i + 2))
  }

  return (
    <Document title={`Informe Auditoría - ${organizacion}`} author={auditorNombre}>
      {/* ═══ PÁGINA 1: PORTADA ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.portadaDate}>{fechaPresentacion}</Text>
        <Text style={pdfStyles.portadaTitle}>INFORME FINAL AUDITORÍA INFORMÁTICA</Text>

        <View style={pdfStyles.idBlock}>
          <View style={pdfStyles.idRow}>
            <Text style={pdfStyles.idLabel}>1. Identificación del Cliente:</Text>
            <Text style={pdfStyles.idValue}>{organizacion}</Text>
          </View>
          <View style={pdfStyles.idRow}>
            <Text style={pdfStyles.idLabel}>2. Identificación del Área auditada:</Text>
            <Text style={pdfStyles.idValue}>{d1.area || '—'}</Text>
          </View>
          <View style={pdfStyles.idRow}>
            <Text style={pdfStyles.idLabel}>3. Fecha de Iniciación:</Text>
            <Text style={pdfStyles.idValue}>{fechaInicio}</Text>
          </View>
          <View style={pdfStyles.idRow}>
            <Text style={pdfStyles.idLabel}>4. Fecha de Presentación del Informe:</Text>
            <Text style={pdfStyles.idValue}>{fechaPresentacion}</Text>
          </View>
          <View style={pdfStyles.idRow}>
            <Text style={pdfStyles.idLabel}>5. Jefe Auditor:</Text>
            <Text style={pdfStyles.idValue}>{d1.auditor || auditorNombre}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitleDark}>OBJETIVOS</Text>
        <Text style={pdfStyles.listText}>General</Text>
        <Text style={[pdfStyles.textBlock, { marginLeft: 16 }]}>{objetivoGeneral}</Text>
        <Text style={[pdfStyles.listText, { marginTop: 8 }]}>Específicos</Text>
        {objetivos.map((obj, i) => (
          <View key={i} style={[pdfStyles.listItem, { marginLeft: 16 }]}>
            <Text style={pdfStyles.bullet}>{i + 1}.</Text>
            <Text style={pdfStyles.listText}>{obj}</Text>
          </View>
        ))}

        <Text style={pdfStyles.sectionTitleDark}>ALCANCES</Text>
        {alcancesPredeterminados.map((a, i) => (
          <View key={i} style={pdfStyles.listItem}>
            <Text style={pdfStyles.bullet}>{i + 1}.</Text>
            <Text style={pdfStyles.listText}>{a}</Text>
          </View>
        ))}

        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINA 2: MAPA DE ACTIVIDADES ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.portadaTitle}></Text>
        <Text style={pdfStyles.sectionTitle}>MAPA DE ACTIVIDADES</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRowHeader}>
            <Text style={[pdfStyles.tableCellHeader, { width: '24%' }]}>
              Actividad / Área Evaluada
            </Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '17%' }]}>
              Estado de Cumplimiento
            </Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '16%' }]}>Nivel de Riesgo</Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '43%' }]}>Resultado general</Text>
          </View>
          {resultadosPorArea.map((a, i) => (
            <View
              key={a.id}
              style={[
                pdfStyles.tableRow,
                i === resultadosPorArea.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={[pdfStyles.tableCell, { width: '24%', fontFamily: 'Helvetica-Bold' }]}>
                {a.nombre}
              </Text>
              <Text
                style={[
                  pdfStyles.tableCell,
                  {
                    width: '17%',
                    color: a.conforme ? '#16a34a' : '#dc2626',
                    fontFamily: 'Helvetica-Bold'
                  }
                ]}
              >
                {a.conforme ? 'Conforme' : 'No conforme'}
              </Text>
              <Text
                style={[
                  pdfStyles.tableCell,
                  { width: '16%', color: riskColorFor(a.riesgo), fontFamily: 'Helvetica-Bold' }
                ]}
              >
                {a.riesgo}
              </Text>
              <Text style={[pdfStyles.tableCell, { width: '43%' }]}>{a.resultadoGeneral}</Text>
            </View>
          ))}
        </View>
        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINA 3: MÉTRICAS ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>MÉTRICAS</Text>
        <View style={pdfStyles.kpiRow}>
          {[
            { label: 'Riesgos Muy altos', n: muyAlto, color: '#b91c1c', bg: '#fef2f2' },
            { label: 'Riesgos Altos', n: alto, color: '#ff7b00', bg: '#fff7ed' },
            { label: 'Riesgos Medios', n: medio, color: '#d97706', bg: '#fffbeb' },
            { label: 'En cumplimiento', n: enCumplimiento, color: '#16a34a', bg: '#f0fdf4' }
          ].map((k, i) => (
            <View
              key={i}
              style={[pdfStyles.kpiBox, { borderColor: k.color, backgroundColor: k.bg }]}
            >
              <Text style={[pdfStyles.kpiNum, { color: k.color }]}>{k.n}</Text>
              <Text style={[pdfStyles.kpiLabel, { color: k.color }]}>{k.label}</Text>
            </View>
          ))}
        </View>
        <View style={pdfStyles.summaryBox}>
          <Text style={pdfStyles.textBlock}>
            {buildResumen(alto, medio, muyAlto, enCumplimiento, totalAreas)}
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>INVENTARIO DE EQUIPO EN USO</Text>
        {invRows.length > 0 ? (
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableRowHeader}>
              <Text style={[pdfStyles.tableCellHeader, { width: '40%' }]}>Descripción</Text>
              <Text style={[pdfStyles.tableCellHeader, { width: '60%' }]}>Valor</Text>
            </View>
            {invRows.map(([k, v], i) => (
              <View
                key={i}
                style={[pdfStyles.tableRow, i === invRows.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={[pdfStyles.tableCell, { width: '40%', fontFamily: 'Helvetica-Bold' }]}>
                  {k}
                </Text>
                <Text style={[pdfStyles.tableCell, { width: '60%' }]}>{v}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={pdfStyles.textBlock}>No se registró inventario de equipos.</Text>
        )}

        <Text style={pdfStyles.sectionTitleDark}>HALLAZGOS ENCONTRADOS</Text>
        <Text style={pdfStyles.textBlock}>
          {hallazgos.length > 0
            ? `Se identificaron ${hallazgos.length} hallazgo(s) de seguridad en las áreas evaluadas. A continuación se detallan el problema, criterio, efecto y recomendación de cada uno.`
            : 'No se detectaron hallazgos de seguridad en las áreas evaluadas.'}
        </Text>
        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINAS: HALLAZGOS ═══ */}
      {findingPages.length > 0 ? (
        findingPages.map((group, pi) => (
          <Page key={pi} size="A4" style={pdfStyles.page}>
            <Text style={pdfStyles.sectionTitle}>HALLAZGOS ENCONTRADOS</Text>
            {group.map((h, i) => (
              <FindingBlock key={i} h={h} org={organizacion} />
            ))}
            <Footer now={now} />
          </Page>
        ))
      ) : (
        <Page size="A4" style={pdfStyles.page}>
          <Text style={pdfStyles.sectionTitle}>HALLAZGOS ENCONTRADOS</Text>
          <Text style={pdfStyles.textBlock}>
            No se detectaron hallazgos de seguridad en esta auditoría.
          </Text>
          <Footer now={now} />
        </Page>
      )}

      {/* ═══ PÁGINA: CONCLUSIONES ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>CONCLUSIONES</Text>
        {objetivos.length > 0 ? (
          objetivos.map((obj, i) => (
            <View key={i} style={pdfStyles.conclusionItem}>
              <Text style={pdfStyles.conclusionObj}>
                {i + 1}. {obj}
              </Text>
              <Text style={pdfStyles.conclusionText}>
                Conclusión: {conclusionesFinal[i] || 'Conclusión no registrada.'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={pdfStyles.textBlock}>No se definieron objetivos en la auditoría.</Text>
        )}

        {d8.recomendaciones && (
          <>
            <Text style={pdfStyles.sectionTitle}>RECOMENDACIONES GENERALES</Text>
            <Text style={pdfStyles.textBlock}>{d8.recomendaciones}</Text>
          </>
        )}

        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 16 }} />
        <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>
          Este informe fue generado automáticamente por AuditTech • {now}
        </Text>
        <Footer now={now} />
      </Page>
    </Document>
  )
}

// ── Vista previa UI ──────────────────────────────────────────────────────────
export default function PdfPreview({
  onVolver,
  onBackToDashboard,
  auditoriaId,
  esSoloLectura = false
}) {
  const { datosWizard, auditoriaActual, cargarDesdeDB } = useAuditoriaStore()
  const { user } = useAuthStore()
  const [cargando, setCargando] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (esSoloLectura && auditoriaId) {
      setCargando(true)
      cargarDesdeDB(auditoriaId).finally(() => setCargando(false))
    }
  }, [auditoriaId, esSoloLectura])

  if (esSoloLectura && cargando) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>Cargando informe...</div>
      </div>
    )
  }

  if (esSoloLectura && !cargando && !auditoriaActual) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          gap: 16
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>No se encontró la auditoría</div>
        <button className="btn-primary" onClick={onBackToDashboard}>
          Volver al Dashboard
        </button>
      </div>
    )
  }

  if (!datosWizard || Object.keys(datosWizard).length === 0) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          gap: 16
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>
          No hay datos de auditoría para mostrar
        </div>
        <button className="btn-primary" onClick={onBackToDashboard}>
          Volver al Dashboard
        </button>
      </div>
    )
  }

  const d1 = datosWizard[1] || {}
  const d2 = datosWizard[2] || {}
  const d3 = datosWizard[3] || {}
  const d8 = datosWizard[8] || {}

  const objetivos = d2.objetivos || []
  const evaluacion = evaluarAuditoria(datosWizard)
  const resultados = evaluacion.resultadosPorArea || []
  const hallazgos = evaluacion.hallazgosGenerados || []
  const conclusionesSugeridas = evaluacion.conclusionesSugeridas || []
  const conclusionesFinal =
    Array.isArray(d8.conclusiones) && d8.conclusiones.some((c) => c && c.trim())
      ? d8.conclusiones
      : conclusionesSugeridas

  const muyAlto = hallazgos.filter((h) => h.nivel_riesgo === 'muy alto').length
  const alto = hallazgos.filter((h) => h.nivel_riesgo === 'alto').length
  const medio = hallazgos.filter((h) => h.nivel_riesgo === 'medio').length
  const enCumplimiento = resultados.filter((a) => a.conforme).length
  const totalAreas = resultados.length

  const invRows = buildInventarioRows(d3)
  const nivelGlobal =
    muyAlto > 0 ? 'Crítico' : alto > 0 ? 'Alto' : medio > 0 ? 'Medio' : 'Alto cumplimiento'
  const fechaPresentacion = capitalize(
    format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  )
  const fechaInicio = auditoriaActual?.fecha_inicio
    ? format(new Date(auditoriaActual.fecha_inicio), "d 'de' MMMM 'del' yyyy", { locale: es })
    : d1.fechaProgramada
      ? format(new Date(d1.fechaProgramada), "d 'de' MMMM 'del' yyyy", { locale: es })
      : 'No disponible'
  const organizacion = d1.organizacion || auditoriaActual?.organizacion || '—'

  const pdfDoc = (
    <InformePDF datos={datosWizard} auditoria={auditoriaActual} auditorNombre={user?.nombre} />
  )

  const fileName = `informe-${(auditoriaActual?.titulo || 'auditoria').toLowerCase().replace(/\s+/g, '-')}.pdf`

  const handleDownloadNative = async () => {
    try {
      setDownloading(true)
      const blob = await pdf(pdfDoc).toBlob()
      const arrayBuffer = await blob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const savedPath = await window.api.guardarPdfNativo(fileName, Array.from(uint8Array))
      if (savedPath) {
        // Success - could show a toast here
      }
    } catch (error) {
      console.error('Error al guardar el PDF:', error)
      alert('Hubo un error al generar y guardar el reporte PDF.')
    } finally {
      setDownloading(false)
    }
  }

  const kpiCards = [
    { label: 'Muy Altos', n: muyAlto, color: '#b91c1c', bg: '#fef2f2' },
    { label: 'Altos', n: alto, color: '#ff7b00', bg: '#fff7ed' },
    { label: 'Medios', n: medio, color: '#d97706', bg: '#fffbeb' },
    { label: 'En cumplimiento', n: enCumplimiento, color: '#16a34a', bg: '#f0fdf4' }
  ]

  const cardStyle = {
    padding: 24,
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb'
  }
  const cardTitleStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: '#1d3a6b',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: '2px solid #4f8ef7'
  }
  const tdStyle = { padding: '9px 12px', verticalAlign: 'top', fontSize: 13, lineHeight: 1.5 }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        {!esSoloLectura && (
          <>
            <button
              onClick={onVolver}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 13
              }}
            >
              <ArrowLeft size={15} /> Editar
            </button>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          </>
        )}
        <FileText size={16} color="var(--accent)" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            {esSoloLectura ? 'Informe de Auditoría' : 'Vista Previa del Informe'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {auditoriaActual?.titulo || 'Auditoría TI'}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button
          className="btn-primary"
          onClick={handleDownloadNative}
          disabled={downloading}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Download size={15} />
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </button>
        <button
          className="btn-secondary"
          onClick={onBackToDashboard}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <LayoutDashboard size={15} /> Dashboard
        </button>
      </div>

      {/* Contenido del informe */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            maxWidth: 980,
            margin: '0 auto',
            padding: '28px 24px 48px',
            display: 'grid',
            gap: 18
          }}
        >
          {/* Identificación */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={cardStyle}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                marginBottom: 20
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#1d3a6b',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  Informe Final Auditoría Informática
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#000', marginTop: 6 }}>
                  {auditoriaActual?.titulo || 'Auditoría TI'}
                </div>
                <div style={{ marginTop: 6, fontSize: 14, color: '#000' }}>
                  {organizacion} · {d1.area || 'Área no registrada'}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 600,
                  textAlign: 'right',
                  whiteSpace: 'nowrap'
                }}
              >
                {fechaPresentacion}
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                fontSize: 13,
                color: '#000',
                lineHeight: 1.7
              }}
            >
              <div>
                <strong>1. Cliente:</strong> {organizacion}
              </div>
              <div>
                <strong>2. Área auditada:</strong> {d1.area || '—'}
              </div>
              <div>
                <strong>3. Fecha de iniciación:</strong> {fechaInicio}
              </div>
              <div>
                <strong>4. Fecha de presentación:</strong> {fechaPresentacion}
              </div>
              <div>
                <strong>5. Jefe Auditor:</strong> {d1.auditor || user?.nombre || '—'}
              </div>
              <div>
                <strong>Nivel global:</strong>{' '}
                <span style={{ color: '#b91c1c', fontWeight: 700 }}>{nivelGlobal}</span>
              </div>
            </div>
          </motion.div>

          {/* Objetivos y alcances */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            style={cardStyle}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
              <div>
                <div style={cardTitleStyle}>Objetivos</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 6 }}>
                  General
                </div>
                <div style={{ fontSize: 13, color: '#000', lineHeight: 1.7, marginBottom: 14 }}>
                  {objetivoGeneral}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 6 }}>
                  Específicos
                </div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: '#000',
                    lineHeight: 1.8,
                    fontSize: 13
                  }}
                >
                  {objetivos.length > 0 ? (
                    objetivos.map((obj, i) => <li key={i}>{obj}</li>)
                  ) : (
                    <li>No se definieron objetivos.</li>
                  )}
                </ol>
              </div>
              <div>
                <div style={cardTitleStyle}>Alcances</div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: '#000',
                    lineHeight: 1.8,
                    fontSize: 13
                  }}
                >
                  {alcancesPredeterminados.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Mapa de actividades */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            style={{ ...cardStyle, overflow: 'auto' }}
          >
            <div style={cardTitleStyle}>Mapa de actividades</div>
            <table
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}
            >
              <thead>
                <tr>
                  {['Actividad / Área Evaluada', 'Estado', 'Riesgo', 'Resultado general'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          background: '#1d3a6b',
                          color: '#fff',
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: 12
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {resultados.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{a.nombre}</td>
                    <td style={tdStyle}>
                      <span style={{ color: a.conforme ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                        {a.conforme ? 'Conforme' : 'No conforme'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: riskColorFor(a.riesgo), fontWeight: 700 }}>
                        {a.riesgo}
                      </span>
                    </td>
                    <td style={tdStyle}>{a.resultadoGeneral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Métricas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            style={cardStyle}
          >
            <div style={cardTitleStyle}>Métricas</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                marginBottom: 18
              }}
            >
              {kpiCards.map((k) => (
                <div
                  key={k.label}
                  style={{
                    background: k.bg,
                    border: `1px solid ${k.color}33`,
                    borderRadius: 14,
                    padding: '16px 10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1 }}>
                    {k.n}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: k.color,
                      marginTop: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {k.label}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: '#f0f7ff',
                borderLeft: '4px solid #4f8ef7',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 13,
                color: '#000',
                lineHeight: 1.7,
                marginBottom: 20
              }}
            >
              {buildResumen(alto, medio, muyAlto, enCumplimiento, totalAreas)}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#1d3a6b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10
              }}
            >
              Inventario de equipo en uso
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      background: '#1d3a6b',
                      color: '#fff',
                      padding: '9px 12px',
                      textAlign: 'left',
                      fontSize: 12,
                      width: '40%'
                    }}
                  >
                    Descripción
                  </th>
                  <th
                    style={{
                      background: '#1d3a6b',
                      color: '#fff',
                      padding: '9px 12px',
                      textAlign: 'left',
                      fontSize: 12
                    }}
                  >
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {invRows.length > 0 ? (
                  invRows.map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{k}</td>
                      <td style={tdStyle}>{v}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={tdStyle} colSpan={2}>
                      No se registró inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Hallazgos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            style={cardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={cardTitleStyle}>Hallazgos encontrados</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1d3a6b' }}>
                {hallazgos.length}
              </div>
            </div>
            {hallazgos.length > 0 ? (
              hallazgos.map((h, i) => {
                const color = riskColorFor(h.nivel_riesgo)
                return (
                  <div
                    key={i}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      marginBottom: 14,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f1f5f9',
                        padding: '10px 16px',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          Empresa: {organizacion}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1d3a6b' }}>
                          Área Auditada: {h.area}
                        </div>
                      </div>
                      <span
                        style={{
                          background: color,
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: 999
                        }}
                      >
                        Riesgo {h.nivel_riesgo?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ padding: '12px 16px', display: 'grid', gap: 10 }}>
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#1d3a6b',
                            display: 'block',
                            fontSize: 12,
                            marginBottom: 3
                          }}
                        >
                          Problema
                        </span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>
                          {h.problema}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#1d3a6b',
                            display: 'block',
                            fontSize: 12,
                            marginBottom: 3
                          }}
                        >
                          Criterio
                        </span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>
                          {h.criterio}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#1d3a6b',
                            display: 'block',
                            fontSize: 12,
                            marginBottom: 3
                          }}
                        >
                          Efecto
                        </span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>
                          {h.efecto}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#1d3a6b',
                            display: 'block',
                            fontSize: 12,
                            marginBottom: 3
                          }}
                        >
                          Recomendación
                        </span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>
                          {h.recomendacion}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ fontSize: 13, color: '#000' }}>
                No se detectaron hallazgos de seguridad en esta auditoría.
              </div>
            )}
          </motion.div>

          {/* Conclusiones y recomendaciones */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            style={cardStyle}
          >
            <div style={cardTitleStyle}>Conclusiones</div>
            {objetivos.length > 0 ? (
              objetivos.map((obj, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: '3px solid #4f8ef7',
                    background: '#f8fafc',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 12
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#1d3a6b', fontSize: 13, marginBottom: 4 }}>
                    {i + 1}. {obj}
                  </div>
                  <div style={{ fontSize: 13, color: '#000', lineHeight: 1.7 }}>
                    <strong>Conclusión:</strong>{' '}
                    {conclusionesFinal[i] || 'Conclusión no registrada.'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: '#000' }}>No se definieron objetivos.</div>
            )}

            {d8.recomendaciones && (
              <>
                <div style={{ ...cardTitleStyle, marginTop: 22 }}>Recomendaciones generales</div>
                <div style={{ fontSize: 13, color: '#000', lineHeight: 1.8 }}>
                  {d8.recomendaciones}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
