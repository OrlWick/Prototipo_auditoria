import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useStore'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  User,
  Shield,
  Mail,
  Briefcase,
  Calendar
} from 'lucide-react'

export default function AdminPage({ onVolver }) {
  const { user } = useAuthStore()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cargo: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    setLoading(true)
    try {
      const list = await window.api.listarUsuarios()
      setUsuarios(list || [])
    } catch (_) {
      showToastMsg('Error cargando usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const abrirCrear = () => {
    setEditando(null)
    setForm({ nombre: '', email: '', password: '', cargo: '' })
    setError('')
    setShowModal(true)
  }

  const abrirEditar = (u) => {
    setEditando(u)
    setForm({ nombre: u.nombre, email: u.email, password: '', cargo: u.cargo || '' })
    setError('')
    setShowModal(true)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.email) {
      setError('Nombre y email son obligatorios')
      return
    }
    if (!editando && !form.password) {
      setError('Debes asignar una contraseña')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editando) {
        const res = await window.api.actualizarUsuario(
          editando.id,
          form.nombre,
          form.email,
          form.cargo
        )
        if (!res.success) {
          setError(res.error)
          return
        }
        showToastMsg('Auditor actualizado correctamente')
      } else {
        const res = await window.api.crearAuditor(
          form.nombre,
          form.email,
          form.password,
          form.cargo
        )
        if (!res.success) {
          setError(res.error)
          return
        }
        showToastMsg('Auditor creado correctamente')
      }
      setShowModal(false)
      await cargarUsuarios()
    } catch (_) {
      setError('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar al auditor "${nombre}"?\nSe reasignarán sus auditorías.`)) return
    try {
      const res = await window.api.eliminarUsuario(id)
      if (!res.success) {
        showToastMsg(res.error, 'error')
        return
      }
      showToastMsg('Auditor eliminado')
      await cargarUsuarios()
    } catch (_) {
      showToastMsg('Error al eliminar', 'error')
    }
  }

  const auditores = usuarios.filter((u) => u.rol === 'auditor')
  const admins = usuarios.filter((u) => u.rol === 'admin')

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '4px 8px 28px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 16
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <span
            style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}
            className="gradient-text"
          >
            Admin
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 12px',
              marginBottom: 8
            }}
          >
            Navegación
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={onVolver}
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
              fontSize: 14,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <ArrowLeft size={16} /> Volver al Dashboard
          </motion.button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, paddingLeft: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.nombre}</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28
          }}
        >
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Gestionar Auditores</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Crea, edita y elimina cuentas de auditores
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={abrirCrear}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> Nuevo Auditor
          </button>
        </div>

        {/* Admins section */}
        {admins.length > 0 && (
          <div style={{ marginBottom: 24 }}>
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
              Administradores
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {admins.map((a) => (
                <div
                  key={a.id}
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
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Shield size={16} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.email}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 600
                    }}
                  >
                    Admin
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auditores section */}
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
            Auditores ({auditores.length})
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              Cargando...
            </div>
          ) : auditores.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                borderRadius: 12,
                border: '1px dashed var(--border)'
              }}
            >
              <User size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
              <p>No hay auditores registrados</p>
              <button
                className="btn-primary"
                onClick={abrirCrear}
                style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Crear Primer Auditor
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {auditores.map((a) => (
                <motion.div
                  key={a.id}
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
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(167,139,250,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <User size={16} color="#a78bfa" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{a.nombre}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        display: 'flex',
                        gap: 12,
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={11} /> {a.email}
                      </span>
                      {a.cargo && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Briefcase size={11} /> {a.cargo}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} />{' '}
                        {a.creado_en ? new Date(a.creado_en).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => abrirEditar(a)}
                      style={{
                        padding: '7px 10px',
                        background: 'var(--accent-soft)',
                        border: '1px solid rgba(71,133,255,0.25)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: 'var(--accent)'
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleEliminar(a.id, a.nombre)}
                      className="btn-danger"
                      style={{ padding: '7px 10px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar */}
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
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                  {editando ? 'Editar Auditor' : 'Nuevo Auditor'}
                </h3>
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
              <form onSubmit={handleGuardar}>
                <div style={{ marginBottom: 14 }}>
                  <label className="label">Nombre completo *</label>
                  <input
                    className="input-field"
                    placeholder="Carlos Méndez"
                    value={form.nombre}
                    onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="label">Correo electrónico *</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="auditor@empresa.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="label">Cargo</label>
                  <input
                    className="input-field"
                    placeholder="Auditor de Sistemas"
                    value={form.cargo}
                    onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="label">
                    {editando ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                  </label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required={!editando}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: 'var(--danger-soft)',
                      border: '1px solid rgba(229,72,77,0.3)',
                      borderRadius: 8,
                      marginBottom: 16
                    }}
                  >
                    <AlertCircle size={15} color="var(--danger)" />
                    <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
                  </div>
                )}

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
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Auditor'}
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
