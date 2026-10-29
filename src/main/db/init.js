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
      password_hash TEXT,
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

  // Migraciones
  try {
    db.exec(`ALTER TABLE usuarios ADD COLUMN rol TEXT NOT NULL DEFAULT 'auditor'`)
  } catch (_) {}
  try {
    db.exec(`ALTER TABLE auditorias ADD COLUMN password_hash TEXT`)
  } catch (_) {}

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
    db.prepare(`UPDATE usuarios SET rol = 'admin' WHERE email = ? AND rol = 'auditor'`).run(
      'admin@audittech.com'
    )
  }

  return db
}

// NUEVO: Exportamos la variable 'db' para que auth.js, auditorias.js y reportes.js puedan leer y escribir datos.
export function getDb() {
  if (!db) throw new Error('La base de datos no está inicializada')
  return db
}
