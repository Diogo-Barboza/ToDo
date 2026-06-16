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
  onEditClick: (task: Task) => void
  isOverlay?: boolean
}

export function TaskCard({ task, onToggle, onDelete, onEditClick, isOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task }
  })

  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const style = {
    transform: isOverlay ? undefined : CSS.Transform.toString(transform),
    transition: isOverlay ? undefined : (transition ?? 'transform 200ms ease'),
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Deletar esta tarefa?')) {
      onDelete(task.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditClick(task)
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
          onPointerDown={e => e.stopPropagation()}
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
          <div className={styles.cardActions}>
            <button
              className={styles.editButton}
              onClick={handleEdit}
              onPointerDown={e => e.stopPropagation()}
              aria-label="Editar"
            >
              ✏️
            </button>
            <button
              ref={deleteButtonRef}
              className={styles.deleteButton}
              onClick={handleDelete}
              onPointerDown={e => e.stopPropagation()}
              aria-label="Deletar"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
