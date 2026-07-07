import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTaskStore } from '../stores/taskStore'

export function useTasks() {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const { tasks, isLoading, initialized, loadTasks, addTask, updateTask, deleteTask, reorderTasks, getTasksByDay, finishWeek } = useTaskStore()

  useEffect(() => {
    if (userId && !initialized) {
      loadTasks(userId)
    }
  }, [userId, initialized, loadTasks])

  // Reset initialized when user changes (logout/login)
  useEffect(() => {
    if (!userId) {
      useTaskStore.setState({ tasks: [], initialized: false, error: null })
    }
  }, [userId])

  return {
    tasks,
    isLoading,
    initialized,
    addTask: (input: Parameters<typeof addTask>[1]) => addTask(userId, input),
    updateTask: (taskId: string, input: Parameters<typeof updateTask>[2]) => updateTask(userId, taskId, input),
    deleteTask: (taskId: string) => deleteTask(userId, taskId),
    reorderTasks: (sourceId: string, destinationId: string, newDay: Parameters<typeof reorderTasks>[3], newOrder: number) =>
      reorderTasks(userId, sourceId, destinationId, newDay, newOrder),
    finishWeek: () => finishWeek(userId),
    getTasksByDay: getTasksByDay
  }
}

