import { useState, useEffect } from 'react'
import { Code, Shield, AlertTriangle, FileCheck, CheckCircle, AlertCircle, Target } from 'lucide-react'
import { FormCard, Field, RadioGroup, CheckboxGroup } from './WizardUI'
import { useAuditoriaStore } from '../../store/useStore'
import { evaluarAuditoria } from '../../config/reglasAuditoria'

// ─── SECCIÓN 5: Software ─────────────────────────────────────────────
export function Seccion5Software({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({ programasInstalados: '', tieneLicencias: '', licenciasDetalle: '', ...datos })
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form) }
  return (
    <FormCard titulo="Software" subtitulo="Inventario y estado del software instalado" icon={Code} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <Field label="Programas instalados (principales)" required>
        <textarea className="input-field" rows={4} placeholder="Microsoft Office 365, Adobe CC, AutoCAD, etc." value={form.programasInstalados} onChange={(e) => setForm((p) => ({ ...p, programasInstalados: e.target.value }))} style={{ resize: 'vertical' }} required />
      </Field>
      <Field label="¿Los programas tienen licencia válida?">
        <RadioGroup name="licencias" value={form.tieneLicencias} onChange={(v) => setForm((p) => ({ ...p, tieneLicencias: v }))} options={[{ value: 'si', label: 'Sí, todos' }, { value: 'parcial', label: 'Algunos' }, { value: 'no', label: 'No' }]} />
      </Field>
      {(form.tieneLicencias === 'si' || form.tieneLicencias === 'parcial') && (
        <Field label="Detalle de licencias">
          <textarea className="input-field" rows={2} placeholder="Tipo y vencimiento..." value={form.licenciasDetalle} onChange={(e) => setForm((p) => ({ ...p, licenciasDetalle: e.target.value }))} style={{ resize: 'vertical' }} />
        </Field>
      )}
    </FormCard>
  )
}

// ─── SECCIÓN 6: Seguridad ISO 27001 ──────────────────────────────────
export function Seccion6SeguridadISO({ datos, onSubmit, onBack, isLoading, num }) {
  const [form, setForm] = useState({
    r6_1_resp_asignado: '', r6_1_reconoce: '', r6_1_politicas: '',
    r6_2_formacion: '', r6_2_acuerdo: '',
    r6_3_registrados: '', r6_3_dueno: '', r6_3_clasificados: '',
    r6_4_password: '', r6_4_password_fuerte: '', r6_4_bloqueo: '', r6_4_cuenta_ind: '', r6_4_priv_min: '',
    r6_5_disco_cifrado: '', r6_5_usb_cifrado: '', r6_5_arch_cifrados: '',
    r6_6_1_segura: '', r6_6_1_acceso_ctrl: '', r6_6_1_mecanismos: '', r6_6_1_evidencia: '',
    r6_6_2_sala_serv: '', r6_6_2_acceso: '', r6_6_2_tipo_ctrl: '', r6_6_2_cctv: '', r6_6_2_ups: '', r6_6_2_sobretension: '', r6_6_2_aire: '', r6_6_2_temp: '', r6_6_2_extintores: '', r6_6_2_conoce_uso: '', r6_6_2_fotos: '',
    r6_7_antivirus: '', r6_7_antivirus_act: '', r6_7_so_act: '', r6_7_software_aut: '',
    r6_7_1_politica: '', r6_7_1_conocen: '', r6_7_1_aplica: '', r6_7_1_tipo: [], r6_7_1_pruebas: '',
    r6_8_red_segura: '', r6_8_firewall: '', r6_8_vpn: '', r6_8_cifrado: '', ...datos
  })
  
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form) }
  const yesNoOptions = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]
  const Title = ({ text }) => <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', margin: '20px 0 10px', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{text}</h3>

  return (
    <FormCard titulo="Seguridad ISO 27001" subtitulo="Evaluación de controles según ISO 27001" icon={Shield} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      
      <Title text="6.1 Roles y Responsabilidades" />
      <Field label="¿Cada estación tiene un responsable asignado?"><RadioGroup name="r6_1_resp" value={form.r6_1_resp_asignado} onChange={(v) => setForm((p) => ({ ...p, r6_1_resp_asignado: v }))} options={yesNoOptions} /></Field>
      <Field label="¿El usuario reconoce sus responsabilidades de uso?"><RadioGroup name="r6_1_rec" value={form.r6_1_reconoce} onChange={(v) => setForm((p) => ({ ...p, r6_1_reconoce: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Existen políticas escritas sobre seguridad del equipo?"><RadioGroup name="r6_1_pol" value={form.r6_1_politicas} onChange={(v) => setForm((p) => ({ ...p, r6_1_politicas: v }))} options={yesNoOptions} /></Field>

      <Title text="6.2 Seguridad del Personal" />
      <Field label="¿El usuario recibió formación en seguridad?"><RadioGroup name="r6_2_form" value={form.r6_2_formacion} onChange={(v) => setForm((p) => ({ ...p, r6_2_formacion: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Firmó acuerdo de confidencialidad?"><RadioGroup name="r6_2_ac" value={form.r6_2_acuerdo} onChange={(v) => setForm((p) => ({ ...p, r6_2_acuerdo: v }))} options={yesNoOptions} /></Field>

      <Title text="6.3 Gestión de Activos" />
      <Field label="¿Todos los equipos están registrados en inventario?"><RadioGroup name="r6_3_reg" value={form.r6_3_registrados} onChange={(v) => setForm((p) => ({ ...p, r6_3_registrados: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Los activos tienen dueño asignado?"><RadioGroup name="r6_3_due" value={form.r6_3_dueno} onChange={(v) => setForm((p) => ({ ...p, r6_3_dueno: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Los datos están clasificados por nivel de sensibilidad?"><RadioGroup name="r6_3_clas" value={form.r6_3_clasificados} onChange={(v) => setForm((p) => ({ ...p, r6_3_clasificados: v }))} options={yesNoOptions} /></Field>

      <Title text="6.4 Control de Acceso" />
      <Field label="¿Tiene contraseña?"><RadioGroup name="r6_4_pw" value={form.r6_4_password} onChange={(v) => setForm((p) => ({ ...p, r6_4_password: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Contraseña fuerte?"><RadioGroup name="r6_4_pwf" value={form.r6_4_password_fuerte} onChange={(v) => setForm((p) => ({ ...p, r6_4_password_fuerte: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Bloqueo automático por inactividad?"><RadioGroup name="r6_4_bloq" value={form.r6_4_bloqueo} onChange={(v) => setForm((p) => ({ ...p, r6_4_bloqueo: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Cuenta individual por usuario?"><RadioGroup name="r6_4_cuenta" value={form.r6_4_cuenta_ind} onChange={(v) => setForm((p) => ({ ...p, r6_4_cuenta_ind: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Privilegios mínimos?"><RadioGroup name="r6_4_priv" value={form.r6_4_priv_min} onChange={(v) => setForm((p) => ({ ...p, r6_4_priv_min: v }))} options={yesNoOptions} /></Field>

      <Title text="6.5 Criptografía" />
      <Field label="¿Disco cifrado (BitLocker, LUKS)?"><RadioGroup name="r6_5_disco" value={form.r6_5_disco_cifrado} onChange={(v) => setForm((p) => ({ ...p, r6_5_disco_cifrado: v }))} options={yesNoOptions} /></Field>
      <Field label="¿USB cifrados o restringidos?"><RadioGroup name="r6_5_usb" value={form.r6_5_usb_cifrado} onChange={(v) => setForm((p) => ({ ...p, r6_5_usb_cifrado: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Archivos sensibles cifrados?"><RadioGroup name="r6_5_arch" value={form.r6_5_arch_cifrados} onChange={(v) => setForm((p) => ({ ...p, r6_5_arch_cifrados: v }))} options={yesNoOptions} /></Field>

      <Title text="6.6.1 Seguridad Física de Equipos" />
      <Field label="¿El área donde están los equipos es segura?"><RadioGroup name="r6_6_1_seg" value={form.r6_6_1_segura} onChange={(v) => setForm((p) => ({ ...p, r6_6_1_segura: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Acceso controlado al espacio físico?"><RadioGroup name="r6_6_1_acc" value={form.r6_6_1_acceso_ctrl} onChange={(v) => setForm((p) => ({ ...p, r6_6_1_acceso_ctrl: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Mecanismos antirobo presentes?"><RadioGroup name="r6_6_1_mec" value={form.r6_6_1_mecanismos} onChange={(v) => setForm((p) => ({ ...p, r6_6_1_mecanismos: v }))} options={yesNoOptions} /></Field>
      <Field label="Evidencia"><input className="input-field" placeholder="Describir evidencias..." value={form.r6_6_1_evidencia} onChange={(e) => setForm((p) => ({ ...p, r6_6_1_evidencia: e.target.value }))} /></Field>

      <Title text="6.6.2 Seguridad Física de Infraestructura" />
      <Field label="¿Existe un área dedicada para servidores o equipos críticos?"><RadioGroup name="r6_6_2_sala" value={form.r6_6_2_sala_serv} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_sala_serv: v }))} options={yesNoOptions} /></Field>
      {form.r6_6_2_sala_serv === 'si' && (
        <>
          <Field label="¿El acceso está controlado?"><RadioGroup name="r6_6_2_acc" value={form.r6_6_2_acceso} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_acceso: v }))} options={yesNoOptions} /></Field>
          {form.r6_6_2_acceso === 'si' && <Field label="Tipo de control"><input className="input-field" placeholder="llave / tarjeta / biometría" value={form.r6_6_2_tipo_ctrl} onChange={(e) => setForm((p) => ({ ...p, r6_6_2_tipo_ctrl: e.target.value }))} /></Field>}
          <Field label="¿La sala cuenta con CCTV?"><RadioGroup name="r6_6_2_cctv" value={form.r6_6_2_cctv} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_cctv: v }))} options={yesNoOptions} /></Field>
          <Field label="¿Está protegida por UPS?"><RadioGroup name="r6_6_2_ups" value={form.r6_6_2_ups} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_ups: v }))} options={yesNoOptions} /></Field>
          <Field label="¿Sistemas de supresión contra sobretensiones?"><RadioGroup name="r6_6_2_sobret" value={form.r6_6_2_sobretension} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_sobretension: v }))} options={yesNoOptions} /></Field>
          <Field label="¿Aire acondicionado dedicado?"><RadioGroup name="r6_6_2_aire" value={form.r6_6_2_aire} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_aire: v }))} options={yesNoOptions} /></Field>
          <Field label="¿Temperatura monitoreada?"><RadioGroup name="r6_6_2_temp" value={form.r6_6_2_temp} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_temp: v }))} options={yesNoOptions} /></Field>
          <Field label="¿Extintores disponibles y vigentes?"><RadioGroup name="r6_6_2_ext" value={form.r6_6_2_extintores} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_extintores: v }))} options={yesNoOptions} /></Field>
          <Field label="¿El personal conoce el uso?"><RadioGroup name="r6_6_2_con" value={form.r6_6_2_conoce_uso} onChange={(v) => setForm((p) => ({ ...p, r6_6_2_conoce_uso: v }))} options={yesNoOptions} /></Field>
          <Field label="Evidencias - Fotos del área"><input className="input-field" placeholder="Describir fotos..." value={form.r6_6_2_fotos} onChange={(e) => setForm((p) => ({ ...p, r6_6_2_fotos: e.target.value }))} /></Field>
        </>
      )}

      <Title text="6.7 Seguridad Operacional" />
      <Field label="¿Antivirus instalado?"><RadioGroup name="r6_7_ant" value={form.r6_7_antivirus} onChange={(v) => setForm((p) => ({ ...p, r6_7_antivirus: v }))} options={yesNoOptions} /></Field>
      {form.r6_7_antivirus === 'si' && <Field label="¿Antivirus actualizado?"><RadioGroup name="r6_7_anta" value={form.r6_7_antivirus_act} onChange={(v) => setForm((p) => ({ ...p, r6_7_antivirus_act: v }))} options={yesNoOptions} /></Field>}
      <Field label="¿Sistema operativo actualizado?"><RadioGroup name="r6_7_so" value={form.r6_7_so_act} onChange={(v) => setForm((p) => ({ ...p, r6_7_so_act: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Software autorizado?"><RadioGroup name="r6_7_sw" value={form.r6_7_software_aut} onChange={(v) => setForm((p) => ({ ...p, r6_7_software_aut: v }))} options={yesNoOptions} /></Field>

      <Title text="6.7.1 Gestión de Backups" />
      <Field label="¿El área cuenta con política de respaldos?"><RadioGroup name="r6_7_1_pol" value={form.r6_7_1_politica} onChange={(v) => setForm((p) => ({ ...p, r6_7_1_politica: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Los usuarios la conocen?"><RadioGroup name="r6_7_1_con" value={form.r6_7_1_conocen} onChange={(v) => setForm((p) => ({ ...p, r6_7_1_conocen: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Se aplica en las estaciones auditadas?"><RadioGroup name="r6_7_1_apl" value={form.r6_7_1_aplica} onChange={(v) => setForm((p) => ({ ...p, r6_7_1_aplica: v }))} options={yesNoOptions} /></Field>
      {form.r6_7_1_aplica === 'si' && (
        <>
          <Field label="Tipo de backup aplicado"><CheckboxGroup options={['Completo', 'Incremental', 'Diferencial']} selected={form.r6_7_1_tipo} onChange={(v) => { setForm((p) => { const arr = [...(p.r6_7_1_tipo || [])]; const idx = arr.indexOf(v); idx >= 0 ? arr.splice(idx, 1) : arr.push(v); return { ...p, r6_7_1_tipo: arr } }) }} /></Field>
          <Field label="¿Se han realizado pruebas de restauración en los últimos 12 meses?"><RadioGroup name="r6_7_1_prue" value={form.r6_7_1_pruebas} onChange={(v) => setForm((p) => ({ ...p, r6_7_1_pruebas: v }))} options={yesNoOptions} /></Field>
        </>
      )}

      <Title text="6.8 Seguridad en las Comunicaciones" />
      <Field label="¿Se usa red segura?"><RadioGroup name="r6_8_red" value={form.r6_8_red_segura} onChange={(v) => setForm((p) => ({ ...p, r6_8_red_segura: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Firewall activado?"><RadioGroup name="r6_8_fw" value={form.r6_8_firewall} onChange={(v) => setForm((p) => ({ ...p, r6_8_firewall: v }))} options={yesNoOptions} /></Field>
      <Field label="¿VPN disponible?"><RadioGroup name="r6_8_vpn" value={form.r6_8_vpn} onChange={(v) => setForm((p) => ({ ...p, r6_8_vpn: v }))} options={yesNoOptions} /></Field>
      <Field label="¿Conexiones cifradas (HTTPS)?"><RadioGroup name="r6_8_cif" value={form.r6_8_cifrado} onChange={(v) => setForm((p) => ({ ...p, r6_8_cifrado: v }))} options={yesNoOptions} /></Field>
    </FormCard>
  )
}

// ─── SECCIÓN 7: Hallazgos y Riesgos ──────────────────────────────────
export function Seccion7Hallazgos({ datos, onSubmit, onBack, isLoading, num }) {
  const { datosWizard } = useAuditoriaStore()
  const [hallazgos, setHallazgos] = useState([])

  useEffect(() => {
    const { hallazgosGenerados } = evaluarAuditoria(datosWizard)
    setHallazgos(hallazgosGenerados)
  }, [datosWizard])

  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ hallazgos }) }

  return (
    <FormCard titulo="Hallazgos y Riesgos (Autogenerados)" subtitulo="Lista de problemas detectados por el motor de reglas." icon={AlertTriangle} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading}>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, padding: '10px 14px', background: 'var(--success-soft)', border: '1px solid rgba(34,166,126,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle size={14} color="var(--success)" />
        Estos hallazgos se han calculado dinámicamente con base en las respuestas proporcionadas y las normativas ISO.
      </p>
      {hallazgos.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No se detectaron hallazgos de seguridad. Todo parece estar en orden.</div>
      ) : (
        hallazgos.map((h, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{h.area}</div>
              <div className={`shield ${h.nivel_riesgo === 'muy alto' ? 'shield-red' : h.nivel_riesgo === 'alto' ? 'shield-yellow' : 'shield-yellow'}`} style={{ fontSize: 10, textTransform: 'uppercase' }}>Riesgo {h.nivel_riesgo}</div>
            </div>
            
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Hallazgo:</span>
              <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 2, whiteSpace: 'pre-wrap' }}>{h.problema}</p>
            </div>
            
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Efecto:</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'pre-wrap' }}>{h.efecto}</p>
            </div>
            
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Criterio ISO 27001:</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'pre-wrap', paddingLeft: 10, borderLeft: '2px solid var(--accent)' }}>{h.criterio}</p>
            </div>
            
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Recomendación:</span>
              <p style={{ fontSize: 13, color: 'var(--success)', marginTop: 2, whiteSpace: 'pre-wrap' }}>{h.recomendacion}</p>
            </div>
          </div>
        ))
      )}
    </FormCard>
  )
}

// ─── SECCIÓN 8: Conclusiones ─────────────────────────────────────────
const SemaforoCard = ({ label, count, color, bg, Icon }) => (
  <div style={{ flex: 1, background: bg, border: `1px solid ${color}44`, borderRadius: 12, padding: '18px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    {Icon && <Icon size={22} color={color} style={{ opacity: 0.8 }} />}
    <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
    <div style={{ fontSize: 11, fontWeight: 600, color, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
  </div>
)

export function Seccion8Conclusiones({ datos, onSubmit, onBack, isLoading, onShowPdf, num }) {
  const { datosWizard } = useAuditoriaStore()
  const objetivos = datosWizard[2]?.objetivos || []
  const [conclusiones, setConclusiones] = useState([])
  const [recomendaciones, setRecomendaciones] = useState(datos.recomendaciones || 'En base a los hallazgos, se recomienda implementar un plan de remediación priorizando los riesgos Muy Altos y Altos para proteger la infraestructura y los datos de la organización.')
  const { hallazgosGenerados: hallazgos } = evaluarAuditoria(datosWizard)

  const riesgoCounts = {
    muyAlto: hallazgos.filter((h) => h.nivel_riesgo === 'muy alto').length,
    alto: hallazgos.filter((h) => h.nivel_riesgo === 'alto').length,
    medio: hallazgos.filter((h) => h.nivel_riesgo === 'medio').length
  }
  const cumplimiento = Math.max(0, 8 - hallazgos.length)

  const nivelGlobal = riesgoCounts.muyAlto > 0 ? 'CRÍTICO' : riesgoCounts.alto > 0 ? 'ALTO' : riesgoCounts.medio > 0 ? 'MEDIO' : 'CUMPLIMIENTO'
  const nivelStyle = nivelGlobal === 'CRÍTICO' ? { color: 'var(--danger)', bg: 'var(--danger-soft)', border: 'rgba(229,72,77,0.3)' } : nivelGlobal === 'ALTO' ? { color: '#ff7b00', bg: 'rgba(255,123,0,0.08)', border: 'rgba(255,123,0,0.3)' } : nivelGlobal === 'MEDIO' ? { color: 'var(--warning)', bg: 'var(--warning-soft)', border: 'rgba(217,119,6,0.3)' } : { color: 'var(--success)', bg: 'var(--success-soft)', border: 'rgba(34,166,126,0.3)' }

  useEffect(() => {
    const { conclusionesSugeridas } = evaluarAuditoria(datosWizard)
    setConclusiones(objetivos.map((obj, i) => conclusionesSugeridas[i] || ''))
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
    } catch (err) { console.error('Error completando auditoría:', err) }
  }

  return (
    <FormCard titulo="Conclusiones y Recomendaciones" subtitulo="Resumen ejecutivo del estado de seguridad TI" icon={FileCheck} num={num} onSubmit={handleSubmit} onBack={onBack} isLoading={isLoading} isLast>
      <div style={{ background: 'var(--bg-secondary)', border: `1px solid ${nivelStyle.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Estado Global de la Auditoría</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: nivelStyle.color }}>● Nivel {nivelGlobal}</div>
          </div>
          <div style={{ background: nivelStyle.bg, border: `1px solid ${nivelStyle.border}`, borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, color: nivelStyle.color }}>{hallazgos.length} hallazgo{hallazgos.length !== 1 ? 's' : ''} detectado{hallazgos.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <SemaforoCard label="Muy Alto / Crítico" count={riesgoCounts.muyAlto} color="var(--danger)" bg="var(--danger-soft)" Icon={AlertCircle} />
          <SemaforoCard label="Riesgo Alto" count={riesgoCounts.alto} color="#ff7b00" bg="rgba(255,123,0,0.1)" Icon={AlertTriangle} />
          <SemaforoCard label="Riesgo Medio" count={riesgoCounts.medio} color="var(--warning)" bg="var(--warning-soft)" Icon={AlertTriangle} />
          <SemaforoCard label="En Cumplimiento" count={cumplimiento} color="var(--success)" bg="var(--success-soft)" Icon={CheckCircle} />
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, padding: '10px 14px', background: 'var(--success-soft)', border: '1px solid rgba(34,166,126,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle size={14} color="var(--success)" /> Las conclusiones han sido generadas automáticamente.
      </p>

      {objetivos.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No se definieron objetivos en la sección 2.</div>
      ) : (
        objetivos.map((obj, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 6, padding: '5px 12px', background: 'var(--accent-soft)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(71,133,255,0.15)' }}>
              <Target size={13} color="var(--accent)" /> Objetivo {i + 1}: "{obj}"
            </div>
            <textarea className="input-field" rows={3} placeholder={`Conclusión del objetivo ${i + 1}...`} value={conclusiones[i] || ''} onChange={(e) => { const c = [...conclusiones]; while (c.length <= i) c.push(''); c[i] = e.target.value; setConclusiones(c) }} style={{ resize: 'vertical' }} required />
          </div>
        ))
      )}

      <Field label="Recomendaciones generales" required>
        <textarea className="input-field" rows={4} placeholder="Recomendaciones para mejorar la seguridad y gestión TI..." value={recomendaciones} onChange={(e) => setRecomendaciones(e.target.value)} style={{ resize: 'vertical' }} required />
      </Field>
    </FormCard>
  )
}