import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  CalendarDays,
  UserCircle,
  ChevronRight,
  Play,
  Download,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'

export default function AuditoriaCard({ a, onContinuar, onEliminar, onDescargarPdf, tipo }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: tipo === 'completada' ? 'var(--success-soft)' : 'var(--warning-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {tipo === 'completada' ? (
          <CheckCircle size={18} color="var(--success)" />
        ) : (
          <Clock size={18} color="var(--warning)" />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {a.titulo}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <CalendarDays size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
          <span>
            {a.fecha_programada ||
              (a.fecha_inicio ? format(new Date(a.fecha_inicio), 'dd/MM/yyyy') : 'Sin fecha')}
          </span>
          <UserCircle size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
          <span>{a.auditor_nombre_usr}</span>
          {tipo === 'borrador' && (
            <>
              <ChevronRight size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
              <span>Sección {a.seccion_actual}/7</span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {tipo === 'borrador' && onContinuar && (
          <button
            onClick={() => onContinuar(a)}
            className="btn-primary"
            style={{
              padding: '7px 14px',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Play size={13} /> Continuar
          </button>
        )}
        {tipo === 'completada' && (
          <button
            onClick={() => onDescargarPdf && onDescargarPdf(a.id)}
            className="btn-secondary"
            style={{ padding: '7px 12px' }}
          >
            <Download size={15} />
          </button>
        )}
        <button
          onClick={() => onEliminar(a.id)}
          className="btn-danger"
          style={{ padding: '7px 10px' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
