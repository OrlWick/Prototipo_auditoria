import React from 'react'
import {
  Shield,
  Search,
  ClipboardList,
  Monitor,
  Lock,
  BarChart3,
  FileCheck,
  Fingerprint,
  Globe,
  Database,
  ScanLine,
  FileSearch
} from 'lucide-react'

const ICONS = [
  { Icon: Shield, label: 'Seguridad' },
  { Icon: Search, label: ' Auditoría' },
  { Icon: ClipboardList, label: 'Checklist' },
  { Icon: Monitor, label: 'IT' },
  { Icon: Lock, label: 'Cifrado' },
  { Icon: BarChart3, label: 'Reportes' },
  { Icon: FileCheck, label: 'ISO 27001' },
  { Icon: Fingerprint, label: 'Acceso' },
  { Icon: Globe, label: 'Red' },
  { Icon: Database, label: 'Datos' },
  { Icon: ScanLine, label: 'Escaneo' },
  { Icon: FileSearch, label: 'Hallazgos' }
]

export default function CintilloAuditoria() {
  const duplicated = [...ICONS, ...ICONS, ...ICONS]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 44,
        overflow: 'hidden',
        background: 'rgba(10,13,18,0.8)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          height: '100%',
          animation: 'marquee 40s linear infinite',
          whiteSpace: 'nowrap',
          paddingLeft: 24
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.25)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <item.Icon size={14} style={{ opacity: 0.5 }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
