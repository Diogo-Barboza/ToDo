import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppLayout } from './components/Layout/AppLayout'
import { KanbanBoard } from './components/Kanban/KanbanBoard'
import { LoginPage } from './components/Auth/LoginPage'
import './styles/global.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        Carregando...
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <AppLayout>
      <KanbanBoard />
    </AppLayout>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
