import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuthStore, useAuditoriaStore } from '../store/useStore'

export function useDashboard(onIniciarWizard) {
  const { user, logout } = useAuthStore()
  const { setAuditoriaActual } = useAuditoriaStore()
  const isAdmin = user?.rol === 'admin'

  const [tab, setTab] = useState('lista')
  const [auditorias, setAuditorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [auditorFilter, setAuditorFilter] = useState('all')
  const [auditores, setAuditores] = useState([])

  const [metricas, setMetricas] = useState(null)
  const [loadingMetricas, setLoadingMetricas] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [newForm, setNewForm] = useState({ titulo: '', fechaProgramada: '', password: '' })
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState(null)

  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [selectedAuditoria, setSelectedAuditoria] = useState(null)
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlocking, setUnlocking] = useState(false)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

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
      console.error(error)
      setMetricas(null)
    } finally {
      setLoadingMetricas(false)
    }
  }

  const cargarAuditorias = async () => {
    setLoading(true)
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const list = await window.api.listarAuditorias(targetId, isAdmin && auditorFilter === 'all')
      setAuditorias(list || [])
    } catch (error) {
      showToast('Error cargando auditorías', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([cargarAuditorias(), cargarMetricas(), cargarAuditores()])
  }, [auditorFilter])

  const handleExportarCsv = async () => {
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const savedPath = await window.api.exportarCsv(targetId, isAdmin && auditorFilter === 'all')
      if (savedPath) showToast(`Inventario exportado a: ${savedPath.split('\\').pop()}`)
    } catch (e) {
      showToast('Error exportando CSV', 'error')
    }
  }

  const handleExportarExcel = async () => {
    try {
      const targetId = isAdmin && auditorFilter !== 'all' ? Number(auditorFilter) : user.id
      const savedPath = await window.api.exportarExcel(targetId, isAdmin && auditorFilter === 'all')
      if (savedPath) showToast(`Inventario exportado a: ${savedPath.split('\\').pop()}`)
    } catch (e) {
      showToast('Error exportando Excel', 'error')
    }
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newForm.titulo.trim() || !newForm.password.trim()) {
      showToast('El título y la contraseña son obligatorios', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await window.api.crearAuditoria(
        user.id,
        newForm.titulo,
        newForm.fechaProgramada,
        newForm.password
      )
      if (res.success) {
        setShowModal(false)
        setNewForm({ titulo: '', fechaProgramada: '', password: '' })
        await cargarAuditorias()
        showToast('Auditoría creada y protegida con éxito.')
      } else {
        showToast(res.error || 'Error creando auditoría', 'error')
      }
    } catch (error) {
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
      showToast('Error eliminando auditoría', 'error')
    }
  }

  const handleIntentarContinuar = (a) => {
    setSelectedAuditoria(a)
    setUnlockPassword('')
    setShowUnlockModal(true)
  }

  const handleDesbloquear = async (e) => {
    e.preventDefault()
    setUnlocking(true)
    try {
      const res = await window.api.verificarPasswordAuditoria(selectedAuditoria.id, unlockPassword)
      if (res.success) {
        setShowUnlockModal(false)
        setAuditoriaActual(selectedAuditoria)
        if (onIniciarWizard) onIniciarWizard(selectedAuditoria.id)
      } else {
        showToast('Contraseña incorrecta', 'error')
      }
    } catch (error) {
      showToast('Error al verificar contraseña', 'error')
    } finally {
      setUnlocking(false)
    }
  }

  const filtradas = useMemo(
    () => auditorias.filter((a) => a.titulo.toLowerCase().includes(searchTerm.toLowerCase())),
    [auditorias, searchTerm]
  )
  const borradores = useMemo(() => filtradas.filter((a) => a.estado === 'borrador'), [filtradas])
  const completadas = useMemo(() => filtradas.filter((a) => a.estado === 'completada'), [filtradas])

  return {
    user,
    logout,
    isAdmin,
    tab,
    setTab,
    loading,
    searchTerm,
    setSearchTerm,
    auditorFilter,
    setAuditorFilter,
    auditores,
    metricas,
    loadingMetricas,
    showModal,
    setShowModal,
    newForm,
    setNewForm,
    creating,
    toast,
    showUnlockModal,
    setShowUnlockModal,
    selectedAuditoria,
    unlockPassword,
    setUnlockPassword,
    unlocking,
    handleExportarCsv,
    handleExportarExcel,
    handleCrear,
    handleEliminar,
    handleIntentarContinuar,
    handleDesbloquear,
    borradores,
    completadas,
    auditorias
  }
}
