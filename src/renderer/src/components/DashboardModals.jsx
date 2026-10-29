import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Shield } from 'lucide-react'

export default function DashboardModals({ state }) {
  const {
    showModal, setShowModal, newForm, setNewForm, handleCrear, creating,
    showUnlockModal, setShowUnlockModal, selectedAuditoria, unlockPassword,
    setUnlockPassword, handleDesbloquear, unlocking, toast
  } = state

  return (
    <AnimatePresence>
      {/* Modal Nueva Auditoría */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: 440, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Nueva Auditoría</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCrear}>
              <div style={{ marginBottom: 16 }}>
                <label className="label">Título de la auditoría *</label>
                <input className="input-field" placeholder="Ej: Auditoría TI - Área Sistemas Q1" value={newForm.titulo} onChange={(e) => setNewForm((p) => ({ ...p, titulo: e.target.value }))} required />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="label">Fecha programada</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-field" style={{ paddingLeft: 36 }} type="date" value={newForm.fechaProgramada} onChange={(e) => setNewForm((p) => ({ ...p, fechaProgramada: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="label">Contraseña de protección *</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-field" style={{ paddingLeft: 36 }} type="password" placeholder="Asigna una clave segura" value={newForm.password} onChange={(e) => setNewForm((p) => ({ ...p, password: e.target.value }))} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={creating}>{creating ? 'Creando...' : 'Crear Auditoría'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de Desbloqueo */}
      {showUnlockModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card pattern-diagonal" style={{ width: 400, padding: 28 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warning-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Shield size={24} color="var(--warning)" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Auditoría Protegida</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Ingresa la contraseña para acceder a "{selectedAuditoria?.titulo}"</p>
            </div>
            <form onSubmit={handleDesbloquear}>
              <div style={{ marginBottom: 24 }}>
                <input className="input-field" type="password" placeholder="Contraseña" value={unlockPassword} onChange={(e) => setUnlockPassword(e.target.value)} required autoFocus />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowUnlockModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={unlocking}>{unlocking ? 'Verificando...' : 'Desbloquear'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className={toast.type === 'error' ? 'toast toast-error' : 'toast toast-success'}>
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}