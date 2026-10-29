// eslint-disable-next-line react/prop-types
import { useDashboard } from '../hooks/useDashboard'
import DashboardSidebar from '../components/DashboardSidebar'
import DashboardContent from '../components/DashboardContent'
import DashboardModals from '../components/DashboardModals'

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ onIniciarWizard, onVerPdf, onNavigateAdmin }) {
  const state = useDashboard(onIniciarWizard)

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      <DashboardSidebar state={state} onNavigateAdmin={onNavigateAdmin} />
      <DashboardContent state={state} onVerPdf={onVerPdf} />
      <DashboardModals state={state} />
    </div>
  )
}