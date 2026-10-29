import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react'

export function FormCard({ titulo, subtitulo, icon: Icon, num, children, onSubmit, onBack, isLoading, submitLabel = 'Siguiente', isLast }) {
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
            <button type="button" className="btn-secondary" onClick={onBack} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={15} /> Anterior
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 140 }}>
            {isLoading ? 'Guardando...' : isLast ? (
              <><Save size={15} /> Generar Informe</>
            ) : (
              <>{submitLabel} <ArrowRight size={15} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export function Field({ label, required, children, error }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label className="label">
        {label} {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  )
}

export function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, border: `1px solid ${value === opt.value ? 'var(--accent)' : 'var(--border)'}`, background: value === opt.value ? 'var(--accent-glow)' : 'var(--bg-secondary)', color: value === opt.value ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 14 }}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ display: 'none' }} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

export function CheckboxGroup({ options, selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, border: `1px solid ${(selected || []).includes(opt) ? 'var(--accent)' : 'var(--border)'}`, background: (selected || []).includes(opt) ? 'var(--accent-glow)' : 'var(--bg-secondary)', color: (selected || []).includes(opt) ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13 }}>
          <input type="checkbox" checked={(selected || []).includes(opt)} onChange={() => onChange(opt)} style={{ display: 'none' }} />
          {opt}
        </label>
      ))}
    </div>
  )
}

export function ChipGroup({ label, options, selected, onChange, multi = false, icon }) {
  const isSelected = (val) => (multi ? (selected || []).includes(val) : selected === val)
  const handleClick = (val) => {
    if (multi) {
      const arr = [...(selected || [])]; const idx = arr.indexOf(val)
      idx >= 0 ? arr.splice(idx, 1) : arr.push(val); onChange(arr)
    } else onChange(val === selected ? '' : val)
  }

  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label className="label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>{icon && <span style={{ opacity: 0.7 }}>{icon}</span>} {label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => {
          const sel = isSelected(opt)
          return (
            <button key={opt} type="button" onClick={() => handleClick(opt)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: sel ? 600 : 400, cursor: 'pointer', border: '1px solid', borderColor: sel ? 'var(--accent)' : 'var(--border)', background: sel ? 'var(--accent-soft)' : 'var(--bg-secondary)', color: sel ? 'var(--accent)' : 'var(--text-secondary)', transition: 'all 0.15s ease', transform: sel ? 'scale(1.03)' : 'scale(1)', boxShadow: sel ? '0 0 0 1px rgba(71,133,255,0.3)' : 'none' }}>
              {sel && <CheckCircle size={11} style={{ marginRight: 2, flexShrink: 0 }} />} {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}