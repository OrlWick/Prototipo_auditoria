import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/useStore'
import NetworkBackground from '../components/NetworkBackground'
import CintilloAuditoria from '../components/CintilloAuditoria'

const FEATURES = ['Cumplimiento ISO 27001', 'Inventario de equipos TI', 'Reportes inteligentes']

function useTypewriter(text, speed = 60) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed((prev) => prev + text[idx.current])
        idx.current++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return displayed
}

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)
  const tagline = useTypewriter('Auditoría informática inteligente')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await window.api.login(form.email, form.password)
      if (res.success) {
        setUser(res.user)
        onLogin()
      } else setError(res.error || 'Error desconocido')
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <NetworkBackground />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '24px 40px 60px'
        }}
      >
        {/* Grid decorativo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.025,
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 1000,
            gap: 0,
            borderRadius: 20,
            overflow: 'hidden',
            background: 'rgba(17,22,30,0.6)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'
          }}
        >
          {/* ─── LEFT PANEL: Brand ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              flex: 5.5,
              padding: '52px 48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              background:
                'radial-gradient(ellipse at 30% 40%, rgba(71,133,255,0.06) 0%, transparent 70%)'
            }}
          >
            {/* Gradiente acento izquierdo */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '15%',
                width: 3,
                height: '70%',
                background: 'linear-gradient(180deg, var(--accent), #a78bfa, transparent)',
                borderRadius: 2
              }}
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: 'var(--accent-soft)',
                border: '1px solid rgba(71,133,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}
            >
              <motion.div
                animate={{ rotate: [0, -6, 0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield size={26} color="var(--accent)" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontSize: 36,
                fontWeight: 800,
                marginBottom: 6,
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
              <span className="gradient-text">AuditTech</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontSize: 15,
                color: 'var(--text-muted)',
                marginBottom: 32,
                fontFamily: 'var(--font-mono)',
                minHeight: 22
              }}
            >
              {tagline}
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                style={{ marginLeft: 2 }}
              >
                _
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 14
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: 'var(--accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle size={12} color="var(--accent)" />
                  </div>
                  {f}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ─── RIGHT PANEL: Form ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              flex: 4.5,
              padding: '48px 44px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.02)',
              borderLeft: '1px solid rgba(255,255,255,0.03)',
              position: 'relative'
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em'
                }}
              >
                Acceso al sistema
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Correo electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.25)',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    className="input-field"
                    style={{
                      paddingLeft: 42,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10,
                      height: 46,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.85)',
                      outline: 'none',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                    type="email"
                    placeholder="auditor@empresa.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(71,133,255,0.3)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(71,133,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={15}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.25)',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    className="input-field"
                    style={{
                      paddingLeft: 42,
                      paddingRight: 42,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10,
                      height: 46,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.85)',
                      outline: 'none',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(71,133,255,0.3)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(71,133,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.25)',
                      padding: 4
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    background: 'var(--danger-soft)',
                    border: '1px solid rgba(229,72,77,0.3)',
                    borderRadius: 8,
                    marginBottom: 18
                  }}
                >
                  <AlertCircle size={14} color="var(--danger)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
                </motion.div>
              )}

              <button
                className="btn-primary"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading
                    ? 'rgba(71,133,255,0.4)'
                    : 'linear-gradient(135deg, var(--accent), #3b7de8)',
                  color: '#fff',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #5a94ff, var(--accent))'
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, var(--accent), #3b7de8)'
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%'
                      }}
                    />
                    Verificando...
                  </>
                ) : (
                  <>
                    Ingresar <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                marginTop: 24,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--accent-soft)',
                border: '1px solid rgba(71,133,255,0.15)',
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--text-muted)'
              }}
            >
              Demo:{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>admin@audittech.com</span> /{' '}
              <span style={{ color: 'var(--text-secondary)' }}>admin123</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <CintilloAuditoria />
    </div>
  )
}
