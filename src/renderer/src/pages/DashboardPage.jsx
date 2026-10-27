import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  List,
  Clock,
  LogOut,
  User,
  FileText,
  Calendar,
  ChevronRight,
  Trash2,
  Download,
  Play,
  Search,
  CheckCircle,
  X,
  HardDrive,
  PieChart as PieChartIcon,
  Users,
  Shield,
  CalendarDays,
  UserCircle
} from 'lucide-react'
import { useAuthStore, useAuditoriaStore } from '../store/useStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const NAV_ITEMS = [
  { id: 'nueva', icon: Plus, label: 'Nueva Auditoría' },
  { id: 'lista', icon: List, label: 'Mis Auditorías' },
  { id: 'continuar', icon: Play, label: 'Continuar' },
  { id: 'reportes', icon: PieChartIcon, label: 'Reportes y CSV' }
]

const ADMIN_NAV_ITEMS = [
  { id: 'gestionar-auditores', icon: Users, label: 'Gestionar Auditores' }
]

export default function DashboardPage({ onIniciarWizard, onVerPdf, onNavigateAdmin }) {
  const { user, logout } = useAuthStore()
  const { setAuditoriaActual } = useAuditoriaStore()
  const isAdmin = user?.rol === 'admin'
  const [tab, setTab] = useState('lista')
  const [auditorias, setAuditorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [auditorFilter, setAuditorFilter] = useState('all')
  const [auditores, setAuditores] = useState([])

  // Reportes
  const [metricas, setMetricas] = useState(null)
  const [loadingMetricas, setLoadingMetricas] = useState(false)

  // Modal nueva auditoría
  const [showModal, setShowModal] = useState(false)
  const [newForm, setNewForm] = useState({ titulo: '', fechaProgramada: '' })
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    Promise.all([cargarAuditorias(), cargarMetricas(), cargarAuditores()])
  }, [auditorFilter])

  const cargarAuditores = async () => {
    if (!isAdmin) return
    try {
      const list = await window.api.listarUsuarios()
      setAuditores(list || [])
    } catch (_) {}
  }

  const cargarMetricas = async () => {
    setLoadingMetricas(true)
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const res = await window.api.getMetricasGlobales(targetId, isAdmin && auditorFilter === 'all')
      setMetricas(res)
    } catch (error) {
      console.error('Error cargando métricas:', error)
      setMetricas(null)
    } finally {
      setLoadingMetricas(false)
    }
  }

  const handleExportarCsv = async () => {
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const savedPath = await window.api.exportarCsv(targetId, isAdmin && auditorFilter === 'all')
      if (savedPath) {
        showToast(`Inventario exportado a: ${savedPath.split('\\').pop()}`)
      }
    } catch (e) {
      showToast('Error exportando CSV', 'error')
    }
  }

  const handleExportarExcel = async () => {
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const savedPath = await window.api.exportarExcel(targetId, isAdmin && auditorFilter === 'all')
      if (savedPath) {
        showToast(`Inventario exportado a: ${savedPath.split('\\').pop()}`)
      }
    } catch (e) {
      showToast('Error exportando Excel', 'error')
    }
  }

  const cargarAuditorias = async () => {
    setLoading(true)
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const list = await window.api.listarAuditorias(targetId, isAdmin && auditorFilter === 'all')
      setAuditorias(list || [])
    } catch (error) {
      console.error('Error cargando auditorías:', error)
      showToast('Error cargando auditorías', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newForm.titulo.trim()) return
    setCreating(true)
    try {
      const res = await window.api.crearAuditoria(user.id, newForm.titulo, newForm.fechaProgramada)
      if (res.success) {
        setShowModal(false)
        setNewForm({ titulo: '', fechaProgramada: '' })
        await cargarAuditorias()
        showToast('Auditoría creada. Puedes iniciarla desde "Continuar".')
      } else {
        showToast(res.error || 'Error creando auditoría', 'error')
      }
    } catch (error) {
      console.error('Error creando auditoría:', error)
      showToast('Error creando auditoría', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta auditoría y todos sus datos?')) return
    try {
      await window.api.eliminarAuditoria(id)
      await cargarAuditorias()
      showToast('Auditoría eliminada', 'error')
    } catch (error) {
      console.error('Error eliminando auditoría:', error)
      showToast('Error eliminando auditoría', 'error')
    }
  }

  const handleContinuar = (a) => {
    setAuditoriaActual(a)
    onIniciarWizard(a.id)
  }

  const filtradas = useMemo(
    () => auditorias.filter((a) => a.titulo.toLowerCase().includes(searchTerm.toLowerCase())),
    [auditorias, searchTerm]
  )
  const borradores = useMemo(() => filtradas.filter((a) => a.estado === 'borrador'), [filtradas])
  const completadas = useMemo(() => filtradas.filter((a) => a.estado === 'completada'), [filtradas])

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div
        className="pattern-diagonal"
        style={{
          width: 236,
          flexShrink: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 8px 28px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Shield size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }} className="gradient-text">
            AuditTech
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: 8 }}>
            Menú
          </div>
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTab(item.id)
                if (item.id === 'nueva') setShowModal(true)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: tab === item.id ? 'var(--accent-soft)' : 'transparent',
                color: tab === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: tab === item.id ? 600 : 400,
                fontSize: 14,
                marginBottom: 2,
                transition: 'all 0.15s ease'
              }}
            >
              <item.icon size={16} />
              {item.label}
              {tab === item.id && (
                <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
              )}
            </motion.button>
          ))}
          {isAdmin && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '12px 12px 8px' }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: 8 }}>
                Administración
              </div>
              {ADMIN_NAV_ITEMS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.id === 'gestionar-auditores') onNavigateAdmin()
                    else setTab(item.id)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 400,
                    fontSize: 14,
                    marginBottom: 2,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </motion.button>
              ))}
            </>
          )}
        </nav>

        {/* User */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 12px',
              marginBottom: 8
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <User size={16} color="white" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nombre}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                {user?.cargo}
                {isAdmin && (
                  <span className="shield shield-blue" style={{ fontSize: 9, padding: '1px 8px' }}>Admin</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn-ghost"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-muted)'
            }}
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28
          }}
        >
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Bienvenido, {user?.nombre?.split(' ')[0]}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
          {tab === 'reportes' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleExportarCsv}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <HardDrive size={16} /> Exportar CSV
              </button>
              <button
                onClick={handleExportarExcel}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <HardDrive size={16} /> Exportar Excel
              </button>
            </div>
          )}
        </div>

        {tab === 'reportes' ? (
          <ReportesView metricas={metricas} loading={loadingMetricas} />
        ) : tab === 'continuar' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 4
                }}
              >
                Auditorías en Progreso
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Selecciona una auditoría para continuar donde la dejaste
              </p>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                Cargando...
              </div>
            ) : borradores.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 40,
                  color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px dashed var(--border)'
          }}
          className="pattern-diagonal"
        >
          <Clock size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
                <p>No hay auditorías en progreso</p>
                <button
                  className="btn-primary"
                  onClick={() => setShowModal(true)}
                  style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} /> Crear Nueva Auditoría
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {borradores.map((a) => (
                  <AuditoriaCard
                    key={a.id}
                    a={a}
                    onContinuar={handleContinuar}
                    onEliminar={handleEliminar}
                    onDescargarPdf={onVerPdf}
                    tipo="borrador"
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 28
              }}
            >
              {[
                {
                  label: 'Total Auditorías',
                  value: auditorias.length,
                  color: 'var(--accent)',
                  icon: FileText
                },
                {
                  label: 'Completadas',
                  value: completadas.length,
                  color: 'var(--success)',
                  icon: CheckCircle
                },
                { label: 'En Proceso', value: borradores.length, color: 'var(--warning)', icon: Clock }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="pattern-diagonal"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '20px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${stat.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <stat.icon size={22} color={stat.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{stat.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Search + Filtros + Nueva */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                  placeholder="Buscar auditoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {isAdmin && (
                <select
                  className="input-field"
                  style={{ width: 200, cursor: 'pointer' }}
                  value={auditorFilter}
                  onChange={(e) => setAuditorFilter(e.target.value)}
                >
                  <option value="all">Todos los auditores</option>
                  {auditores.filter(a => a.rol === 'auditor').map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre} ({a.email})</option>
                  ))}
                </select>
              )}
              <button
                className="btn-primary"
                onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
              >
                <Plus size={16} /> Nueva Auditoría
              </button>
            </div>

            {/* En progreso */}
            {borradores.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  En proceso ({borradores.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {borradores.map((a) => (
                    <AuditoriaCard
                      key={a.id}
                      a={a}
                      onContinuar={handleContinuar}
                      onEliminar={handleEliminar}
                      onDescargarPdf={onVerPdf}
                      tipo="borrador"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completadas */}
            <div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                  Completadas ({completadas.length})
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  Cargando...
                </div>
              ) : completadas.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px dashed var(--border)'
          }}
          className="pattern-diagonal"
        >
          <FileText size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
                  <p>No hay auditorías completadas aún</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {completadas.map((a) => (
                    <AuditoriaCard
                      key={a.id}
                      a={a}
                      onEliminar={handleEliminar}
                      onDescargarPdf={onVerPdf}
                      tipo="completada"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal nueva auditoría */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card"
              style={{ width: 440, padding: 28 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Nueva Auditoría</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCrear}>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Título de la auditoría *</label>
                  <input
                    className="input-field"
                    placeholder="Ej: Auditoría TI - Área Sistemas Q1 2025"
                    value={newForm.titulo}
                    onChange={(e) => setNewForm((p) => ({ ...p, titulo: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Fecha programada</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar
                      size={15}
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      className="input-field"
                      style={{ paddingLeft: 36 }}
                      type="date"
                      value={newForm.fechaProgramada}
                      onChange={(e) =>
                        setNewForm((p) => ({ ...p, fechaProgramada: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    disabled={creating}
                  >
                    {creating ? 'Creando...' : 'Crear Auditoría'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={toast.type === 'error' ? 'toast toast-error' : 'toast toast-success'}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AuditoriaCard({ a, onContinuar, onEliminar, onDescargarPdf, tipo }) {
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
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
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

function ReportesView({ metricas, loading }) {
  if (loading || !metricas)
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando métricas...
      </div>
    )

  const COLORS = ['var(--accent)', '#a78bfa', 'var(--danger)', 'var(--success)', 'var(--warning)']
  const pctDanados =
    metricas.equiposSanos + metricas.equiposDanados > 0
      ? Math.round(
          (metricas.equiposDanados / (metricas.equiposSanos + metricas.equiposDanados)) * 100
        )
      : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Cards resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="card pattern-diagonal" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Auditorías
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>{metricas.totalAuditorias}</div>
        </div>
        <div className="card pattern-diagonal" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Equipos Revisados
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {metricas.equiposSanos + metricas.equiposDanados}
          </div>
        </div>
        <div className="card pattern-diagonal" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tasa de Daños Reportados
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: pctDanados > 15 ? 'var(--danger)' : 'var(--success)'
            }}
          >
            {pctDanados}%
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Bar Chart - Meses */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Auditorías por Mes</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.auditoriasPorMes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    background: '#1a1d27',
                    border: '1px solid var(--border)',
                    borderRadius: 8
                  }}
                />
                <Bar dataKey="cantidad" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Top SO */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>SO Principales</h3>
          <div
            style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={metricas.topSistemasOperativos}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="cantidad"
                >
                  {metricas.topSistemasOperativos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: '#1a1d27',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'center',
                marginTop: 10
              }}
            >
              {metricas.topSistemasOperativos.map((so, i) => (
                <div
                  key={so.nombre}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: COLORS[i % COLORS.length]
                    }}
                  />
                  {so.nombre} ({so.cantidad})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
