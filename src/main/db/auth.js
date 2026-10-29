import bcrypt from 'bcryptjs'
import { getDb } from './init.js'

export function loginUser(email, password) {
  const db = getDb()
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)
  if (!user) return { success: false, error: 'Credenciales incorrectas' }
  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) return { success: false, error: 'Credenciales incorrectas' }
  const { password_hash, ...safeUser } = user
  return { success: true, user: safeUser }
}

export function getUserById(id) {
  const db = getDb()
  const user = db
    .prepare('SELECT id, nombre, email, cargo, rol, creado_en FROM usuarios WHERE id = ?')
    .get(id)
  return user || null
}

export function createAuditor(nombre, email, password, cargo) {
  const db = getDb()
  try {
    const hash = bcrypt.hashSync(password, 10)
    const result = db
      .prepare(
        `INSERT INTO usuarios (nombre, email, password_hash, cargo, rol) VALUES (?, ?, ?, ?, 'auditor')`
      )
      .run(nombre, email, hash, cargo || 'Auditor')
    return { success: true, id: result.lastInsertRowid }
  } catch (e) {
    if (e.message.includes('UNIQUE'))
      return { success: false, error: 'El email ya está registrado' }
    return { success: false, error: e.message }
  }
}

export function listarUsuarios() {
  const db = getDb()
  return db
    .prepare(
      'SELECT id, nombre, email, cargo, rol, creado_en FROM usuarios ORDER BY creado_en DESC'
    )
    .all()
}

export function actualizarUsuario(id, nombre, email, cargo) {
  const db = getDb()
  try {
    db.prepare(
      `UPDATE usuarios SET nombre = ?, email = ?, cargo = ? WHERE id = ? AND rol = 'auditor'`
    ).run(nombre, email, cargo, id)
    return { success: true }
  } catch (e) {
    if (e.message.includes('UNIQUE'))
      return { success: false, error: 'El email ya está registrado' }
    return { success: false, error: e.message }
  }
}

export function eliminarUsuario(id) {
  const db = getDb()
  try {
    db.prepare(`UPDATE auditorias SET auditor_id = NULL WHERE auditor_id = ?`).run(id)
    db.prepare(`DELETE FROM usuarios WHERE id = ? AND rol = 'auditor'`).run(id)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
