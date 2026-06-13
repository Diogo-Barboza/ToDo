import { useState } from 'react'
import { Modal } from '../UI/Modal'
import { Button } from '../UI/Button'
import type { Task, Priority, DayOfWeek, TaskUpdateInput } from '../../types/task'
import { DAYS_OF_WEEK } from '../../utils/constants'
import styles from './TaskForm.module.css'

interface EditTaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskId: string, input: TaskUpdateInput) => void
  task: Task
}

export function EditTaskForm({ isOpen, onClose, onSubmit, task }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [time, setTime] = useState(task.time)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(task.dayOfWeek)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit(task.id, {
      title,
      time,
      description,
      priority,
      dayOfWeek
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarefa" size="sm">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="edit-title">Título *</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Revisar código"
            autoFocus
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="edit-time">Horário</label>
            <input id="edit-time" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-priority">Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="edit-day">Dia da Semana</label>
          <select
            id="edit-day"
            value={dayOfWeek}
            onChange={e => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
          >
            {DAYS_OF_WEEK.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="edit-description">Descrição</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Adicione detalhes..."
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}
