// eslint-disable-next-line react/prop-types
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, Building, Monitor, AlertTriangle, Code, Shield, Target, FileCheck } from 'lucide-react'

// Hooks y Componentes
import { useAuditoriaStore } from '../store/useStore'
import PdfPreview from '../components/PdfPreview'
import ChatBot from '../components/ChatBot'

// Importaciones de las Secciones
import { Seccion1DatosGenerales, Seccion2Objetivos, Seccion3Inventario, Seccion4EstadoFisico } from '../components/wizard/WizardSections'
import { Seccion5Software, Seccion6SeguridadISO, Seccion7Hallazgos, Seccion8Conclusiones } from '../components/wizard/WizardSections2'

const SECCIONES = [
  { num: 1, titulo: 'Datos Generales', icon: Building },
  { num: 2, titulo: 'Objetivos', icon: Target },
  { num: 3, titulo: 'Inventario', icon: Monitor },
  { num: 4, titulo: 'Estado Físico', icon: AlertTriangle },
  { num: 5, titulo: 'Software', icon: Code },
  { num: 6, titulo: 'Seguridad ISO 27001', icon: Shield },
  { num: 7, titulo: 'Hallazgos y Riesgos', icon: AlertTriangle },
  { num: 8, titulo: 'Conclusiones', icon: FileCheck }
]

// eslint-disable-next-line react/prop-types
export default function WizardPage({ auditoriaId, onVolver }) {
  const {
    seccionActual, setSeccionActual, datosWizard, guardarYAvanzar, cargarDesdeDB, isLoading, auditoriaActual
  } = useAuditoriaStore()
  
  const [direction, setDirection] = useState(1)
  const [showPdf, setShowPdf] = useState(false)
  const [saving, setSaving] = useState(false)
  const [historial, setHistorial] = useState({ organizaciones: [], areas: [] })

  useEffect(() => {
    if (auditoriaId) cargarDesdeDB(auditoriaId)
    const fetchHistorial = async () => {
      try {
        const userStr = sessionStorage.getItem('auth-storage')
        if (userStr) {
          const { state } = JSON.parse(userStr)
          if (state?.user) {
            const hist = await window.api.getHistorialPredictivo(state.user.id)
            if (hist) setHistorial(hist)
          }
        }
      } catch (error) { console.error('Error cargando historial:', error) }
    }
    fetchHistorial()
  }, [auditoriaId])

  const avanzar = async (datos) => {
    setDirection(1)
    setSaving(true)
    await guardarYAvanzar(seccionActual, datos)
    setSaving(false)
  }

  const retroceder = () => {
    setDirection(-1)
    setSeccionActual(Math.max(1, seccionActual - 1))
  }

  const progress = ((seccionActual - 1) / (SECCIONES.length - 1)) * 100

  if (showPdf) {
    return <PdfPreview onVolver={() => setShowPdf(false)} onBackToDashboard={onVolver} auditoriaId={auditoriaId} />
  }

  const renderizarSeccion = () => {
    const props = {
      datos: datosWizard[seccionActual] || {},
      onSubmit: avanzar,
      onBack: seccionActual > 1 ? retroceder : null,
      isLoading: saving || isLoading,
      num: seccionActual,
      auditoriaId
    }

    switch (seccionActual) {
      case 1: return <Seccion1DatosGenerales {...props} historial={historial} />
      case 2: return <Seccion2Objetivos {...props} />
      case 3: return <Seccion3Inventario {...props} />
      case 4: return <Seccion4EstadoFisico {...props} />
      case 5: return <Seccion5Software {...props} />
      case 6: return <Seccion6SeguridadISO {...props} />
      case 7: return <Seccion7Hallazgos {...props} />
      case 8: return <Seccion8Conclusiones {...props} onShowPdf={() => setShowPdf(true)} />
      default: return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Generando...</div>
    }
  }

  return (
    // CONTENEDOR PRINCIPAL
    <div style={{ height: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER WIZARD */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onVolver} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <div style={{ fontWeight: 600, fontSize: 15 }}>{auditoriaActual?.titulo || 'Auditoría TI'}</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sección {seccionActual} de {SECCIONES.length}</span>
      </div>

      {/* BARRA DE PROGRESO */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #a78bfa)' }} />
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '28px 20px' }}>
        <div style={{ width: '100%', maxWidth: 800 }}>
          
          {/* PESTAÑAS SUPERIORES */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
            {SECCIONES.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: s.num === seccionActual ? 'var(--accent-soft)' : s.num < seccionActual ? 'var(--success-soft)' : 'transparent', border: '1px solid', borderColor: s.num === seccionActual ? 'rgba(71,133,255,0.3)' : s.num < seccionActual ? 'rgba(34,166,126,0.2)' : 'var(--border)', fontSize: 12, fontWeight: s.num === seccionActual ? 600 : 400, color: s.num === seccionActual ? 'var(--accent)' : s.num < seccionActual ? 'var(--success)' : 'var(--text-muted)', transition: 'all 0.15s ease' }}>
                {s.num < seccionActual ? <CheckCircle size={12} /> : <s.icon size={12} />}
                <span>{s.titulo}</span>
              </div>
            ))}
          </div>

          {/* RENDERIZADO DE LA SECCIÓN ACTIVA */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={seccionActual} custom={direction} variants={{ enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }) }} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}>
              {renderizarSeccion()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CHATBOT (Totalmente aislado de los formularios) */}
      <ChatBot />

    </div>
  )
}