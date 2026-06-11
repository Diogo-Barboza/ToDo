import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Column } from './Column'
import { useTasks } from '../../hooks/useTasks'
import type { TaskCreateInput } from '../../types/task'
import styles from './KanbanBoard.module.css'

export function KanbanBoard() {
  const {
    isLoading,
    initialized,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    getTasksByDay
  } = useTasks()

  const [showWeekend, setShowWeekend] = useState(() => {
    const saved = localStorage.getItem('show-weekend')
    return saved === null ? true : saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('show-weekend', String(showWeekend))
  }, [showWeekend])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
      activationConstraint: {
        delay: 100,
        tolerance: 5
      }
    })
  )

  const handleAddTask = (dayOfWeek: number, input: Omit<TaskCreateInput, 'dayOfWeek'>) => {
    addTask({
      ...input,
      dayOfWeek: dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const sourceTaskId = String(active.id)
    const destinationId = String(over.id)

    const match = destinationId.match(/column-(\d+)/)
    if (!match) return

    const newDayOfWeek = parseInt(match[1], 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const tasksInDay = getTasksByDay(newDayOfWeek)
    const newOrder = tasksInDay.length

    reorderTasks(sourceTaskId, destinationId, newDayOfWeek, newOrder)
  }

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!initialized) {
    return <div className={styles.loading}>Inicializando...</div>
  }

  const daysToShow = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4]

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={showWeekend}
            onChange={e => setShowWeekend(e.target.checked)}
            className={styles.toggleInput}
          />
          Mostrar Fim de Semana
        </label>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className={`${styles.board} ${showWeekend ? styles.sevenCols : styles.fiveCols}`}>
          {daysToShow.map(dayOfWeek => (
            <Column
              key={dayOfWeek}
              dayOfWeek={dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6}
              tasks={getTasksByDay(dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
              onAddTask={input => handleAddTask(dayOfWeek, input)}
              onToggleTask={(taskId, completed) => updateTask(taskId, { completed })}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}
