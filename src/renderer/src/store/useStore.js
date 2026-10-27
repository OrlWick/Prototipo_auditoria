import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false })
    }),
    {
      name: 'audittech-auth',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export const useAuditoriaStore = create((set, get) => ({
  auditoriaActual: null,
  seccionActual: 1,
  totalSecciones: 8,
  datosWizard: {},
  isLoading: false,

  setAuditoriaActual: (auditoria) => set({ auditoriaActual: auditoria }),
  setSeccionActual: (n) => set({ seccionActual: n }),
  setDatosWizard: (datos) => set({ datosWizard: datos }),
  updateSeccionDatos: (seccion, datos) => {
    set((state) => ({
      datosWizard: { ...state.datosWizard, [seccion]: datos }
    }))
  },
  setLoading: (v) => set({ isLoading: v }),
  resetWizard: () =>
    set({
      auditoriaActual: null,
      seccionActual: 1,
      datosWizard: {},
      isLoading: false
    }),

  // Guardar sección en DB via IPC
  guardarYAvanzar: async (seccion, datos) => {
    const { auditoriaActual } = get()
    if (!auditoriaActual) return
    set((state) => ({
      datosWizard: { ...state.datosWizard, [seccion]: datos },
      isLoading: true
    }))
    try {
      const result = await window.api.guardarSeccion(auditoriaActual.id, seccion, datos)
      if (result && result.success !== false) {
        set({ seccionActual: seccion + 1 })
      } else {
        console.error('Error guardando sección:', result)
      }
    } catch (error) {
      console.error('Error al guardar sección en DB:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  cargarDesdeDB: async (auditoriaId) => {
    try {
      const [auditoria, secciones] = await Promise.all([
        window.api.getAuditoria(auditoriaId),
        window.api.getSecciones(auditoriaId)
      ])
      if (!auditoria) {
        console.error('No se encontró la auditoría con ID:', auditoriaId)
        return
      }
      // Asegurar que secciones sea un objeto válido
      const seccionesParsed = secciones || {}
      set({
        auditoriaActual: auditoria,
        seccionActual: auditoria.seccion_actual || 1,
        datosWizard: seccionesParsed
      })
    } catch (error) {
      console.error('Error cargando datos desde DB:', error)
    }
  }
}))
