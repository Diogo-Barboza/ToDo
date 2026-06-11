import { useState } from 'react'
import { Modal } from '../UI/Modal'
import { Button } from '../UI/Button'
import type { Priority, DayOfWeek } from '../../types/task'
import styles from './TaskForm.module.css'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; time: string; description: string; priority: Priority }) => void
  dayOfWeek: DayOfWeek
}

export function TaskForm({ isOpen, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({ title, time, description, priority })
    setTitle('')
    setTime('')
    setDescription('')
    setPriority('medium')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa" size="sm">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Revisar código"
            autoFocus
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="time">Horário</label>
            <input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label htmlFor="priority">Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
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
          <Button type="submit">Criar Tarefa</Button>
        </div>
      </form>
    </Modal>
  )
}
