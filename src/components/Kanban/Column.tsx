import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { EditTaskForm } from './EditTaskForm'
import { Button } from '../UI/Button'
import type { Task, DayOfWeek, TaskUpdateInput } from '../../types/task'
import { DAYS_OF_WEEK } from '../../utils/constants'
import styles from './Column.module.css'

interface ColumnProps {
  dayOfWeek: DayOfWeek
  tasks: Task[]
  onAddTask: (input: { title: string; time: string; description: string; priority: 'high' | 'medium' | 'low' }) => void
  onToggleTask: (taskId: string, completed: boolean) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (taskId: string, input: TaskUpdateInput) => void
}

export function Column({ dayOfWeek, tasks, onAddTask, onToggleTask, onDeleteTask, onEditTask }: ColumnProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { setNodeRef } = useDroppable({ id: `column-${dayOfWeek}` })

  const handleAddTask = (input: { title: string; time: string; description: string; priority: 'high' | 'medium' | 'low' }) => {
    onAddTask(input)
    setIsFormOpen(false)
  }

  const today = new Date()
  const jsToday = today.getDay() // 0=Sunday, 1=Monday, ... 6=Saturday
  // Convert JS today to Monday-based (0=Monday..6=Sunday)
  const todayMondayBased = jsToday === 0 ? 6 : jsToday - 1
  const taskDate = new Date(today)
  taskDate.setDate(today.getDate() - todayMondayBased + dayOfWeek)
  const dateStr = taskDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <div className={styles.column} ref={setNodeRef}>
      <div className={styles.header}>
        <h2 className={styles.dayName}>{DAYS_OF_WEEK[dayOfWeek]}</h2>
        <span className={styles.date}>{dateStr}</span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.tasks}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEditClick={(t) => setEditingTask(t)}
            />
          ))}
        </div>
      </SortableContext>

      <Button
        variant="secondary"
        size="sm"
        className={styles.addButton}
        onClick={() => setIsFormOpen(true)}
      >
        + Adicionar
      </Button>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
        dayOfWeek={dayOfWeek}
      />

      {editingTask && (
        <EditTaskForm
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onSubmit={onEditTask}
          task={editingTask}
        />
      )}
    </div>
  )
}
