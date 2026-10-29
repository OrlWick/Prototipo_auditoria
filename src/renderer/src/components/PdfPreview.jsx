import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { pdf } from '@react-pdf/renderer'
import { useAuditoriaStore, useAuthStore } from '../store/useStore'
import { ArrowLeft, Download, LayoutDashboard, FileText, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { evaluarAuditoria } from '../config/reglasAuditoria'
import { InformePDF } from './pdf/InformePdf'
import { capitalize, riskColorFor, buildInventarioRows, buildResumen, arrStr } from './pdf/pdfUtils'

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

  // Carga de datos si es modo solo lectura
  useEffect(() => {
    if (esSoloLectura && auditoriaId) {
      setCargando(true)
      cargarDesdeDB(auditoriaId).finally(() => setCargando(false))
    }
  }, [auditoriaId, esSoloLectura, cargarDesdeDB])

  if (esSoloLectura && cargando) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>Cargando informe...</div>
      </div>
    )
  }

  if (esSoloLectura && !cargando && !auditoriaActual) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: 16 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>No se encontró la auditoría</div>
        <button className="btn-primary" onClick={onBackToDashboard}>Volver al Dashboard</button>
      </div>
    )
  }

  if (!datosWizard || Object.keys(datosWizard).length === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: 16 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>No hay datos de auditoría para mostrar</div>
        <button className="btn-primary" onClick={onBackToDashboard}>Volver al Dashboard</button>
      </div>
    )
  }

  // Extracción y evaluación de datos
  const d1 = datosWizard[1] || {}
  const d2 = datosWizard[2] || {}
  const d3 = datosWizard[3] || {}
  const d8 = datosWizard[8] || {}

  const objetivos = d2.objetivos || []
  const evaluacion = evaluarAuditoria(datosWizard)
  const resultados = evaluacion.resultadosPorArea || []
  const hallazgos = evaluacion.hallazgosGenerados || []
  const conclusionesSugeridas = evaluacion.conclusionesSugeridas || []
  const conclusionesFinal = Array.isArray(d8.conclusiones) && d8.conclusiones.some((c) => c && c.trim()) ? d8.conclusiones : conclusionesSugeridas

  const muyAlto = hallazgos.filter((h) => h.nivel_riesgo?.toLowerCase() === 'muy alto').length
  const alto = hallazgos.filter((h) => h.nivel_riesgo?.toLowerCase() === 'alto').length
  const medio = hallazgos.filter((h) => h.nivel_riesgo?.toLowerCase() === 'medio').length
  const enCumplimiento = resultados.filter((a) => a.conforme).length
  const totalAreas = resultados.length

  const invRows = buildInventarioRows(d3)
  const nivelGlobal = muyAlto > 0 ? 'Crítico' : alto > 0 ? 'Alto' : medio > 0 ? 'Medio' : 'Alto cumplimiento'
  
  const fechaPresentacion = capitalize(format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }))
  const fechaInicio = auditoriaActual?.fecha_inicio 
    ? format(new Date(auditoriaActual.fecha_inicio), "d 'de' MMMM 'del' yyyy", { locale: es }) 
    : d1.fechaProgramada ? format(new Date(d1.fechaProgramada), "d 'de' MMMM 'del' yyyy", { locale: es }) : 'No disponible'
  const organizacion = d1.organizacion || auditoriaActual?.organizacion || '—'

  // Componente React-PDF referenciado
  const pdfDoc = <InformePDF datos={datosWizard} auditoria={auditoriaActual} auditorNombre={user?.nombre} />
  const fileName = `informe-${(auditoriaActual?.titulo || 'auditoria').toLowerCase().replace(/\s+/g, '-')}.pdf`

  // ── MANEJADORES DE EXPORTACIÓN ─────────────────────────────────────────────
  const handleDownloadNative = async () => {
    try {
      setDownloading(true)
      const blob = await pdf(pdfDoc).toBlob()
      const arrayBuffer = await blob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      await window.api.guardarPdfNativo(fileName, Array.from(uint8Array))
    } catch (error) {
      console.error('Error al guardar el PDF:', error)
      alert('Hubo un error al generar y guardar el reporte PDF.')
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadWord = async () => {
    try {
      setDownloading(true)
      
      const objetivosFormateados = objetivos.map((obj, i) => ({
        numero: i + 1,
        texto: obj,
        conclusion: conclusionesFinal[i] || 'Sin conclusión registrada.'
      }))

      const datosParaWord = {
        titulo: auditoriaActual?.titulo || 'Informe de Auditoría TI',
        fecha: fechaPresentacion,
        fechaInicio: fechaInicio, 
        organizacion: organizacion,
        area: d1.area || 'No especificada',
        auditor: d1.auditor || user?.nombre || 'No especificado',
        nivelGlobal: nivelGlobal,
        totalEquipos: d3.totalEquipos || '0',
        tipoEquipos: d3.tipoEquipo || 'No especificado',
        so: d3.sistemasOperativos || arrStr(d3.soChips) || 'No especificado',
        ram: arrStr(d3.ram) || 'No especificado',
        disco: arrStr(d3.discoDuro) || 'No especificado',
        procesador: arrStr(d3.procesador) || 'No especificado',
        anoFabricacion: d3.anoFabricacion || 'No especificado',
        tipoRed: arrStr(d3.tipoRed) || 'No especificado',
        recomendacionesGenerales: d8.recomendaciones || '',
        objetivos: objetivosFormateados,
        resultadosPorArea: resultados.map(r => ({
           nombre: r.nombre,
           estado: r.conforme ? 'Conforme' : 'No conforme',
           riesgo: r.riesgo,
           resultadoGeneral: r.resultadoGeneral
        })),
        muyAlto, alto, medio, enCumplimiento, totalAreas,
        resumenRiesgos: `${alto} tienen violaciones de riesgo alto y ${muyAlto} están en estado crítico`,
        hallazgos: hallazgos.map(h => ({ ...h, organizacion: organizacion }))
      }

      const result = await window.api.generarWordEditable(datosParaWord)
      
      if (result?.success) {
        alert(`Documento Word guardado exitosamente en:\n${result.path}`)
        if (onBackToDashboard) onBackToDashboard()
      } else if (!result?.cancelado) {
        alert(`Error al generar Word: ${result?.error}`)
      }
    } catch (error) {
      console.error('Error al generar Word:', error)
      alert('Hubo un error al comunicarse con el sistema de archivos.')
    } finally {
      setDownloading(false)
    }
  }

  // ── ESTILOS DE UI ESTÁTICOS ────────────────────────────────────────────────
  const kpiCards = [
    { label: 'Muy Altos', n: muyAlto, color: '#b91c1c', bg: '#fef2f2' },
    { label: 'Altos', n: alto, color: '#ff7b00', bg: '#fff7ed' },
    { label: 'Medios', n: medio, color: '#d97706', bg: '#fffbeb' },
    { label: 'En cumplimiento', n: enCumplimiento, color: '#16a34a', bg: '#f0fdf4' }
  ]

  const cardStyle = { padding: 24, borderRadius: 20, background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }
  const cardTitleStyle = { fontSize: 13, fontWeight: 700, color: '#1d3a6b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, paddingBottom: 8, borderBottom: '2px solid #4f8ef7' }
  const tdStyle = { padding: '9px 12px', verticalAlign: 'top', fontSize: 13, lineHeight: 1.5 }

  // ── RENDERIZADO ────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Toolbar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {!esSoloLectura && (
          <>
            <button onClick={onVolver} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>
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

        {/* Botones de Exportación */}
        <button className="btn-secondary" onClick={handleDownloadWord} disabled={downloading} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
          <FileText size={15} />
          {downloading ? 'Generando...' : 'Descargar en Word'}
        </button>
        
        <button className="btn-primary" onClick={handleDownloadNative} disabled={downloading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={15} />
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </button>
        
        <button className="btn-secondary" onClick={onBackToDashboard} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LayoutDashboard size={15} /> Dashboard
        </button>
      </div>

      {/* Contenido HTML de la Vista Previa (Idéntico a tu original) */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ maxWidth: 980, margin: '0 auto', padding: '28px 24px 48px', display: 'grid', gap: 18 }}>
          
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#1d3a6b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Informe Final Auditoría Informática</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#000', marginTop: 6 }}>{auditoriaActual?.titulo || 'Auditoría TI'}</div>
                <div style={{ marginTop: 6, fontSize: 14, color: '#000' }}>{organizacion} · {d1.area || 'Área no registrada'}</div>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>{fechaPresentacion}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, color: '#000', lineHeight: 1.7 }}>
              <div><strong>1. Cliente: </strong> {organizacion}</div>
              <div><strong>2. Área auditada:</strong> {d1.area || '—'}</div>
              <div><strong>3. Fecha de iniciación:</strong> {fechaInicio}</div>
              <div><strong>4. Fecha de presentación:</strong> {fechaPresentacion}</div>
              <div><strong>5. Jefe Auditor:</strong> {d1.auditor || user?.nombre || '—'}</div>
              <div><strong>Nivel global:</strong> <span style={{ color: '#b91c1c', fontWeight: 700 }}>{nivelGlobal}</span></div>
            </div>
          </motion.div>

          {/* ... resto del JSX se mantiene igual, no es necesario cambiar la lógica visual */}
          {/* Mapa de actividades */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} style={{ ...cardStyle, overflow: 'auto' }}>
            <div style={cardTitleStyle}>Mapa de actividades</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
              <thead>
                <tr>
                  {['Actividad / Área Evaluada', 'Estado', 'Riesgo', 'Resultado general'].map((h) => (
                    <th key={h} style={{ background: '#1d3a6b', color: '#fff', padding: '10px 12px', textAlign: 'left', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultados.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{a.nombre}</td>
                    <td style={tdStyle}><span style={{ color: a.conforme ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{a.conforme ? 'Conforme' : 'No conforme'}</span></td>
                    <td style={tdStyle}><span style={{ color: riskColorFor(a.riesgo), fontWeight: 700 }}>{a.riesgo}</span></td>
                    <td style={tdStyle}>{a.resultadoGeneral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Métricas */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} style={cardStyle}>
            <div style={cardTitleStyle}>Métricas</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
              {kpiCards.map((k) => (
                <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}33`, borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.n}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: k.color, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#f0f7ff', borderLeft: '4px solid #4f8ef7', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#000', lineHeight: 1.7, marginBottom: 20 }}>
              {buildResumen(alto, medio, muyAlto, enCumplimiento, totalAreas)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1d3a6b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Inventario de equipo en uso</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ background: '#1d3a6b', color: '#fff', padding: '9px 12px', textAlign: 'left', fontSize: 12, width: '40%' }}>Descripción</th>
                  <th style={{ background: '#1d3a6b', color: '#fff', padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Valor</th>
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
                  <tr><td style={tdStyle} colSpan={2}>No se registró inventario.</td></tr>
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Hallazgos */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={cardTitleStyle}>Hallazgos encontrados</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1d3a6b' }}>{hallazgos.length}</div>
            </div>
            {hallazgos.length > 0 ? (
              hallazgos.map((h, i) => {
                const color = riskColorFor(h.nivel_riesgo)
                return (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 14, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Empresa: {organizacion}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1d3a6b' }}>Área Auditada: {h.area}</div>
                      </div>
                      <span style={{ background: color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
                        Riesgo {h.nivel_riesgo?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ padding: '12px 16px', display: 'grid', gap: 10 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#1d3a6b', display: 'block', fontSize: 12, marginBottom: 3 }}>Problema</span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>{h.problema}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, color: '#1d3a6b', display: 'block', fontSize: 12, marginBottom: 3 }}>Criterio</span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>{h.criterio}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, color: '#1d3a6b', display: 'block', fontSize: 12, marginBottom: 3 }}>Efecto</span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>{h.efecto}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, color: '#1d3a6b', display: 'block', fontSize: 12, marginBottom: 3 }}>Recomendación</span>
                        <span style={{ fontSize: 13, color: '#000', lineHeight: 1.6 }}>{h.recomendacion}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ fontSize: 13, color: '#000' }}>No se detectaron hallazgos de seguridad en esta auditoría.</div>
            )}
          </motion.div>

          {/* Conclusiones */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }} style={cardStyle}>
            <div style={cardTitleStyle}>Conclusiones</div>
            {objetivos.length > 0 ? (
              objetivos.map((obj, i) => (
                <div key={i} style={{ borderLeft: '3px solid #4f8ef7', background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: '#1d3a6b', fontSize: 13, marginBottom: 4 }}>{i + 1}. {obj}</div>
                  <div style={{ fontSize: 13, color: '#000', lineHeight: 1.7 }}>
                    <strong>Conclusión:</strong> {conclusionesFinal[i] || 'Conclusión no registrada.'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: '#000' }}>No se definieron objetivos.</div>
            )}
            {d8.recomendaciones && (
              <>
                <div style={{ ...cardTitleStyle, marginTop: 22 }}>Recomendaciones generales</div>
                <div style={{ fontSize: 13, color: '#000', lineHeight: 1.8 }}>{d8.recomendaciones}</div>
              </>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}