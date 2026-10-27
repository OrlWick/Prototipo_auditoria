import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import bcrypt from 'bcryptjs'

let db

export function initDatabase() {
  const dbPath = join(app.getPath('userData'), 'audittech.db')
  db = new Database(dbPath)

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      cargo TEXT DEFAULT 'Auditor',
      rol TEXT NOT NULL DEFAULT 'auditor',
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS auditorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      organizacion TEXT,
      area TEXT,
      auditor_nombre TEXT,
      auditor_id INTEGER NOT NULL,
      estado TEXT DEFAULT 'borrador',
      seccion_actual INTEGER DEFAULT 1,
      fecha_programada TEXT,
      fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_completada DATETIME,
      FOREIGN KEY (auditor_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS secciones_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditoria_id INTEGER NOT NULL,
      seccion INTEGER NOT NULL,
      datos TEXT NOT NULL,
      guardado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(auditoria_id, seccion),
      FOREIGN KEY (auditoria_id) REFERENCES auditorias(id)
    );

    CREATE TABLE IF NOT EXISTS equipos_danados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditoria_id INTEGER NOT NULL,
      equipo_numero INTEGER NOT NULL,
      descripcion TEXT,
      foto_path TEXT,
      FOREIGN KEY (auditoria_id) REFERENCES auditorias(id)
    );

    CREATE TABLE IF NOT EXISTS objetivos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditoria_id INTEGER NOT NULL,
      numero INTEGER NOT NULL,
      texto TEXT NOT NULL,
      conclusion TEXT,
      FOREIGN KEY (auditoria_id) REFERENCES auditorias(id)
    );

    CREATE TABLE IF NOT EXISTS pdf_generados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditoria_id INTEGER NOT NULL UNIQUE,
      pdf_path TEXT NOT NULL,
      generado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (auditoria_id) REFERENCES auditorias(id)
    );
  `)

  // Migrar BD existente: agregar columna rol si falta
  try {
    db.exec(`ALTER TABLE usuarios ADD COLUMN rol TEXT NOT NULL DEFAULT 'auditor'`)
  } catch (_) { /* ya existe */ }

  // Crear usuario demo si no existe
  const existingUser = db
    .prepare('SELECT id FROM usuarios WHERE email = ?')
    .get('admin@audittech.com')
  if (!existingUser) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.prepare(
      `INSERT INTO usuarios (nombre, email, password_hash, cargo, rol) VALUES (?, ?, ?, ?, ?)`
    ).run('Administrador', 'admin@audittech.com', hash, 'Auditor Jefe', 'admin')
  } else {
    // Asegurar que el demo user tenga rol admin
    db.prepare(`UPDATE usuarios SET rol = 'admin' WHERE email = ? AND rol = 'auditor'`).run('admin@audittech.com')
  }

  return db
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
export function loginUser(email, password) {
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)
  if (!user) return { success: false, error: 'Credenciales incorrectas' }
  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) return { success: false, error: 'Credenciales incorrectas' }
  const { password_hash, ...safeUser } = user
  return { success: true, user: safeUser }
}

export function getUserById(id) {
  const user = db.prepare('SELECT id, nombre, email, cargo, rol, creado_en FROM usuarios WHERE id = ?').get(id)
  return user || null
}

export function createAuditor(nombre, email, password, cargo) {
  try {
    const hash = bcrypt.hashSync(password, 10)
    const result = db
      .prepare(`INSERT INTO usuarios (nombre, email, password_hash, cargo, rol) VALUES (?, ?, ?, ?, 'auditor')`)
      .run(nombre, email, hash, cargo || 'Auditor')
    return { success: true, id: result.lastInsertRowid }
  } catch (e) {
    if (e.message.includes('UNIQUE'))
      return { success: false, error: 'El email ya está registrado' }
    return { success: false, error: e.message }
  }
}

export function listarUsuarios() {
  return db
    .prepare("SELECT id, nombre, email, cargo, rol, creado_en FROM usuarios ORDER BY creado_en DESC")
    .all()
}

export function actualizarUsuario(id, nombre, email, cargo) {
  try {
    db.prepare(`UPDATE usuarios SET nombre = ?, email = ?, cargo = ? WHERE id = ? AND rol = 'auditor'`)
      .run(nombre, email, cargo, id)
    return { success: true }
  } catch (e) {
    if (e.message.includes('UNIQUE'))
      return { success: false, error: 'El email ya está registrado' }
    return { success: false, error: e.message }
  }
}

export function eliminarUsuario(id) {
  try {
    // Primero reasignar o eliminar auditorías del usuario
    db.prepare(`UPDATE auditorias SET auditor_id = NULL WHERE auditor_id = ?`).run(id)
    db.prepare(`DELETE FROM usuarios WHERE id = ? AND rol = 'auditor'`).run(id)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

// ─── AUDITORÍAS ─────────────────────────────────────────────────────────────
export function crearAuditoria(auditorId, titulo, fechaProgramada) {
  const result = db
    .prepare(
      `
    INSERT INTO auditorias (auditor_id, titulo, fecha_programada, estado, seccion_actual)
    VALUES (?, ?, ?, 'borrador', 1)
  `
    )
    .run(auditorId, titulo, fechaProgramada)
  return { success: true, id: result.lastInsertRowid }
}

export function getAuditorias(auditorId, isAdmin) {
  const sql = isAdmin
    ? `
    SELECT a.*, u.nombre as auditor_nombre_usr,
    (SELECT pdf_path FROM pdf_generados WHERE auditoria_id = a.id) as pdf_path
    FROM auditorias a
    LEFT JOIN usuarios u ON a.auditor_id = u.id
    ORDER BY a.fecha_inicio DESC
  `
    : `
    SELECT a.*, u.nombre as auditor_nombre_usr,
    (SELECT pdf_path FROM pdf_generados WHERE auditoria_id = a.id) as pdf_path
    FROM auditorias a
    LEFT JOIN usuarios u ON a.auditor_id = u.id
    WHERE a.auditor_id = ?
    ORDER BY a.fecha_inicio DESC
  `
  return isAdmin ? db.prepare(sql).all() : db.prepare(sql).all(auditorId)
}

export function getAuditoriaById(id) {
  return db.prepare(`
    SELECT a.*, u.nombre as auditor_nombre_usr,
    (SELECT pdf_path FROM pdf_generados WHERE auditoria_id = a.id) as pdf_path
    FROM auditorias a
    LEFT JOIN usuarios u ON a.auditor_id = u.id
    WHERE a.id = ?
  `).get(id)
}

export function updateAuditoriaSeccion(auditoriaId, seccion, datos) {
  // Guardar datos de la sección
  db.prepare(
    `
    INSERT INTO secciones_data (auditoria_id, seccion, datos)
    VALUES (?, ?, ?)
    ON CONFLICT(auditoria_id, seccion) DO UPDATE SET datos = excluded.datos, guardado_en = CURRENT_TIMESTAMP
  `
  ).run(auditoriaId, seccion, JSON.stringify(datos))

  // Actualizar sección actual en auditoria
  db.prepare(`UPDATE auditorias SET seccion_actual = MAX(seccion_actual, ?) WHERE id = ?`).run(
    seccion + 1,
    auditoriaId
  )

  return { success: true }
}

export function getSeccionesData(auditoriaId) {
  const rows = db
    .prepare('SELECT * FROM secciones_data WHERE auditoria_id = ? ORDER BY seccion')
    .all(auditoriaId)
  const result = {}
  rows.forEach((r) => {
    result[r.seccion] = JSON.parse(r.datos)
  })
  return result
}

export function completarAuditoria(auditoriaId) {
  db.prepare(
    `UPDATE auditorias SET estado = 'completada', fecha_completada = CURRENT_TIMESTAMP WHERE id = ?`
  ).run(auditoriaId)
  return { success: true }
}

export function guardarPdfPath(auditoriaId, pdfPath) {
  db.prepare(
    `
    INSERT INTO pdf_generados (auditoria_id, pdf_path)
    VALUES (?, ?)
    ON CONFLICT(auditoria_id) DO UPDATE SET pdf_path = excluded.pdf_path, generado_en = CURRENT_TIMESTAMP
  `
  ).run(auditoriaId, pdfPath)
  return { success: true }
}

export function deleteAuditoria(id) {
  db.prepare('DELETE FROM secciones_data WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM equipos_danados WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM objetivos WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM pdf_generados WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM auditorias WHERE id = ?').run(id)
  return { success: true }
}

// ─── ESTADÍSTICAS Y EXPORTACIÓN ─────────────────────────────────────────────
export function getHistorialPredictivo(auditorId, isAdmin) {
  const auditorias = isAdmin
    ? db.prepare('SELECT organizacion, area FROM auditorias').all()
    : db.prepare('SELECT organizacion, area FROM auditorias WHERE auditor_id = ?').all(auditorId)
  const organizaciones = [...new Set(auditorias.map((a) => a.organizacion).filter(Boolean))]
  const areas = [...new Set(auditorias.map((a) => a.area).filter(Boolean))]
  return { organizaciones, areas }
}

export function getMetricasGlobales(auditorId, isAdmin) {
  const auditorias = isAdmin
    ? db.prepare('SELECT * FROM auditorias').all()
    : db.prepare('SELECT * FROM auditorias WHERE auditor_id = ?').all(auditorId)
  const stats = {
    totalAuditorias: auditorias.length,
    auditoriasPorMes: [],
    equiposSanos: 0,
    equiposDanados: 0,
    topSistemasOperativos: {}
  }

  // Agrupar auditorias por mes
  const meses = {}
  auditorias.forEach((a) => {
    const mes = (a.fecha_inicio || '').substring(0, 7) // YYYY-MM
    if (mes) meses[mes] = (meses[mes] || 0) + 1
  })
  stats.auditoriasPorMes = Object.keys(meses)
    .map((m) => ({ mes: m, cantidad: meses[m] }))
    .sort((a, b) => a.mes.localeCompare(b.mes))

  // Procesar JSON de secciones_data
  let secciones
  if (isAdmin) {
    secciones = db
      .prepare(
        `
      SELECT s.auditoria_id, s.seccion, s.datos 
      FROM secciones_data s 
      JOIN auditorias a ON s.auditoria_id = a.id 
      WHERE s.seccion IN (2,3)
    `
      )
      .all()
  } else {
    secciones = db
      .prepare(
        `
      SELECT s.auditoria_id, s.seccion, s.datos 
      FROM secciones_data s 
      JOIN auditorias a ON s.auditoria_id = a.id 
      WHERE a.auditor_id = ? AND s.seccion IN (2,3)
    `
      )
      .all(auditorId)
  }

  secciones.forEach((row) => {
    try {
      const data = JSON.parse(row.datos)
      if (row.seccion === 2) {
        if (data.sistemasOperativos) {
          const soList = data.sistemasOperativos
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
          soList.forEach((so) => {
            stats.topSistemasOperativos[so] = (stats.topSistemasOperativos[so] || 0) + 1
          })
        }
      } else if (row.seccion === 3) {
        const totalParams = secciones.find(
          (s) => s.auditoria_id === row.auditoria_id && s.seccion === 2
        )
        let total = 0
        if (totalParams) {
          const d2 = JSON.parse(totalParams.datos)
          total = parseInt(d2.totalEquipos) || 0
        }
        const danados = parseInt(data.cantidadDanos) || 0
        stats.equiposDanados += danados
        if (total > danados) {
          stats.equiposSanos += total - danados
        }
      }
    } catch (e) {} // eslint-disable-line no-empty
  })

  // Format top OS
  stats.topSistemasOperativos = Object.keys(stats.topSistemasOperativos)
    .map((key) => ({ nombre: key, cantidad: stats.topSistemasOperativos[key] }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  return stats
}

export function generateCsvData(auditorId, isAdmin) {
  const auditorias = isAdmin
    ? db.prepare('SELECT a.id, a.titulo, a.organizacion, a.area, a.estado FROM auditorias a').all()
    : db.prepare('SELECT a.id, a.titulo, a.organizacion, a.area, a.estado FROM auditorias a WHERE a.auditor_id = ?').all(auditorId)
  let csv = 'ID,Titulo,Organizacion,Area,Estado,Total Equipos,Tipo Equipo,SO,RAM,Procesador,Danos Reportados\n'

  for (const a of auditorias) {
    const s3 = db
      .prepare('SELECT datos FROM secciones_data WHERE auditoria_id = ? AND seccion = 3')
      .get(a.id)
    const s4 = db
      .prepare('SELECT datos FROM secciones_data WHERE auditoria_id = ? AND seccion = 4')
      .get(a.id)

    let d3 = {}, d4 = {}
    if (s3) {
      try { d3 = JSON.parse(s3.datos) } catch (e) {} // eslint-disable-line no-empty
    }
    if (s4) {
      try { d4 = JSON.parse(s4.datos) } catch (e) {} // eslint-disable-line no-empty
    }

    const ram = Array.isArray(d3.ram) ? d3.ram.join('; ') : (d3.ram || '')
    const proc = Array.isArray(d3.procesador) ? d3.procesador.join('; ') : (d3.procesador || '')

    csv += `"${a.id}","${a.titulo}","${a.organizacion}","${a.area}","${a.estado}","${d3.totalEquipos || 0}","${d3.tipoEquipo || ''}","${d3.sistemasOperativos || ''}","${ram}","${proc}","${d4.cantidadDanos || 0}"\n`
  }
  return csv
}

export function generateExcelData(auditorId, isAdmin) {
  const auditorias = isAdmin
    ? db.prepare(`SELECT a.*, u.nombre as auditor_nombre_usr FROM auditorias a LEFT JOIN usuarios u ON a.auditor_id = u.id ORDER BY a.fecha_inicio DESC`).all()
    : db.prepare(`SELECT a.*, u.nombre as auditor_nombre_usr FROM auditorias a LEFT JOIN usuarios u ON a.auditor_id = u.id WHERE a.auditor_id = ? ORDER BY a.fecha_inicio DESC`).all(auditorId)

  const rows = []
  for (const a of auditorias) {
    const secciones = db
      .prepare('SELECT seccion, datos FROM secciones_data WHERE auditoria_id = ? ORDER BY seccion')
      .all(a.id)
    const seccionesData = {}
    for (const s of secciones) {
      try {
        seccionesData[s.seccion] = JSON.parse(s.datos)
      } catch (e) {} // eslint-disable-line no-empty
    }

    const d1 = seccionesData[1] || {}
    const d2 = seccionesData[2] || {}
    const d3 = seccionesData[3] || {}
    const d4 = seccionesData[4] || {}
    const d5 = seccionesData[5] || {}
    const d6 = seccionesData[6] || {}
    const d7 = seccionesData[7] || {}
    const d8 = seccionesData[8] || {}

    const ram = Array.isArray(d3.ram) ? d3.ram.join('; ') : (d3.ram || '')
    const proc = Array.isArray(d3.procesador) ? d3.procesador.join('; ') : (d3.procesador || '')

    const equiposDanadosList = (d4.equiposDanados || [])
      .map((eq, i) => `Equipo #${i + 1}: ${eq.descripcion || 'Sin descripción'}`)
      .join('\n')

    const hallazgosList = (d7.hallazgos || [])
      .map((h, i) => `Hallazgo #${i + 1} (${h.nivel_riesgo || 'N/A'}): ${h.problema || ''}`)
      .join('\n')

    const objetivosList = (d2.objetivos || []).join('\n')
    const conclusionesList = (d8.conclusiones || []).join('\n')

    rows.push({
      titulo: a.titulo,
      organizacion: d1.organizacion || '',
      area: d1.area || '',
      auditor: d1.auditor || '',
      estado: a.estado || '',
      fecha_programada: a.fecha_programada || '',
      fecha_inicio: a.fecha_inicio || '',
      fecha_completada: a.fecha_completada || '',
      total_equipos: d3.totalEquipos || '',
      tipo_equipo: d3.tipoEquipo || '',
      sistemas_operativos: d3.sistemasOperativos || '',
      disco_duro: d3.discoDuro || '',
      ram: ram,
      procesador: proc,
      equipos_danados: d4.tieneDanos === 'si' ? 'Sí' : 'No',
      cantidad_danados: d4.cantidadDanos || '',
      detalle_danos: equiposDanadosList,
      observaciones_fisicas: d4.observacionesGenerales || '',
      programas_instalados: d5.programasInstalados || '',
      licencias_validas: d5.tieneLicencias || '',
      detalle_licencias: d5.licenciasDetalle || '',
      // ISO 27001 Section 6
      r6_1_resp_asignado: d6.r6_1_resp_asignado || '',
      r6_1_reconoce: d6.r6_1_reconoce || '',
      r6_1_politicas: d6.r6_1_politicas || '',
      r6_2_formacion: d6.r6_2_formacion || '',
      r6_2_acuerdo: d6.r6_2_acuerdo || '',
      r6_3_registrados: d6.r6_3_registrados || '',
      r6_3_dueno: d6.r6_3_dueno || '',
      r6_3_clasificados: d6.r6_3_clasificados || '',
      r6_4_password: d6.r6_4_password || '',
      r6_4_password_fuerte: d6.r6_4_password_fuerte || '',
      r6_4_bloqueo: d6.r6_4_bloqueo || '',
      r6_4_cuenta_ind: d6.r6_4_cuenta_ind || '',
      r6_4_priv_min: d6.r6_4_priv_min || '',
      r6_5_disco_cifrado: d6.r6_5_disco_cifrado || '',
      r6_5_usb_cifrado: d6.r6_5_usb_cifrado || '',
      r6_5_arch_cifrados: d6.r6_5_arch_cifrados || '',
      hallazgos: hallazgosList,
      objetivos: objetivosList,
      conclusiones: conclusionesList,
      recomendaciones: d8.recomendaciones || ''
    })
  }
   return rows
}
