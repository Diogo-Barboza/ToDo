import { AppLayout } from './components/Layout/AppLayout'
import { KanbanBoard } from './components/Kanban/KanbanBoard'
import './styles/global.css'

export function App() {
  return (
    <AppLayout>
      <KanbanBoard />
    </AppLayout>
  )
}
