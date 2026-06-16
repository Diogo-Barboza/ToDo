import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core'
import { TaskCard } from './TaskCard'
import { Column } from './Column'
import { useTasks } from '../../hooks/useTasks'
import type { TaskCreateInput } from '../../types/task'
import styles from './KanbanBoard.module.css'
import { CustomAuthError } from '@supabase/supabase-js'

export function KanbanBoard() {
  const {
    tasks,
    isLoading,
    initialized,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    getTasksByDay
  } = useTasks()

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const customDropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '1'
        }
      }
    })
  }

  const [showWeekend, setShowWeekend] = useState(() => {
    const saved = localStorage.getItem('show-weekend')
    return saved === null ? true : saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('show-weekend', String(showWeekend))
  }, [showWeekend])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

  const handleAddTask = (dayOfWeek: number, input: Omit<TaskCreateInput, 'dayOfWeek'>) => {
    addTask({
      ...input,
      dayOfWeek: dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTaskId(null)

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

  const activeTask = tasks.find(task => task.id === activeTaskId)

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
        onDragStart={handleDragStart}
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
              onEditTask={(taskId, input) => updateTask(taskId, input)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={customDropAnimation}>
          {activeTask ? (
            <div
              style={{
                cursor: 'grabbing',
                transform: 'rotate(2deg)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <TaskCard
                task={activeTask}
                onToggle={() => {}}
                onDelete={() => {}}
                onEditClick={() => {}}
                isOverlay={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
