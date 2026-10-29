import { motion } from 'framer-motion'
import { Plus, List, Play, PieChart as PieChartIcon, Users, Shield, User, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'nueva', icon: Plus, label: 'Nueva Auditoría' },
  { id: 'lista', icon: List, label: 'Mis Auditorías' },
  { id: 'continuar', icon: Play, label: 'Continuar' },
  { id: 'reportes', icon: PieChartIcon, label: 'Reportes y CSV' }
]

const ADMIN_NAV_ITEMS = [
  { id: 'gestionar-auditores', icon: Users, label: 'Gestionar Auditores' }
]

export default function DashboardSidebar({ state, onNavigateAdmin }) {
  const { user, isAdmin, tab, setTab, setShowModal, logout } = state

  return (
    <div className="pattern-diagonal" style={{ width: 236, flexShrink: 0, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 8px 28px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={20} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }} className="gradient-text">AuditTech</span>
      </div>

      <nav style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: 8 }}>Menú</div>
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setTab(item.id); if (item.id === 'nueva') setShowModal(true); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === item.id ? 'var(--accent-soft)' : 'transparent', color: tab === item.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: tab === item.id ? 600 : 400, fontSize: 14, marginBottom: 2, transition: 'all 0.15s ease'
            }}
          >
            <item.icon size={16} /> {item.label}
            {tab === item.id && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />}
          </motion.button>
        ))}
        {isAdmin && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 12px 8px' }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: 8 }}>Administración</div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                onClick={() => item.id === 'gestionar-auditores' ? onNavigateAdmin() : setTab(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'var(--text-secondary)', fontWeight: 400, fontSize: 14, marginBottom: 2, transition: 'all 0.15s ease'
                }}
              >
                <item.icon size={16} /> {item.label}
              </motion.button>
            ))}
          </>
        )}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={16} color="white" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nombre}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
              {user?.cargo}
              {isAdmin && <span className="shield shield-blue" style={{ fontSize: 9, padding: '1px 8px' }}>Admin</span>}
            </div>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}