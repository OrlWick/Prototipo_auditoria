import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { reglasAuditoria } from '../config/reglasAuditoria'

// Función para limpiar texto (quitar acentos y mayúsculas)
const normalize = (text) => 
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy tu asistente de auditoría. Pregúntame sobre contraseñas, respaldos, licencias o infraestructura y te diré qué norma ISO aplica.' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const buscarRespuesta = (pregunta) => {
    const query = normalize(pregunta)
    const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'que', 'de', 'y', 'en', 'para', 'con', 'si', 'no', 'como', 'hacer', 'pasa']
    const words = query.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w))

    let bestMatch = null
    let maxHits = 0

    // Buscar en el nuevo formato súper detallado
    reglasAuditoria.evaluacionPorArea.forEach(area => {
      area.hallazgosPredeterminados.forEach(h => {
        const textToSearch = normalize(`${area.nombre} ${h.hallazgo} ${h.criterio} ${h.efecto}`)
        let hits = 0
        
        words.forEach(w => {
          if (textToSearch.includes(w)) hits++
        })

        // Mejoras predictivas para tu sistema
        if ((words.includes('password') || words.includes('clave') || words.includes('contraseña')) && h.campoAsociado.includes('password')) hits += 2
        if ((words.includes('pirata') || words.includes('crack') || words.includes('licencia')) && h.campoAsociado === 'tieneLicencias') hits += 2
        if ((words.includes('backup') || words.includes('copia') || words.includes('respaldo')) && h.campoAsociado.includes('7_1_')) hits += 2
        if ((words.includes('fuego') || words.includes('incendio') || words.includes('extintor')) && h.campoAsociado === 'r6_6_2_extintores') hits += 2

        if (hits > maxHits) {
          maxHits = hits
          bestMatch = { area, hallazgo: h }
        }
      })
    })

    if (bestMatch && maxHits > 0) {
      const { area, hallazgo } = bestMatch
      return `Según la norma **${hallazgo.criterio.split(':')[0]}**, esto corresponde al área de **${area.nombre}** (Riesgo ${hallazgo.nivel_riesgo.toUpperCase()}).\n\n⚠️ **El efecto de no cumplirlo es:** ${hallazgo.efecto}\n\n💡 **Recomendación:** ${hallazgo.recomendacion}`
    } else {
      return "No encontré una norma específica para eso. Intenta usar palabras clave como 'contraseñas', 'antivirus', 'respaldo', 'licencias' o 'cifrado'."
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput('')

    // Simular un pequeño retraso de "pensamiento"
    setTimeout(() => {
      const botResponse = buscarRespuesta(userMsg)
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }])
    }, 600)
  }

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Ventana del Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="card pattern-diagonal"
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 360,
              height: 500,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Header del Chat */}
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Asistente ISO 27001</div>
                  <div style={{ fontSize: 11, color: 'var(--success)' }}>En línea</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-ghost" style={{ padding: 6, color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Mensajes */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  {m.sender === 'bot' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <Bot size={14} color="var(--accent)" />
                    </div>
                  )}
                  <div style={{
                    background: m.sender === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '10px 14px',
                    borderRadius: 14,
                    borderTopRightRadius: m.sender === 'user' ? 4 : 14,
                    borderTopLeftRadius: m.sender === 'bot' ? 4 : 14,
                    fontSize: 13,
                    lineHeight: 1.5,
                    border: m.sender === 'bot' ? '1px solid var(--border)' : 'none',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: ¿Qué pasa si uso software pirata?"
                className="input-field"
                style={{ flex: 1, borderRadius: 20, paddingLeft: 16 }}
              />
              <button type="submit" disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? 'var(--accent)' : 'var(--border)', color: 'white', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <Send size={16} style={{ marginLeft: -2 }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}