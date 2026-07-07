import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  pointerWithin,
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

export function KanbanBoard() {
  const {
    tasks,
    isLoading,
    initialized,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    getTasksByDay,
    finishWeek
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      // Sunday is 0, 23 hours, 50 minutes
      if (now.getDay() === 0 && now.getHours() === 23 && now.getMinutes() === 50) {
        const lastReset = localStorage.getItem('lastWeeklyReset')
        const todayStr = now.toISOString().split('T')[0] // 'YYYY-MM-DD'
        
        if (lastReset !== todayStr) {
          finishWeek()
          localStorage.setItem('lastWeeklyReset', todayStr)
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [finishWeek])

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

    const columnMatch = destinationId.match(/column-(\d+)/)
    
    let newDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
    let newOrder = 0

    if (columnMatch) {
      newDayOfWeek = parseInt(columnMatch[1], 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6
      const tasksInDay = getTasksByDay(newDayOfWeek).filter(t => t.id !== sourceTaskId)
      newOrder = tasksInDay.length
    } else {
      const targetTask = tasks.find(t => t.id === destinationId)
      if (!targetTask) return
      
      newDayOfWeek = targetTask.dayOfWeek
      const tasksInNewDay = getTasksByDay(newDayOfWeek)
      const targetIndex = tasksInNewDay.findIndex(t => t.id === destinationId)
      newOrder = targetIndex
    }

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
        collisionDetection={pointerWithin}
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
