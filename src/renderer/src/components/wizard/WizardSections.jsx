import { useState, useEffect } from 'react'
import { Building, Target, Monitor, AlertTriangle, Code, Shield, FileCheck, X, Camera, Plus, Lightbulb, Paperclip, AlertCircle } from 'lucide-react'
import { FormCard, Field, RadioGroup, CheckboxGroup, ChipGroup } from './WizardUI'
import { useAuditoriaStore } from '../../store/useStore'
import { evaluarAuditoria } from '../../config/reglasAuditoria'

// ─── SECCIÓN 1: Datos Generales ────────────────────────────────────────
export function Seccion1DatosGenerales({ datos, onSubmit, onBack, isLoading, historial, num }) {
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
    <FormCard titulo="Datos Generales" subtitulo="Información básica de la auditoría" icon={Building} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field label="Nombre de la organización" required error={errors.organizacion}>
          <input className="input-field" list="orgs-list" placeholder="Empresa S.A." value={form.organizacion} onChange={(e) => setForm((p) => ({ ...p, organizacion: e.target.value }))} />
          {historial && (
            <datalist id="orgs-list">
              {historial.organizaciones?.map((o) => <option key={o} value={o} />)}
            </datalist>
          )}
        </Field>
        <Field label="Área / Departamento" required error={errors.area}>
          <input className="input-field" list="areas-list" placeholder="Departamento de TI" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} />
          {historial && (
            <datalist id="areas-list">
              {historial.areas?.map((a) => <option key={a} value={a} />)}
            </datalist>
          )}
        </Field>
        <Field label="Auditor" required error={errors.auditor}>
          <input className="input-field" placeholder="Nombre completo" value={form.auditor} onChange={(e) => setForm((p) => ({ ...p, auditor: e.target.value }))} />
        </Field>
      </div>
    </FormCard>
  )
}

// ─── SECCIÓN 2: Objetivos ───────────────────
const OBJ_PREDEF = [
  'Evaluar el cumplimiento de las políticas de seguridad de la información',
  'Verificar la integridad y disponibilidad de los activos de información',
  'Identificar vulnerabilidades y riesgos en la infraestructura TI'
]

export function Seccion2Objetivos({ datos, onSubmit, onBack, isLoading, num }) {
  const [objetivos, setObjetivos] = useState(
    datos.objetivos?.length >= 3 ? datos.objetivos : [...OBJ_PREDEF, ...(datos.objetivos || []).slice(3)]
  )

  const addObj = () => setObjetivos((p) => [...p, ''])
  const removeObj = (i) => objetivos.length > 3 && setObjetivos((p) => p.filter((_, idx) => idx !== i))
  const updateObj = (i, val) => setObjetivos((p) => { const c = [...p]; c[i] = val; return c })

  const handleSubmit = (e) => {
    e.preventDefault()
    const validos = objetivos.filter((o) => o.trim())
    if (validos.length < 3) return
    onSubmit({ objetivos: validos })
  }

  return (
    <FormCard titulo="Objetivos de la Auditoría" subtitulo="Define los objetivos principales que guiarán el informe ejecutivo" icon={Target} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, padding: '12px 16px', background: 'var(--accent-soft)', border: '1px solid rgba(71,133,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Lightbulb size={14} color="var(--accent-secondary)" />
        Los siguientes objetivos han sido predefinidos como base para tu auditoría.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {objetivos.map((obj, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: i < 3 ? 'rgba(71,133,255,0.05)' : 'var(--bg-secondary)', border: '1px solid', borderColor: i < 3 ? 'rgba(71,133,255,0.2)' : 'var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: i < 3 ? 'var(--accent-soft)' : 'var(--bg-hover)', color: i < 3 ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {i + 1}
            </div>
            {i < 3 ? (
              <div style={{ flex: 1 }}><p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: 4 }}>{obj}</p></div>
            ) : (
              <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                <textarea className="input-field" rows={2} placeholder={`Escribe el objetivo personalizado...`} value={obj} onChange={(e) => updateObj(i, e.target.value)} style={{ flex: 1, resize: 'vertical' }} autoFocus />
                <button type="button" onClick={() => removeObj(i)} className="btn-danger" style={{ padding: '0 12px', height: 'fit-content', borderRadius: 8 }} title="Eliminar objetivo"><X size={16} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={addObj} style={{ fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', background: 'transparent', border: '1px dashed var(--accent)', borderRadius: 8, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-glow)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}>
        <Plus size={16} /> Añadir objetivo personalizado
      </button>
    </FormCard>
  )
}

// ─── SECCIÓN 3: Inventario ────────────────────────────────────────────
export function Seccion3Inventario({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({ totalEquipos: '', tipoEquipo: '', marcaEquipo: [], sistemasOperativos: '', soChips: [], ram: [], discoDuro: [], procesador: [], estadoEquipos: '', anoFabricacion: '', tipoRed: [], tieneMonitor: '', ...datos })
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form) }

  return (
    <FormCard titulo="Inventario de Equipos" subtitulo="Caracterización técnica completa del parque tecnológico" icon={Monitor} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Field label="Total de equipos en existencia" required>
          <input className="input-field" type="number" min="1" placeholder="Ej: 25" value={form.totalEquipos} onChange={(e) => set('totalEquipos', e.target.value)} required />
        </Field>
        <Field label="Año de fabricación promedio">
          <input className="input-field" type="number" min="2000" max="2026" placeholder="Ej: 2019" value={form.anoFabricacion} onChange={(e) => set('anoFabricacion', e.target.value)} />
        </Field>
      </div>
      <ChipGroup label="Tipo de equipo" options={['PC de Escritorio', 'Laptop', 'Workstation', 'All-in-One', 'Mixto']} selected={form.tipoEquipo} onChange={(v) => set('tipoEquipo', v)} multi={false} />
      <ChipGroup label="Marca de los equipos (puede seleccionar varias)" options={['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Toshiba', 'Samsung']} selected={form.marcaEquipo} onChange={(v) => set('marcaEquipo', v)} multi={true} />
      <ChipGroup label="Sistema Operativo principal" options={['Windows 10', 'Windows 11', 'Windows 7/8 (obsoleto)', 'Ubuntu / Linux', 'macOS']} selected={form.soChips} onChange={(v) => set('soChips', v)} multi={false} />
      <Field label="Versión específica del SO (opcional)">
        <input className="input-field" list="so-version-list" placeholder="Ej: Windows 10 Pro 22H2" value={form.sistemasOperativos} onChange={(e) => set('sistemasOperativos', e.target.value)} />
        <datalist id="so-version-list"><option value="Windows 10 Pro 22H2" /><option value="Windows 11 Pro 23H2" /><option value="Ubuntu 22.04 LTS" /><option value="macOS Sonoma 14" /></datalist>
      </Field>
      <ChipGroup label="Memoria RAM (puede seleccionar varias)" options={['2 GB', '4 GB', '8 GB', '16 GB', '32 GB', '64 GB']} selected={form.ram} onChange={(v) => set('ram', v)} multi={true} />
      <ChipGroup label="Almacenamiento interno" options={['128 GB SSD', '256 GB SSD', '512 GB SSD', '1 TB SSD', '500 GB HDD', '1 TB HDD', '2 TB HDD']} selected={form.discoDuro} onChange={(v) => set('discoDuro', v)} multi={true} />
      <ChipGroup label="Procesadores presentes" options={['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9']} selected={form.procesador} onChange={(v) => set('procesador', v)} multi={true} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <ChipGroup label="Estado general de los equipos" options={['Óptimo', 'Aceptable', 'Deteriorado', 'Obsoleto']} selected={form.estadoEquipos} onChange={(v) => set('estadoEquipos', v)} multi={false} />
        <ChipGroup label="Tipo de red" options={['Ethernet (cable)', 'Wi-Fi', 'Mixta']} selected={form.tipoRed} onChange={(v) => set('tipoRed', v)} multi={false} />
      </div>
      <ChipGroup label="¿Los equipos cuentan con monitor propio?" options={['Sí, todos', 'Sí, parcialmente', 'No']} selected={form.tieneMonitor} onChange={(v) => set('tieneMonitor', v)} multi={false} />
    </FormCard>
  )
}

// ─── SECCIÓN 4: Estado Físico ─────────────────────────────────────────
export function Seccion4EstadoFisico({ datos, onSubmit, onBack, isLoading, auditoriaId, num }) {
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

  const updateEq = (i, field, value) => setEquiposDanados((prev) => { const copy = [...prev]; copy[i] = { ...copy[i], [field]: value }; return copy })

  const selectFoto = async (i) => {
    try {
      const path = await window.api.selectImage()
      if (path) { const copied = await window.api.copyToUserData(path, auditoriaId); updateEq(i, 'fotoPath', copied || path) }
    } catch (e) { console.error(e) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const n = parseInt(cantidadDanos) || 0
    onSubmit({ tieneDanos: n > 0 ? 'si' : 'no', cantidadDanos, equiposDanados, observacionesGenerales: obsGenerales })
  }

  return (
    <FormCard titulo="Estado Físico" subtitulo="Condición física de los equipos auditados" icon={AlertTriangle} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <Field label={`¿Cuántos equipos presentan daños? (Máximo: ${totalEq})`} required>
        <input className="input-field" type="number" min="0" max={totalEq} placeholder="0" value={cantidadDanos} onChange={(e) => setCantidadDanos(Math.min(parseInt(e.target.value) || 0, totalEq).toString())} style={{ maxWidth: 180 }} required />
      </Field>
      {equiposDanados.map((eq, i) => (
        <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 10 }}>Equipo #{i + 1} con daño</div>
          <Field label="Descripción del daño">
            <textarea className="input-field" rows={3} placeholder="Describe el daño..." value={eq.descripcion} onChange={(e) => updateEq(i, 'descripcion', e.target.value)} style={{ resize: 'vertical' }} />
          </Field>
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Camera size={13} style={{ opacity: 0.5 }} /> Fotografía de evidencia</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, border: '1px dashed var(--border)', borderRadius: 8, background: 'var(--bg-primary)' }}>
              <button type="button" onClick={() => selectFoto(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
                <Camera size={14} /> Subir imagen
              </button>
              {eq.fotoPath && <span style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> {eq.fotoPath.split(/[\\/]/).pop()}</span>}
            </div>
          </div>
        </div>
      ))}
      <Field label="Observaciones generales">
        <textarea className="input-field" rows={3} placeholder="Observaciones adicionales..." value={obsGenerales} onChange={(e) => setObsGenerales(e.target.value)} style={{ resize: 'vertical' }} />
      </Field>
    </FormCard>
  )
}