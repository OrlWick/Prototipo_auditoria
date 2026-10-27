import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from './store/useStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import WizardPage from './pages/WizardPage'
import PdfPreview from './components/PdfPreview'

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
}

export default function App() {
  const { isAuthenticated } = useAuthStore()
  const [page, setPage] = useState('dashboard') // 'dashboard' | 'admin' | 'wizard' | 'pdf'
  const [auditoriaId, setAuditoriaId] = useState(null)

  const handleIniciarWizard = (id) => {
    setAuditoriaId(id)
    setPage('wizard')
  }

  const handleVerPdf = (id) => {
    setAuditoriaId(id)
    setPage('pdf')
  }

  const handleVolverDashboard = () => {
    setAuditoriaId(null)
    setPage('dashboard')
  }

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.3 }}
        >
          <LoginPage onLogin={() => setPage('dashboard')} />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {page === 'dashboard' ? (
        <motion.div
          key="dashboard"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.25 }}
          style={{ height: '100vh' }}
        >
          <DashboardPage
            onIniciarWizard={handleIniciarWizard}
            onVerPdf={handleVerPdf}
            onNavigateAdmin={() => setPage('admin')}
          />
        </motion.div>
      ) : page === 'admin' ? (
        <motion.div
          key="admin"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.25 }}
          style={{ height: '100vh' }}
        >
          <AdminPage onVolver={() => setPage('dashboard')} />
        </motion.div>
      ) : page === 'wizard' ? (
        <motion.div
          key="wizard"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.25 }}
          style={{ height: '100vh' }}
        >
          <WizardPage auditoriaId={auditoriaId} onVolver={handleVolverDashboard} />
        </motion.div>
      ) : (
        <motion.div
          key="pdf"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.25 }}
          style={{ height: '100vh' }}
        >
          <PdfPreview
            auditoriaId={auditoriaId}
            onVolver={handleVolverDashboard}
            onBackToDashboard={handleVolverDashboard}
            esSoloLectura
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
