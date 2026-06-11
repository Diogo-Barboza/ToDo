import { useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../types/task'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  task: Task
  onToggle: (taskId: string, completed: boolean) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  })
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Deletar esta tarefa?')) {
      onDelete(task.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${task.completed ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={styles.content}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={e => onToggle(task.id, e.target.checked)}
          className={styles.checkbox}
          onClick={e => e.stopPropagation()}
        />

        <div className={styles.main}>
          <div className={styles.header}>
            <h3 className={styles.title}>{task.title}</h3>
            {task.time && <span className={styles.time}>{task.time}</span>}
          </div>

          {task.description && <p className={styles.description}>{task.description}</p>}
        </div>

        <div className={styles.footer}>
          <div
            className={styles.priorityDot}
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            title={PRIORITY_LABELS[task.priority]}
          />
          <button
            ref={deleteButtonRef}
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Deletar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
