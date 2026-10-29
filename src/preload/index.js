import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Auth
  login: (email, password) => ipcRenderer.invoke('auth:login', email, password),

  // Admin: gestión de auditores
  crearAuditor: (nombre, email, password, cargo) =>
    ipcRenderer.invoke('admin:crear-auditor', nombre, email, password, cargo),
  listarUsuarios: () => ipcRenderer.invoke('admin:listar-usuarios'),
  actualizarUsuario: (id, nombre, email, cargo) =>
    ipcRenderer.invoke('admin:actualizar-usuario', id, nombre, email, cargo),
  eliminarUsuario: (id) => ipcRenderer.invoke('admin:eliminar-usuario', id),

  // Auditorías
  crearAuditoria: (auditorId, titulo, fechaProgramada, password) =>
    ipcRenderer.invoke('auditoria:crear', auditorId, titulo, fechaProgramada, password),
  verificarPasswordAuditoria: (id, password) =>
    ipcRenderer.invoke('verificar-password-auditoria', id, password),
  listarAuditorias: (auditorId, isAdmin) =>
    ipcRenderer.invoke('auditoria:listar', auditorId, isAdmin),
  getAuditoria: (id) => ipcRenderer.invoke('auditoria:get', id),
  guardarSeccion: (auditoriaId, seccion, datos) =>
    ipcRenderer.invoke('auditoria:guardar-seccion', auditoriaId, seccion, datos),
  getSecciones: (auditoriaId) => ipcRenderer.invoke('auditoria:get-secciones', auditoriaId),
  completarAuditoria: (auditoriaId) => ipcRenderer.invoke('auditoria:completar', auditoriaId),
  eliminarAuditoria: (id) => ipcRenderer.invoke('auditoria:eliminar', id),
  getHistorialPredictivo: (auditorId, isAdmin) =>
    ipcRenderer.invoke('auditoria:historial', auditorId, isAdmin),
  getMetricasGlobales: (auditorId, isAdmin) =>
    ipcRenderer.invoke('auditoria:metricas', auditorId, isAdmin),
  exportarCsv: (auditorId, isAdmin) => ipcRenderer.invoke('csv:exportar', auditorId, isAdmin),
  exportarExcel: (auditorId, isAdmin) => ipcRenderer.invoke('excel:exportar', auditorId, isAdmin),

  // PDF
  guardarPdfPath: (auditoriaId, pdfPath) =>
    ipcRenderer.invoke('pdf:guardar-path', auditoriaId, pdfPath),
  descargarPdfDialog: (defaultName) => ipcRenderer.invoke('pdf:descargar-dialog', defaultName),
  guardarPdfNativo: (fileName, fileData) =>
    ipcRenderer.invoke('pdf:guardar-nativo', fileName, fileData),
// WORD

  generarWordEditable: (datos) => ipcRenderer.invoke('word:generar', datos),


  // Archivos
  selectImage: () => ipcRenderer.invoke('file:select-image'),
  copyToUserData: (sourcePath, auditoriaId) =>
    ipcRenderer.invoke('file:copy-to-userData', sourcePath, auditoriaId)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
