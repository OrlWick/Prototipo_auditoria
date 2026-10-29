import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { HardDrive, FileText, CheckCircle, Clock, Search, Plus } from 'lucide-react'
import AuditoriaCard from './AuditoriaCard'
import ReportesView from './ReportesView'

export default function DashboardContent({ state, onVerPdf }) {
  const {
    user, tab, handleExportarCsv, handleExportarExcel, metricas, loadingMetricas,
    loading, borradores, completadas, auditorias, searchTerm, setSearchTerm,
    isAdmin, auditorFilter, setAuditorFilter, auditores, setShowModal,
    handleIntentarContinuar, handleEliminar
  } = state

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Bienvenido, {user?.nombre?.split(' ')[0]}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
        </div>
        {tab === 'reportes' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleExportarCsv} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HardDrive size={16} /> Exportar CSV
            </button>
            <button onClick={handleExportarExcel} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Auditorías en Progreso</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Selecciona una auditoría para continuar donde la dejaste</p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Cargando...</div>
          ) : borradores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 12, border: '1px dashed var(--border)' }} className="pattern-diagonal">
              <Clock size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
              <p>No hay auditorías en progreso</p>
              <button className="btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Crear Nueva Auditoría
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {borradores.map((a) => (
                <AuditoriaCard key={a.id} a={a} onContinuar={handleIntentarContinuar} onEliminar={handleEliminar} onDescargarPdf={onVerPdf} tipo="borrador" />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Auditorías', value: auditorias.length, color: 'var(--accent)', icon: FileText },
              { label: 'Completadas', value: completadas.length, color: 'var(--success)', icon: CheckCircle },
              { label: 'En Proceso', value: borradores.length, color: 'var(--warning)', icon: Clock }
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }} className="pattern-diagonal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Buscar auditoría..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {isAdmin && (
              <select className="input-field" style={{ width: 200, cursor: 'pointer' }} value={auditorFilter} onChange={(e) => setAuditorFilter(e.target.value)}>
                <option value="all">Todos los auditores</option>
                {auditores.filter((a) => a.rol === 'auditor').map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre} ({a.email})</option>
                ))}
              </select>
            )}
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Nueva Auditoría
            </button>
          </div>

          {borradores.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En proceso ({borradores.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {borradores.map((a) => (
                  <AuditoriaCard key={a.id} a={a} onContinuar={handleIntentarContinuar} onEliminar={handleEliminar} onDescargarPdf={onVerPdf} tipo="borrador" />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completadas ({completadas.length})
            </h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Cargando...</div>
            ) : completadas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 12, border: '1px dashed var(--border)' }} className="pattern-diagonal">
                <FileText size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
                <p>No hay auditorías completadas aún</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {completadas.map((a) => (
                  <AuditoriaCard key={a.id} a={a} onEliminar={handleEliminar} onDescargarPdf={onVerPdf} tipo="completada" />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}