import { useEffect } from 'react'
import { useUserStore } from '../stores/userStore'
import { useTaskStore } from '../stores/taskStore'

export function useTasks() {
  const userId = useUserStore(state => state.userId)
  const { tasks, isLoading, initialized, loadTasks, addTask, updateTask, deleteTask, reorderTasks, getTasksByDay } = useTaskStore()

  useEffect(() => {
    if (!initialized) {
      loadTasks(userId)
    }
  }, [userId, initialized, loadTasks])

  return {
    tasks,
    isLoading,
    initialized,
    addTask: (input: Parameters<typeof addTask>[1]) => addTask(userId, input),
    updateTask: (taskId: string, input: Parameters<typeof updateTask>[2]) => updateTask(userId, taskId, input),
    deleteTask: (taskId: string) => deleteTask(userId, taskId),
    reorderTasks: (sourceId: string, destinationId: string, newDay: Parameters<typeof reorderTasks>[3], newOrder: number) =>
      reorderTasks(userId, sourceId, destinationId, newDay, newOrder),
    getTasksByDay: getTasksByDay
  }
}
