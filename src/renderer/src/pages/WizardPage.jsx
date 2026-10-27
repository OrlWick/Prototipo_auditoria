import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Save, CheckCircle, Building, Monitor, AlertTriangle,
  Code, Shield, Target, FileCheck, X, Camera, Plus,
  Lightbulb, Paperclip, AlertCircle
} from 'lucide-react'
import { useAuditoriaStore } from '../store/useStore'
import PdfPreview from '../components/PdfPreview'
import { evaluarAuditoria } from '../config/reglasAuditoria'

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

export default function WizardPage({ auditoriaId, onVolver }) {
  const {
    seccionActual,
    setSeccionActual,
    datosWizard,
    updateSeccionDatos,
    guardarYAvanzar,
    cargarDesdeDB,
    isLoading,
    auditoriaActual,
    resetWizard
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
      } catch (error) {
        console.error('Error cargando historial:', error)
      }
    }
    fetchHistorial()
    // No resetear aquí - se resetea solo al volver al dashboard
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
    return (
      <PdfPreview
        onVolver={() => setShowPdf(false)}
        onBackToDashboard={onVolver}
        auditoriaId={auditoriaId}
      />
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <button
          onClick={onVolver}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13
          }}
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <div style={{ fontWeight: 600, fontSize: 15 }}>
          {auditoriaActual?.titulo || 'Auditoría TI'}
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Sección {seccionActual} de {SECCIONES.length}
        </span>
      </div>
      <div style={{ height: 3, background: 'var(--border)' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #a78bfa)' }}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '28px 20px'
        }}
      >
        <div style={{ width: '100%', maxWidth: 800 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 28,
              flexWrap: 'wrap'
            }}
          >
            {SECCIONES.map((s) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background:
                    s.num === seccionActual
                      ? 'var(--accent-soft)'
                      : s.num < seccionActual
                        ? 'var(--success-soft)'
                        : 'transparent',
                  border: '1px solid',
                  borderColor:
                    s.num === seccionActual
                      ? 'rgba(71,133,255,0.3)'
                      : s.num < seccionActual
                        ? 'rgba(34,166,126,0.2)'
                        : 'var(--border)',
                  fontSize: 12,
                  fontWeight: s.num === seccionActual ? 600 : 400,
                  color:
                    s.num === seccionActual
                      ? 'var(--accent)'
                      : s.num < seccionActual
                        ? 'var(--success)'
                        : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.num < seccionActual ? <CheckCircle size={12} /> : <s.icon size={12} />}
                <span>{s.titulo}</span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={seccionActual}
              custom={direction}
              variants={{
                enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <SectionRenderer
                seccion={seccionActual}
                datos={datosWizard[seccionActual] || {}}
                onSubmit={avanzar}
                onBack={seccionActual > 1 ? retroceder : null}
                isLoading={saving || isLoading}
                onShowPdf={() => setShowPdf(true)}
                totalSecciones={SECCIONES.length}
                auditoriaId={auditoriaId}
                historial={historial}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function SectionRenderer({
  seccion,
  datos,
  onSubmit,
  onBack,
  isLoading,
  onShowPdf,
  totalSecciones,
  auditoriaId,
  historial
}) {
  const props = { datos, onSubmit, onBack, isLoading, totalSecciones, auditoriaId, num: seccion }
  switch (seccion) {
    case 1:
      return <Seccion1DatosGenerales {...props} historial={historial} />
    case 2:
      return <Seccion2Objetivos {...props} />
    case 3:
      return <Seccion3Inventario {...props} />
    case 4:
      return <Seccion4EstadoFisico {...props} />
    case 5:
      return <Seccion5Software {...props} />
    case 6:
      return <Seccion6SeguridadISO {...props} />
    case 7:
      return <Seccion7Hallazgos {...props} auditoriaId={auditoriaId} />
    case 8:
      return <Seccion8Conclusiones {...props} onShowPdf={onShowPdf} />
    case 9:
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, color: 'var(--text-muted)', gap: 8 }}>
          <div className="spinner" /> Generando informe...
        </div>
      )
    default:
      return null
  }
}

// ─── UI Components ───────────────────────────────────────────────────────
function FormCard({
  titulo,
  subtitulo,
  icon: Icon,
  num,
  children,
  onSubmit,
  onBack,
  isLoading,
  submitLabel = 'Siguiente',
  isLast
}) {
  return (
    <div className="card pattern-diagonal" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
      <div className="section-header" style={{ marginBottom: 28 }}>
        <div className="section-header-icon">
          <Icon size={20} color="var(--accent)" />
        </div>
        <div>
          <div className="section-header-eyebrow">Sección {num}/8</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2, letterSpacing: '-0.02em' }}>{titulo}</h2>
          {subtitulo && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitulo}</p>}
        </div>
      </div>
      <form onSubmit={onSubmit}>
        {children}
        <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
          {onBack && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
              disabled={isLoading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={15} /> Anterior
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 140 }}
          >
            {isLoading ? (
              'Guardando...'
            ) : isLast ? (
              <>
                <Save size={15} /> Generar Informe
              </>
            ) : (
              <>
                {submitLabel} <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, required, children, error }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label className="label">
        {label}
        {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${value === opt.value ? 'var(--accent)' : 'var(--border)'}`,
            background: value === opt.value ? 'var(--accent-glow)' : 'var(--bg-secondary)',
            color: value === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize: 14
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ display: 'none' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${(selected || []).includes(opt) ? 'var(--accent)' : 'var(--border)'}`,
            background: (selected || []).includes(opt)
              ? 'var(--accent-glow)'
              : 'var(--bg-secondary)',
            color: (selected || []).includes(opt) ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize: 13
          }}
        >
          <input
            type="checkbox"
            checked={(selected || []).includes(opt)}
            onChange={() => onChange(opt)}
            style={{ display: 'none' }}
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

// ─── SECCIÓN 1: Datos Generales ────────────────────────────────────────
function Seccion1DatosGenerales({ datos, onSubmit, onBack, isLoading, historial, num }) {
  const [form, setForm] = useState({ organizacion: '', area: '', auditor: '', ...datos })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.organizacion) errs.organizacion = 'Requerido'
    if (!form.area) errs.area = 'Requerido'
    if (!form.auditor) errs.auditor = 'Requerido'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  return (
    <FormCard
      titulo="Datos Generales"
      subtitulo="Información básica de la auditoría"
      icon={Building}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field label="Nombre de la organización" required error={errors.organizacion}>
          <input
            className="input-field"
            list="orgs-list"
            placeholder="Empresa S.A."
            value={form.organizacion}
            onChange={(e) => setForm((p) => ({ ...p, organizacion: e.target.value }))}
          />
          {historial && (
            <datalist id="orgs-list">
              {historial.organizaciones?.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          )}
        </Field>
        <Field label="Área / Departamento" required error={errors.area}>
          <input
            className="input-field"
            list="areas-list"
            placeholder="Departamento de TI"
            value={form.area}
            onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
          />
          {historial && (
            <datalist id="areas-list">
              {historial.areas?.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          )}
        </Field>
        <Field label="Auditor" required error={errors.auditor}>
          <input
            className="input-field"
            placeholder="Nombre completo"
            value={form.auditor}
            onChange={(e) => setForm((p) => ({ ...p, auditor: e.target.value }))}
          />
        </Field>
      </div>
    </FormCard>
  )
}

// ─── SECCIÓN 2: Objetivos (mínimo 3 predefinidos) ───────────────────
const OBJ_PREDEF = [
  'Evaluar el cumplimiento de las políticas de seguridad de la información',
  'Verificar la integridad y disponibilidad de los activos de información',
  'Identificar vulnerabilidades y riesgos en la infraestructura TI'
]

function Seccion2Objetivos({ datos, onSubmit, onBack, isLoading, num }) {
  const [objetivos, setObjetivos] = useState(
    datos.objetivos?.length >= 3
      ? datos.objetivos
      : [...OBJ_PREDEF, ...(datos.objetivos || []).slice(3)]
  )

  const addObj = () => setObjetivos((p) => [...p, ''])
  const removeObj = (i) =>
    objetivos.length > 3 && setObjetivos((p) => p.filter((_, idx) => idx !== i))
  const updateObj = (i, val) =>
    setObjetivos((p) => {
      const c = [...p]
      c[i] = val
      return c
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    const validos = objetivos.filter((o) => o.trim())
    if (validos.length < 3) return
    onSubmit({ objetivos: validos })
  }

  return (
    <FormCard
      titulo="Objetivos de la Auditoría"
      subtitulo="Define los objetivos principales que guiarán el informe ejecutivo"
      icon={Target}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 20,
          padding: '12px 16px',
          background: 'var(--accent-soft)',
          border: '1px solid rgba(71,133,255,0.2)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <Lightbulb size={14} color="var(--accent-secondary)" />
        Los siguientes objetivos han sido predefinidos como base para tu auditoría.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {objetivos.map((obj, i) => (
          <div 
            key={i} 
            style={{ 
              display: 'flex', 
              gap: 12, 
              alignItems: 'flex-start',
              background: i < 3 ? 'rgba(71,133,255,0.05)' : 'var(--bg-secondary)',
              border: '1px solid',
              borderColor: i < 3 ? 'rgba(71,133,255,0.2)' : 'var(--border)',
              borderRadius: 10,
              padding: 16
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: i < 3 ? 'var(--accent-soft)' : 'var(--bg-hover)',
                color: i < 3 ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {i + 1}
            </div>
            
            {i < 3 ? (
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: 4 }}>
                  {obj}
                </p>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder={`Escribe el objetivo personalizado...`}
                  value={obj}
                  onChange={(e) => updateObj(i, e.target.value)}
                  style={{ flex: 1, resize: 'vertical' }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => removeObj(i)}
                  className="btn-danger"
                  style={{ padding: '0 12px', height: 'fit-content', borderRadius: 8 }}
                  title="Eliminar objetivo"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addObj}
        style={{ 
          fontSize: 14, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          padding: '12px',
          background: 'transparent',
          border: '1px dashed var(--accent)',
          borderRadius: 8,
          color: 'var(--accent)',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-glow)' }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        <Plus size={16} /> Añadir objetivo personalizado
      </button>
    </FormCard>
  )
}

// ─── CHIP GROUP (Selector Visual) ────────────────────────────────────
function ChipGroup({ label, options, selected, onChange, multi = false, icon }) {
  const isSelected = (val) =>
    multi ? (selected || []).includes(val) : selected === val

  const handleClick = (val) => {
    if (multi) {
      const arr = [...(selected || [])]
      const idx = arr.indexOf(val)
      idx >= 0 ? arr.splice(idx, 1) : arr.push(val)
      onChange(arr)
    } else {
      onChange(val === selected ? '' : val)
    }
  }

  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label className="label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon && <span style={{ opacity: 0.7 }}>{icon}</span>}
          {label}
        </label>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => {
          const sel = isSelected(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: sel ? 600 : 400,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: sel ? 'var(--accent)' : 'var(--border)',
                background: sel ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                color: sel ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                transform: sel ? 'scale(1.03)' : 'scale(1)',
                boxShadow: sel ? '0 0 0 1px rgba(71,133,255,0.3)' : 'none'
              }}
            >
              {sel && <CheckCircle size={11} style={{ marginRight: 2, flexShrink: 0 }} />}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── SECCIÓN 3: Inventario ────────────────────────────────────────────
function Seccion3Inventario({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({
    totalEquipos: '',
    tipoEquipo: '',
    marcaEquipo: [],
    sistemasOperativos: '',
    soChips: [],
    ram: [],
    discoDuro: [],
    procesador: [],
    estadoEquipos: '',
    anoFabricacion: '',
    tipoRed: [],
    tieneMonitor: '',
    ...datos
  })

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <FormCard
      titulo="Inventario de Equipos"
      subtitulo="Caracterización técnica completa del parque tecnológico"
      icon={Monitor}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      {/* Fila: Cantidad y tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Field label="Total de equipos en existencia" required>
          <input
            className="input-field"
            type="number"
            min="1"
            placeholder="Ej: 25"
            value={form.totalEquipos}
            onChange={(e) => set('totalEquipos', e.target.value)}
            required
          />
        </Field>
        <Field label="Año de fabricación promedio">
          <input
            className="input-field"
            type="number"
            min="2000"
            max="2026"
            placeholder="Ej: 2019"
            value={form.anoFabricacion}
            onChange={(e) => set('anoFabricacion', e.target.value)}
          />
        </Field>
      </div>

      <ChipGroup
        label="Tipo de equipo"
        options={['PC de Escritorio', 'Laptop', 'Workstation', 'All-in-One', 'Mixto']}
        selected={form.tipoEquipo}
        onChange={(v) => set('tipoEquipo', v)}
        multi={false}
      />

      <ChipGroup
        label="Marca de los equipos (puede seleccionar varias)"
        options={['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Toshiba', 'Samsung']}
        selected={form.marcaEquipo}
        onChange={(v) => set('marcaEquipo', v)}
        multi={true}
      />

      {/* Sistema Operativo */}
      <ChipGroup
        label="Sistema Operativo principal"
        options={['Windows 10', 'Windows 11', 'Windows 7/8 (obsoleto)', 'Ubuntu / Linux', 'macOS']}
        selected={form.soChips}
        onChange={(v) => set('soChips', v)}
        multi={false}
      />
      <Field label="Versión específica del SO (opcional)">
        <input
          className="input-field"
          list="so-version-list"
          placeholder="Ej: Windows 10 Pro 22H2"
          value={form.sistemasOperativos}
          onChange={(e) => set('sistemasOperativos', e.target.value)}
        />
        <datalist id="so-version-list">
          <option value="Windows 10 Pro 22H2" />
          <option value="Windows 11 Pro 23H2" />
          <option value="Ubuntu 22.04 LTS" />
          <option value="Ubuntu 24.04 LTS" />
          <option value="macOS Sonoma 14" />
          <option value="macOS Ventura 13" />
        </datalist>
      </Field>

      <ChipGroup
        label="Memoria RAM (puede seleccionar varias)"
        options={['2 GB', '4 GB', '8 GB', '16 GB', '32 GB', '64 GB']}
        selected={form.ram}
        onChange={(v) => set('ram', v)}
        multi={true}
      />

      <ChipGroup
        label="Almacenamiento interno"
        options={['128 GB SSD', '256 GB SSD', '512 GB SSD', '1 TB SSD', '500 GB HDD', '1 TB HDD', '2 TB HDD']}
        selected={form.discoDuro}
        onChange={(v) => set('discoDuro', v)}
        multi={true}
      />

      <ChipGroup
        label="Procesadores presentes en el parque tecnológico"
        options={['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9']}
        selected={form.procesador}
        onChange={(v) => set('procesador', v)}
        multi={true}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <ChipGroup
          label="Estado general de los equipos"
          options={['Óptimo', 'Aceptable', 'Deteriorado', 'Obsoleto']}
          selected={form.estadoEquipos}
          onChange={(v) => set('estadoEquipos', v)}
          multi={false}
        />
        <ChipGroup
          label="Tipo de red"
          options={['Ethernet (cable)', 'Wi-Fi', 'Mixta']}
          selected={form.tipoRed}
          onChange={(v) => set('tipoRed', v)}
          multi={false}
        />
      </div>

      <ChipGroup
        label="¿Los equipos cuentan con monitor propio?"
        options={['Sí, todos', 'Sí, parcialmente', 'No']}
        selected={form.tieneMonitor}
        onChange={(v) => set('tieneMonitor', v)}
        multi={false}
      />

    </FormCard>
  )
}



// ─── SECCIÓN 4: Estado Físico ─────────────────────────────────────────
function Seccion4EstadoFisico({ datos, onSubmit, onBack, isLoading, auditoriaId, num }) {
  const { datosWizard } = useAuditoriaStore()
  const totalEq = parseInt(datosWizard[3]?.totalEquipos) || 0

  const [cantidadDanos, setCantidadDanos] = useState(datos.cantidadDanos || '')
  const [equiposDanados, setEquiposDanados] = useState(datos.equiposDanados || [])
  const [obsGenerales, setObsGenerales] = useState(datos.observacionesGenerales || '')

  useEffect(() => {
    const n = Math.min(parseInt(cantidadDanos) || 0, totalEq)
    setEquiposDanados((prev) => {
      const next = [...prev]
      while (next.length < n) next.push({ descripcion: '', fotoPath: '' })
      return next.slice(0, n)
    })
  }, [cantidadDanos, totalEq])

  const updateEq = (i, field, value) =>
    setEquiposDanados((prev) => {
      const copy = [...prev]
      copy[i] = { ...copy[i], [field]: value }
      return copy
    })

  const selectFoto = async (i) => {
    try {
      const path = await window.api.selectImage()
      if (path) {
        const copied = await window.api.copyToUserData(path, auditoriaId)
        updateEq(i, 'fotoPath', copied || path)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDrop = async (e, i) => {
    e.preventDefault()
    try {
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        const path = file.path
        if (path) {
          const copied = await window.api.copyToUserData(path, auditoriaId)
          updateEq(i, 'fotoPath', copied || path)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const n = parseInt(cantidadDanos) || 0
    onSubmit({
      tieneDanos: n > 0 ? 'si' : 'no',
      cantidadDanos,
      equiposDanados,
      observacionesGenerales: obsGenerales
    })
  }

  return (
    <FormCard
      titulo="Estado Físico"
      subtitulo="Condición física de los equipos auditados"
      icon={AlertTriangle}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      <Field label={`¿Cuántos equipos presentan daños? (Máximo: ${totalEq})`} required>
        <input
          className="input-field"
          type="number"
          min="0"
          max={totalEq}
          placeholder="0"
          value={cantidadDanos}
          onChange={(e) =>
            setCantidadDanos(Math.min(parseInt(e.target.value) || 0, totalEq).toString())
          }
          style={{ maxWidth: 180 }}
          required
        />
      </Field>
      {equiposDanados.map((eq, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 10 }}>
            Equipo #{i + 1} con daño
          </div>
          <Field label="Descripción del daño">
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe el daño..."
              value={eq.descripcion}
              onChange={(e) => updateEq(i, 'descripcion', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </Field>
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Camera size={13} style={{ opacity: 0.5 }} /> Fotografía de evidencia
            </label>
            <div
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                border: '1px dashed var(--border)',
                borderRadius: 8,
                background: 'var(--bg-primary)'
              }}
            >
              <button
                type="button"
                onClick={() => selectFoto(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 13
                }}
              >
                <Camera size={14} /> Subir imagen
              </button>
              {eq.fotoPath && (
                <span style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={12} /> {eq.fotoPath.split(/[\\/]/).pop()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <Field label="Observaciones generales">
        <textarea
          className="input-field"
          rows={3}
          placeholder="Observaciones adicionales..."
          value={obsGenerales}
          onChange={(e) => setObsGenerales(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </Field>
    </FormCard>
  )
}

// ─── SECCIÓN 5: Software ─────────────────────────────────────────────
function Seccion5Software({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({
    programasInstalados: '',
    tieneLicencias: '',
    licenciasDetalle: '',
    ...datos
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }
  return (
    <FormCard
      titulo="Software"
      subtitulo="Inventario y estado del software instalado"
      icon={Code}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      <Field label="Programas instalados (principales)" required>
        <textarea
          className="input-field"
          rows={4}
          placeholder="Microsoft Office 365, Adobe CC, AutoCAD, etc."
          value={form.programasInstalados}
          onChange={(e) => setForm((p) => ({ ...p, programasInstalados: e.target.value }))}
          style={{ resize: 'vertical' }}
          required
        />
      </Field>
      <Field label="¿Los programas tienen licencia válida?">
        <RadioGroup
          name="licencias"
          value={form.tieneLicencias}
          onChange={(v) => setForm((p) => ({ ...p, tieneLicencias: v }))}
          options={[
            { value: 'si', label: 'Sí, todos' },
            { value: 'parcial', label: 'Algunos' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      {(form.tieneLicencias === 'si' || form.tieneLicencias === 'parcial') && (
        <Field label="Detalle de licencias">
          <textarea
            className="input-field"
            rows={2}
            placeholder="Tipo y vencimiento..."
            value={form.licenciasDetalle}
            onChange={(e) => setForm((p) => ({ ...p, licenciasDetalle: e.target.value }))}
            style={{ resize: 'vertical' }}
          />
        </Field>
      )}
    </FormCard>
  )
}

// ─── SECCIÓN 6: Seguridad ISO 27001 ──────────────────────────────────
function Seccion6SeguridadISO({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({
    // 6.1 Roles y Responsabilidades
    r6_1_resp_asignado: '',
    r6_1_reconoce: '',
    r6_1_politicas: '',
    // 6.2 Seguridad del Personal
    r6_2_formacion: '',
    r6_2_acuerdo: '',
    // 6.3 Gestión de Activos
    r6_3_registrados: '',
    r6_3_dueno: '',
    r6_3_clasificados: '',
    // 6.4 Control de Acceso
    r6_4_password: '',
    r6_4_password_fuerte: '',
    r6_4_bloqueo: '',
    r6_4_cuenta_ind: '',
    r6_4_priv_min: '',
    // 6.5 Criptografía
    r6_5_disco_cifrado: '',
    r6_5_usb_cifrado: '',
    r6_5_arch_cifrados: '',
    // 6.6.1 Seguridad Física
    r6_6_1_segura: '',
    r6_6_1_acceso_ctrl: '',
    r6_6_1_mecanismos: '',
    r6_6_1_evidencia: '',
    // 6.6.2 Infraestructura
    r6_6_2_sala_serv: '',
    r6_6_2_acceso: '',
    r6_6_2_tipo_ctrl: '',
    r6_6_2_cctv: '',
    r6_6_2_ups: '',
    r6_6_2_sobretension: '',
    r6_6_2_aire: '',
    r6_6_2_temp: '',
    r6_6_2_extintores: '',
    r6_6_2_conoce_uso: '',
    r6_6_2_fotos: '',
    // 6.7 Seguridad Operacional
    r6_7_antivirus: '',
    r6_7_antivirus_act: '',
    r6_7_so_act: '',
    r6_7_software_aut: '',
    // 6.7.1 Backups
    r6_7_1_politica: '',
    r6_7_1_conocen: '',
    r6_7_1_aplica: '',
    r6_7_1_tipo: [],
    r6_7_1_pruebas: '',
    // 6.8 Comunicaciones
    r6_8_red_segura: '',
    r6_8_firewall: '',
    r6_8_vpn: '',
    r6_8_cifrado: '',
    ...datos
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <FormCard
      titulo="Seguridad ISO 27001"
      subtitulo="Evaluación de controles según ISO 27001"
      icon={Shield}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      {/* 6.1 Roles y Responsabilidades */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.1 Roles y Responsabilidades
      </h3>
      <Field label="¿Cada estación tiene un responsable asignado?">
        <RadioGroup
          name="r6_1_resp"
          value={form.r6_1_resp_asignado}
          onChange={(v) => setForm((p) => ({ ...p, r6_1_resp_asignado: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿El usuario reconoce sus responsabilidades de uso?">
        <RadioGroup
          name="r6_1_rec"
          value={form.r6_1_reconoce}
          onChange={(v) => setForm((p) => ({ ...p, r6_1_reconoce: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Existen políticas escritas sobre seguridad del equipo?">
        <RadioGroup
          name="r6_1_pol"
          value={form.r6_1_politicas}
          onChange={(v) => setForm((p) => ({ ...p, r6_1_politicas: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.2 Seguridad del Personal */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.2 Seguridad del Personal
      </h3>
      <Field label="¿El usuario recibió formación en seguridad?">
        <RadioGroup
          name="r6_2_form"
          value={form.r6_2_formacion}
          onChange={(v) => setForm((p) => ({ ...p, r6_2_formacion: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Firmó acuerdo de confidencialidad?">
        <RadioGroup
          name="r6_2_ac"
          value={form.r6_2_acuerdo}
          onChange={(v) => setForm((p) => ({ ...p, r6_2_acuerdo: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.3 Gestión de Activos */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.3 Gestión de Activos
      </h3>
      <Field label="¿Todos los equipos están registrados en inventario?">
        <RadioGroup
          name="r6_3_reg"
          value={form.r6_3_registrados}
          onChange={(v) => setForm((p) => ({ ...p, r6_3_registrados: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Los activos tienen dueño asignado?">
        <RadioGroup
          name="r6_3_due"
          value={form.r6_3_dueno}
          onChange={(v) => setForm((p) => ({ ...p, r6_3_dueno: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Los datos están clasificados por nivel de sensibilidad?">
        <RadioGroup
          name="r6_3_clas"
          value={form.r6_3_clasificados}
          onChange={(v) => setForm((p) => ({ ...p, r6_3_clasificados: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.4 Control de Acceso */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.4 Control de Acceso
      </h3>
      <Field label="¿Tiene contraseña?">
        <RadioGroup
          name="r6_4_pw"
          value={form.r6_4_password}
          onChange={(v) => setForm((p) => ({ ...p, r6_4_password: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Contraseña fuerte?">
        <RadioGroup
          name="r6_4_pwf"
          value={form.r6_4_password_fuerte}
          onChange={(v) => setForm((p) => ({ ...p, r6_4_password_fuerte: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Bloqueo automático por inactividad?">
        <RadioGroup
          name="r6_4_bloq"
          value={form.r6_4_bloqueo}
          onChange={(v) => setForm((p) => ({ ...p, r6_4_bloqueo: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Cuenta individual por usuario?">
        <RadioGroup
          name="r6_4_cuenta"
          value={form.r6_4_cuenta_ind}
          onChange={(v) => setForm((p) => ({ ...p, r6_4_cuenta_ind: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Privilegios mínimos?">
        <RadioGroup
          name="r6_4_priv"
          value={form.r6_4_priv_min}
          onChange={(v) => setForm((p) => ({ ...p, r6_4_priv_min: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.5 Criptografía */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.5 Criptografía
      </h3>
      <Field label="¿Disco cifrado (BitLocker, LUKS)?">
        <RadioGroup
          name="r6_5_disco"
          value={form.r6_5_disco_cifrado}
          onChange={(v) => setForm((p) => ({ ...p, r6_5_disco_cifrado: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿USB cifrados o restringidos?">
        <RadioGroup
          name="r6_5_usb"
          value={form.r6_5_usb_cifrado}
          onChange={(v) => setForm((p) => ({ ...p, r6_5_usb_cifrado: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Archivos sensibles cifrados?">
        <RadioGroup
          name="r6_5_arch"
          value={form.r6_5_arch_cifrados}
          onChange={(v) => setForm((p) => ({ ...p, r6_5_arch_cifrados: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.6.1 Seguridad Física de Equipos */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.6.1 Seguridad Física de Equipos
      </h3>
      <Field label="¿El área donde están los equipos es segura?">
        <RadioGroup
          name="r6_6_1_seg"
          value={form.r6_6_1_segura}
          onChange={(v) => setForm((p) => ({ ...p, r6_6_1_segura: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Acceso controlado al espacio físico?">
        <RadioGroup
          name="r6_6_1_acc"
          value={form.r6_6_1_acceso_ctrl}
          onChange={(v) => setForm((p) => ({ ...p, r6_6_1_acceso_ctrl: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Mecanismos antirobo presentes?">
        <RadioGroup
          name="r6_6_1_mec"
          value={form.r6_6_1_mecanismos}
          onChange={(v) => setForm((p) => ({ ...p, r6_6_1_mecanismos: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="Evidencia">
        <div style={{ position: 'relative' }}>
          <Paperclip size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-field"
            style={{ paddingLeft: 36 }}
            placeholder="Describir evidencias..."
            value={form.r6_6_1_evidencia}
            onChange={(e) => setForm((p) => ({ ...p, r6_6_1_evidencia: e.target.value }))}
          />
        </div>
      </Field>

      {/* 6.6.2 Seguridad Física de Infraestructura */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.6.2 Seguridad Física de Infraestructura
      </h3>
      <Field label="¿Existe un área dedicada para servidores o equipos críticos?">
        <RadioGroup
          name="r6_6_2_sala"
          value={form.r6_6_2_sala_serv}
          onChange={(v) => setForm((p) => ({ ...p, r6_6_2_sala_serv: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {form.r6_6_2_sala_serv === 'si' && (
        <>
          <Field label="¿El acceso está controlado?">
            <RadioGroup
              name="r6_6_2_acc"
              value={form.r6_6_2_acceso}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_acceso: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          {form.r6_6_2_acceso === 'si' && (
            <Field label="Tipo de control">
              <input
                className="input-field"
                placeholder="llave / tarjeta / biometría / guardia"
                value={form.r6_6_2_tipo_ctrl}
                onChange={(e) => setForm((p) => ({ ...p, r6_6_2_tipo_ctrl: e.target.value }))}
              />
            </Field>
          )}
          <Field label="¿La sala cuenta con CCTV?">
            <RadioGroup
              name="r6_6_2_cctv"
              value={form.r6_6_2_cctv}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_cctv: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <h4 style={{ fontSize: 13, margin: '16px 0 8px', color: 'var(--text-secondary)' }}>
            Protección eléctrica
          </h4>
          <Field label="¿Está protegida por UPS?">
            <RadioGroup
              name="r6_6_2_ups"
              value={form.r6_6_2_ups}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_ups: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <Field label="¿Sistemas de supresión contra sobretensiones?">
            <RadioGroup
              name="r6_6_2_sobret"
              value={form.r6_6_2_sobretension}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_sobretension: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <h4 style={{ fontSize: 13, margin: '16px 0 8px', color: 'var(--text-secondary)' }}>
            Ambiente controlado
          </h4>
          <Field label="¿Aire acondicionado dedicado?">
            <RadioGroup
              name="r6_6_2_aire"
              value={form.r6_6_2_aire}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_aire: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <Field label="¿Temperatura monitoreada?">
            <RadioGroup
              name="r6_6_2_temp"
              value={form.r6_6_2_temp}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_temp: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <h4 style={{ fontSize: 13, margin: '16px 0 8px', color: 'var(--text-secondary)' }}>
            Prevención de incendios
          </h4>
          <Field label="¿Extintores disponibles y vigentes?">
            <RadioGroup
              name="r6_6_2_ext"
              value={form.r6_6_2_extintores}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_extintores: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <Field label="¿El personal conoce el uso?">
            <RadioGroup
              name="r6_6_2_con"
              value={form.r6_6_2_conoce_uso}
              onChange={(v) => setForm((p) => ({ ...p, r6_6_2_conoce_uso: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
          <Field label="Evidencias - Fotos del área">
            <input
              className="input-field"
              placeholder="Describir o listar fotos..."
              value={form.r6_6_2_fotos}
              onChange={(e) => setForm((p) => ({ ...p, r6_6_2_fotos: e.target.value }))}
            />
          </Field>
        </>
      )}

      {/* 6.7 Seguridad Operacional */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.7 Seguridad Operacional
      </h3>
      <Field label="¿Antivirus instalado?">
        <RadioGroup
          name="r6_7_ant"
          value={form.r6_7_antivirus}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_antivirus: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      {form.r6_7_antivirus === 'si' && (
        <Field label="¿Antivirus actualizado?">
          <RadioGroup
            name="r6_7_anta"
            value={form.r6_7_antivirus_act}
            onChange={(v) => setForm((p) => ({ ...p, r6_7_antivirus_act: v }))}
            options={[
              { value: 'si', label: 'Sí' },
              { value: 'no', label: 'No' }
            ]}
          />
        </Field>
      )}
      <Field label="¿Sistema operativo actualizado?">
        <RadioGroup
          name="r6_7_so"
          value={form.r6_7_so_act}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_so_act: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Software autorizado?">
        <RadioGroup
          name="r6_7_sw"
          value={form.r6_7_software_aut}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_software_aut: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>

      {/* 6.7.1 Gestión de Backups */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.7.1 Gestión de Backups
      </h3>
      <Field label="¿El área cuenta con política de respaldos?">
        <RadioGroup
          name="r6_7_1_pol"
          value={form.r6_7_1_politica}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_1_politica: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Los usuarios la conocen?">
        <RadioGroup
          name="r6_7_1_con"
          value={form.r6_7_1_conocen}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_1_conocen: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Se aplica en las estaciones auditadas?">
        <RadioGroup
          name="r6_7_1_apl"
          value={form.r6_7_1_aplica}
          onChange={(v) => setForm((p) => ({ ...p, r6_7_1_aplica: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      {form.r6_7_1_aplica === 'si' && (
        <>
          <Field label="Tipo de backup aplicado">
            <CheckboxGroup
              options={['Completo', 'Incremental', 'Diferencial']}
              selected={form.r6_7_1_tipo}
              onChange={(v) => {
                setForm((p) => {
                  const arr = [...(p.r6_7_1_tipo || [])]
                  const idx = arr.indexOf(v)
                  idx >= 0 ? arr.splice(idx, 1) : arr.push(v)
                  return { ...p, r6_7_1_tipo: arr }
                })
              }}
            />
          </Field>
          <Field label="¿Se han realizado pruebas de restauración en los últimos 12 meses?">
            <RadioGroup
              name="r6_7_1_prue"
              value={form.r6_7_1_pruebas}
              onChange={(v) => setForm((p) => ({ ...p, r6_7_1_pruebas: v }))}
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' }
              ]}
            />
          </Field>
        </>
      )}

      {/* 6.8 Seguridad en las Comunicaciones */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          margin: '20px 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)'
        }}
      >
        6.8 Seguridad en las Comunicaciones
      </h3>
      <Field label="¿Se usa red segura?">
        <RadioGroup
          name="r6_8_red"
          value={form.r6_8_red_segura}
          onChange={(v) => setForm((p) => ({ ...p, r6_8_red_segura: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Firewall activado?">
        <RadioGroup
          name="r6_8_fw"
          value={form.r6_8_firewall}
          onChange={(v) => setForm((p) => ({ ...p, r6_8_firewall: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿VPN disponible?">
        <RadioGroup
          name="r6_8_vpn"
          value={form.r6_8_vpn}
          onChange={(v) => setForm((p) => ({ ...p, r6_8_vpn: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
      <Field label="¿Conexiones cifradas (HTTPS)?">
        <RadioGroup
          name="r6_8_cif"
          value={form.r6_8_cifrado}
          onChange={(v) => setForm((p) => ({ ...p, r6_8_cifrado: v }))}
          options={[
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' }
          ]}
        />
      </Field>
    </FormCard>
  )
}

// ─── SECCIÓN 7: Hallazgos y Riesgos ──────────────────────────────────
function Seccion7Hallazgos({ datos, onSubmit, onBack, isLoading, num }) {
  const { datosWizard } = useAuditoriaStore()
  const [hallazgos, setHallazgos] = useState([])

  useEffect(() => {
    // Generar hallazgos automáticamente basados en las respuestas
    const { hallazgosGenerados } = evaluarAuditoria(datosWizard)
    setHallazgos(hallazgosGenerados)
  }, [datosWizard])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ hallazgos })
  }

  return (
    <FormCard
      titulo="Hallazgos y Riesgos (Autogenerados)"
      subtitulo="Lista de problemas detectados por el motor de reglas."
      icon={AlertTriangle}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    >
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 16,
          padding: '10px 14px',
          background: 'var(--success-soft)',
          border: '1px solid rgba(34,166,126,0.3)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <CheckCircle size={14} color="var(--success)" />
        Estos hallazgos se han calculado dinámicamente con base en las respuestas proporcionadas y las normativas ISO.
      </p>
      {hallazgos.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          No se detectaron hallazgos de seguridad. Todo parece estar en orden.
        </div>
      ) : (
        hallazgos.map((h, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                {h.area}
              </div>
              <div className={`shield ${h.nivel_riesgo === 'muy alto' ? 'shield-red' : h.nivel_riesgo === 'alto' ? 'shield-yellow' : 'shield-yellow'}`} style={{ fontSize: 10 }}>
                Riesgo {h.nivel_riesgo.toUpperCase()}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Hallazgo:</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{h.problema}</p>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Criterio:</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{h.criterio}</p>
            </div>
          </div>
        ))
      )}
    </FormCard>
  )
}

// ─── SECCIÓN 8: Conclusiones ─────────────────────────────────────────
function Seccion8Conclusiones({ datos, onSubmit, onBack, isLoading, onShowPdf, num }) {
  const { datosWizard } = useAuditoriaStore()
  const objetivos = datosWizard[2]?.objetivos || []
  const [conclusiones, setConclusiones] = useState([])
  const [recomendaciones, setRecomendaciones] = useState(datos.recomendaciones || 'En base a los hallazgos, se recomienda implementar un plan de remediación priorizando los riesgos Muy Altos y Altos para proteger la infraestructura y los datos de la organización.')

  const { hallazgosGenerados: hallazgos } = evaluarAuditoria(datosWizard)

  const riesgoCounts = {
    muyAlto: hallazgos.filter(h => h.nivel_riesgo === 'muy alto').length,
    alto:    hallazgos.filter(h => h.nivel_riesgo === 'alto').length,
    medio:   hallazgos.filter(h => h.nivel_riesgo === 'medio').length,
  }
  const cumplimiento = Math.max(0, 8 - hallazgos.length)

  const nivelGlobal =
    riesgoCounts.muyAlto > 0 ? 'CRÍTICO'
    : riesgoCounts.alto > 0  ? 'ALTO'
    : riesgoCounts.medio > 0 ? 'MEDIO'
    : 'CUMPLIMIENTO'

  const nivelStyle =
    nivelGlobal === 'CRÍTICO'     ? { color: 'var(--danger)', bg: 'var(--danger-soft)', border: 'rgba(229,72,77,0.3)' }
    : nivelGlobal === 'ALTO'      ? { color: '#ff7b00', bg: 'rgba(255,123,0,0.08)', border: 'rgba(255,123,0,0.3)' }
    : nivelGlobal === 'MEDIO'     ? { color: 'var(--warning)', bg: 'var(--warning-soft)', border: 'rgba(217,119,6,0.3)' }
    : { color: 'var(--success)', bg: 'var(--success-soft)', border: 'rgba(34,166,126,0.3)' }
  const nivelColor = nivelStyle.color

  useEffect(() => {
    const { conclusionesSugeridas } = evaluarAuditoria(datosWizard)
    const nuevasConclusiones = objetivos.map((obj, i) => conclusionesSugeridas[i] || '')
    setConclusiones(nuevasConclusiones)
  }, [datosWizard, objetivos])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({ conclusiones, recomendaciones })
    onShowPdf()
    try {
      if (datosWizard) {
        const auditoriaId = useAuditoriaStore.getState().auditoriaActual?.id
        if (auditoriaId) await window.api.completarAuditoria(auditoriaId)
      }
    } catch (err) {
      console.error('Error completando auditoría:', err)
    }
  }

  const SemaforoCard = ({ label, count, color, bg, Icon }) => (
    <div style={{
      flex: 1,
      background: bg,
      border: `1px solid ${color}44`,
      borderRadius: 12,
      padding: '18px 14px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
      {Icon && <Icon size={22} color={color} style={{ opacity: 0.8 }} />}
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )

  return (
    <FormCard
      titulo="Conclusiones y Recomendaciones"
      subtitulo="Resumen ejecutivo del estado de seguridad TI"
      icon={FileCheck}
      num={num}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
      isLast
    >

      {/* ── SEMÁFORO EJECUTIVO ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${nivelStyle.border}`,
        borderRadius: 14,
        padding: 20,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
              Estado Global de la Auditoría
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: nivelColor }}>
              ● Nivel {nivelGlobal}
            </div>
          </div>
          <div style={{
            background: nivelStyle.bg,
            border: `1px solid ${nivelStyle.border}`,
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            color: nivelColor
          }}>
            {hallazgos.length} hallazgo{hallazgos.length !== 1 ? 's' : ''} detectado{hallazgos.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <SemaforoCard label="Muy Alto / Crítico" count={riesgoCounts.muyAlto} color="var(--danger)" bg="var(--danger-soft)" Icon={AlertCircle} />
          <SemaforoCard label="Riesgo Alto" count={riesgoCounts.alto} color="#ff7b00" bg="rgba(255,123,0,0.1)" Icon={AlertTriangle} />
          <SemaforoCard label="Riesgo Medio" count={riesgoCounts.medio} color="var(--warning)" bg="var(--warning-soft)" Icon={AlertTriangle} />
          <SemaforoCard label="En Cumplimiento" count={cumplimiento} color="var(--success)" bg="var(--success-soft)" Icon={CheckCircle} />
        </div>
      </div>

      <p style={{
        fontSize: 13,
        color: 'var(--text-secondary)',
        marginBottom: 20,
        padding: '10px 14px',
        background: 'var(--success-soft)',
        border: '1px solid rgba(34,166,126,0.3)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <CheckCircle size={14} color="var(--success)" />
        Las conclusiones han sido generadas automáticamente. Puedes revisarlas y ajustarlas antes de generar el PDF.
      </p>

      {objetivos.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          No se definieron objetivos en la sección 2.
        </div>
      ) : (
        objetivos.map((obj, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: 6,
              padding: '5px 12px',
              background: 'var(--accent-soft)',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(71,133,255,0.15)'
            }}
          >
            <Target size={13} color="var(--accent)" />
            Objetivo {i + 1}: "{obj}"
            </div>
            <textarea
              className="input-field"
              rows={3}
              placeholder={`Conclusión del objetivo ${i + 1}...`}
              value={conclusiones[i] || ''}
              onChange={(e) => {
                const c = [...conclusiones]
                while (c.length <= i) c.push('')
                c[i] = e.target.value
                setConclusiones(c)
              }}
              style={{ resize: 'vertical' }}
              required
            />
          </div>
        ))
      )}

      <Field label="Recomendaciones generales" required>
        <textarea
          className="input-field"
          rows={4}
          placeholder="Recomendaciones para mejorar la seguridad y gestión TI..."
          value={recomendaciones}
          onChange={(e) => setRecomendaciones(e.target.value)}
          style={{ resize: 'vertical' }}
          required
        />
      </Field>
    </FormCard>
  )
}


