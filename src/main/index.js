import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  initDatabase,
  loginUser,
  createAuditor,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  crearAuditoria,
  getAuditorias,
  getAuditoriaById,
  updateAuditoriaSeccion,
  getSeccionesData,
  completarAuditoria,
  guardarPdfPath,
  deleteAuditoria,
  getHistorialPredictivo,
  getMetricasGlobales,
  generateCsvData,
  generateExcelData
} from './database'
import { copyFileSync, mkdirSync, writeFileSync } from 'fs'
import { basename } from 'path'
import ExcelJS from 'exceljs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.audittech')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Inicializar DB
  initDatabase()

  // ── Auth ──────────────────────────────────────────────────────────────
  ipcMain.handle('auth:login', (_, email, password) => loginUser(email, password))

  // ── Admin: gestión de auditores ──────────────────────────────────────
  ipcMain.handle('admin:crear-auditor', (_, nombre, email, password, cargo) =>
    createAuditor(nombre, email, password, cargo)
  )
  ipcMain.handle('admin:listar-usuarios', () => listarUsuarios())
  ipcMain.handle('admin:actualizar-usuario', (_, id, nombre, email, cargo) =>
    actualizarUsuario(id, nombre, email, cargo)
  )
  ipcMain.handle('admin:eliminar-usuario', (_, id) => eliminarUsuario(id))

  // ── Auditorías ────────────────────────────────────────────────────────
  ipcMain.handle('auditoria:crear', (_, auditorId, titulo, fechaProgramada) =>
    crearAuditoria(auditorId, titulo, fechaProgramada)
  )
  ipcMain.handle('auditoria:listar', (_, auditorId, isAdmin) => getAuditorias(auditorId, isAdmin))
  ipcMain.handle('auditoria:get', (_, id) => getAuditoriaById(id))
  ipcMain.handle('auditoria:guardar-seccion', (_, auditoriaId, seccion, datos) =>
    updateAuditoriaSeccion(auditoriaId, seccion, datos)
  )
  ipcMain.handle('auditoria:get-secciones', (_, auditoriaId) => getSeccionesData(auditoriaId))
  ipcMain.handle('auditoria:completar', (_, auditoriaId) => completarAuditoria(auditoriaId))
  ipcMain.handle('auditoria:eliminar', (_, id) => deleteAuditoria(id))
  ipcMain.handle('auditoria:historial', (_, auditorId, isAdmin) => getHistorialPredictivo(auditorId, isAdmin))
  ipcMain.handle('auditoria:metricas', (_, auditorId, isAdmin) => getMetricasGlobales(auditorId, isAdmin))

  // ── Exportación CSV ───────────────────────────────────────────────────
  ipcMain.handle('csv:exportar', async (_, auditorId, isAdmin) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: 'inventario-auditorias.csv',
      filters: [{ name: 'CSV', extensions: ['csv'] }]
    })
    if (filePath) {
      const csvData = generateCsvData(auditorId, isAdmin)
      writeFileSync(filePath, csvData, 'utf-8')
      return filePath
    }
    return null
  })

  // ── Exportación Excel ─────────────────────────────────────────────────
  ipcMain.handle('excel:exportar', async (_, auditorId, isAdmin) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: 'inventario-auditorias.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    })
    if (!filePath) return null

    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'AuditTech'
      workbook.created = new Date()

      const ws = workbook.addWorksheet('Inventario de Auditorías', {
        properties: { tabColor: { argb: '4F8EF7' } }
      })

      const rows = generateExcelData(auditorId, isAdmin)
      if (!rows.length) return null

      const columns = [
        { header: 'Título', key: 'titulo', width: 35 },
        { header: 'Organización', key: 'organizacion', width: 25 },
        { header: 'Área', key: 'area', width: 20 },
        { header: 'Auditor', key: 'auditor', width: 20 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Fecha Programada', key: 'fecha_programada', width: 18 },
        { header: 'Fecha Inicio', key: 'fecha_inicio', width: 18 },
        { header: 'Fecha Completada', key: 'fecha_completada', width: 18 },
        { header: 'Total Equipos', key: 'total_equipos', width: 14 },
        { header: 'Tipo Equipo', key: 'tipo_equipo', width: 15 },
        { header: 'Sistemas Operativos', key: 'sistemas_operativos', width: 25 },
        { header: 'Disco Duro', key: 'disco_duro', width: 14 },
        { header: 'RAM', key: 'ram', width: 10 },
        { header: 'Procesador', key: 'procesador', width: 18 },
        { header: 'Equipos Dañados', key: 'equipos_danados', width: 16 },
        { header: 'Cant. Dañados', key: 'cantidad_danados', width: 14 },
        { header: 'Detalle Daños', key: 'detalle_danos', width: 40 },
        { header: 'Obs. Estado Físico', key: 'observaciones_fisicas', width: 30 },
        { header: 'Programas Instalados', key: 'programas_instalados', width: 30 },
        { header: 'Licencias Válidas', key: 'licencias_validas', width: 16 },
        { header: 'Detalle Licencias', key: 'detalle_licencias', width: 30 },
        // ISO 27001 Section 6
        { header: '6.1 Resp. Asignado', key: 'r6_1_resp_asignado', width: 18 },
        { header: '6.1 Reconoce', key: 'r6_1_reconoce', width: 18 },
        { header: '6.1 Políticas', key: 'r6_1_politicas', width: 18 },
        { header: '6.2 Formación', key: 'r6_2_formacion', width: 18 },
        { header: '6.2 Acuerdo', key: 'r6_2_acuerdo', width: 18 },
        { header: '6.3 Registrados', key: 'r6_3_registrados', width: 18 },
        { header: '6.3 Dueño', key: 'r6_3_dueno', width: 18 },
        { header: '6.3 Clasificados', key: 'r6_3_clasificados', width: 18 },
        { header: '6.4 Contraseña', key: 'r6_4_password', width: 18 },
        { header: '6.4 Fuerte', key: 'r6_4_password_fuerte', width: 18 },
        { header: '6.4 Bloqueo', key: 'r6_4_bloqueo', width: 18 },
        { header: '6.4 Cuenta Ind.', key: 'r6_4_cuenta_ind', width: 18 },
        { header: '6.4 Priv. Mín.', key: 'r6_4_priv_min', width: 18 },
        { header: '6.5 Disco Cifrado', key: 'r6_5_disco_cifrado', width: 18 },
        { header: '6.5 USB Cifrado', key: 'r6_5_usb_cifrado', width: 18 },
        { header: '6.5 Arch. Cifrados', key: 'r6_5_arch_cifrados', width: 18 },
        { header: 'Hallazgos', key: 'hallazgos', width: 50 },
        { header: 'Objetivos', key: 'objetivos', width: 40 },
        { header: 'Conclusiones', key: 'conclusiones', width: 40 },
        { header: 'Recomendaciones', key: 'recomendaciones', width: 40 }
      ]
      ws.columns = columns

      rows.forEach((row) => ws.addRow(row))

      ws.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'top', wrapText: true }
          if (rowNumber === 1) {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F8EF7' } }
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
          }
        })
      })

      ws.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + columns.length)}1` }
      ws.views = [{ state: 'frozen', ySplit: 1 }]

      const buffer = await workbook.xlsx.writeBuffer()
      writeFileSync(filePath, buffer)
      return filePath
    } catch (error) {
      console.error('Error generando Excel:', error)
      return null
    }
  })

  // ── PDF ───────────────────────────────────────────────────────────────
  ipcMain.handle('pdf:guardar-path', (_, auditoriaId, pdfPath) =>
    guardarPdfPath(auditoriaId, pdfPath)
  )
  ipcMain.handle('pdf:descargar-dialog', async (_, defaultName) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: defaultName || 'informe-auditoria.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })
    return filePath || null
  })

  ipcMain.handle('pdf:guardar-nativo', async (_, fileName, fileData) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: fileName || 'informe-auditoria.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })
    if (filePath) {
      writeFileSync(filePath, Buffer.from(fileData))
      return filePath
    }
    return null
  })

  // ── Archivos / Imágenes ───────────────────────────────────────────────
  ipcMain.handle('file:select-image', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }]
    })
    return filePaths?.[0] || null
  })

  ipcMain.handle('file:copy-to-userData', (_, sourcePath, auditoriaId) => {
    try {
      const destDir = join(app.getPath('userData'), 'evidencias', String(auditoriaId))
      mkdirSync(destDir, { recursive: true })
      const destPath = join(destDir, basename(sourcePath))
      copyFileSync(sourcePath, destPath)
      return destPath
    } catch (e) {
      return null
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


