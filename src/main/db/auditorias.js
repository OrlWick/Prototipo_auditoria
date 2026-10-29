import bcrypt from 'bcryptjs'
import { getDb } from './init.js'

export function crearAuditoria(auditorId, titulo, fechaProgramada, password) {
  const db = getDb()
  const hash = password ? bcrypt.hashSync(password, 10) : null
  const result = db
    .prepare(
      `
    INSERT INTO auditorias (auditor_id, titulo, fecha_programada, estado, seccion_actual, password_hash)
    VALUES (?, ?, ?, 'borrador', 1, ?)
  `
    )
    .run(auditorId, titulo, fechaProgramada, hash)
  return { success: true, id: result.lastInsertRowid }
}

export function getAuditorias(auditorId, isAdmin) {
  const db = getDb()
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
  const db = getDb()
  return db
    .prepare(
      `
    SELECT a.*, u.nombre as auditor_nombre_usr,
    (SELECT pdf_path FROM pdf_generados WHERE auditoria_id = a.id) as pdf_path
    FROM auditorias a
    LEFT JOIN usuarios u ON a.auditor_id = u.id
    WHERE a.id = ?
  `
    )
    .get(id)
}

export function updateAuditoriaSeccion(auditoriaId, seccion, datos) {
  const db = getDb()
  db.prepare(
    `
    INSERT INTO secciones_data (auditoria_id, seccion, datos)
    VALUES (?, ?, ?)
    ON CONFLICT(auditoria_id, seccion) DO UPDATE SET datos = excluded.datos, guardado_en = CURRENT_TIMESTAMP
  `
  ).run(auditoriaId, seccion, JSON.stringify(datos))

  db.prepare(`UPDATE auditorias SET seccion_actual = MAX(seccion_actual, ?) WHERE id = ?`).run(
    seccion + 1,
    auditoriaId
  )

  return { success: true }
}

export function getSeccionesData(auditoriaId) {
  const db = getDb()
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
  const db = getDb()
  db.prepare(
    `UPDATE auditorias SET estado = 'completada', fecha_completada = CURRENT_TIMESTAMP WHERE id = ?`
  ).run(auditoriaId)
  return { success: true }
}

export function guardarPdfPath(auditoriaId, pdfPath) {
  const db = getDb()
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
  const db = getDb()
  db.prepare('DELETE FROM secciones_data WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM equipos_danados WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM objetivos WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM pdf_generados WHERE auditoria_id = ?').run(id)
  db.prepare('DELETE FROM auditorias WHERE id = ?').run(id)
  return { success: true }
}

export function verificarPasswordAuditoria(id, password) {
  const db = getDb()
  const row = db.prepare('SELECT password_hash FROM auditorias WHERE id = ?').get(id)
  if (!row) return { success: false, error: 'Auditoría no encontrada' }
  if (!row.password_hash) return { success: true }

  const valid = bcrypt.compareSync(password, row.password_hash)
  return { success: valid }
}
