import { useRef, useState, useEffect, useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Modal } from '../UI/Modal'
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

/** Turn plain text with URLs into React nodes where URLs become <a> links */
function linkifyText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // Reset regex lastIndex since we test the same regex
      urlRegex.lastIndex = 0
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLink}
          onClick={e => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onEditClick,
  isOverlay = false
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task }
  })

  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const wasDragging = useRef(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Track when a drag happens so we can skip the click event that follows
  useEffect(() => {
    if (isDragging) {
      wasDragging.current = true
    }
  }, [isDragging])

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

  const handleCardClick = () => {
    // If we just finished a drag, don't open the modal
    if (wasDragging.current) {
      wasDragging.current = false
      return
    }
    setIsViewOpen(true)
  }

  const handleCopyDescription = async () => {
    if (!task.description) return
    try {
      await navigator.clipboard.writeText(task.description)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = task.description
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const linkedDescription = useMemo(
    () => (task.description ? linkifyText(task.description) : null),
    [task.description]
  )

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.card} ${task.completed ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
        onClick={handleCardClick}
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

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title={task.title} size="sm">
        <div className={styles.viewModal}>
          {task.time && (
            <div className={styles.viewTime}>
              🕐 <span>{task.time}</span>
            </div>
          )}
          {task.description ? (
            <div className={styles.viewDescriptionRow}>
              <p className={styles.viewDescription}>{linkedDescription}</p>
              <button
                className={styles.copyButton}
                onClick={handleCopyDescription}
                title={copied ? 'Copiado!' : 'Copiar descrição'}
                aria-label="Copiar descrição"
              >
                {copied ? '✅' : 'Copy'}
              </button>
            </div>
          ) : (
            <p className={styles.viewEmpty}>Sem descrição</p>
          )}
        </div>
      </Modal>
    </>
  )
}
