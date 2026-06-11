import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Task, TaskCreateInput, TaskUpdateInput, DayOfWeek } from '../types/task'
import { LocalStorageAdapter } from '../services/storage/localStorage'

const storageAdapter = new LocalStorageAdapter()

interface TaskStoreState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  initialized: boolean

  loadTasks: (userId: string) => Promise<void>
  addTask: (userId: string, input: TaskCreateInput) => Promise<void>
  updateTask: (userId: string, taskId: string, input: TaskUpdateInput) => Promise<void>
  deleteTask: (userId: string, taskId: string) => Promise<void>
  reorderTasks: (userId: string, sourceId: string, destinationId: string, newDayOfWeek: DayOfWeek, newOrder: number) => Promise<void>
  getTasksByDay: (dayOfWeek: DayOfWeek) => Task[]
}

export const useTaskStore = create<TaskStoreState>()(
  subscribeWithSelector((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    initialized: false,

    loadTasks: async (userId: string) => {
      set({ isLoading: true, error: null })
      try {
        const tasks = await storageAdapter.getTasks(userId)
        set({ tasks: tasks.sort((a, b) => a.order - b.order), initialized: true })
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Unknown error', initialized: true })
      } finally {
        set({ isLoading: false })
      }
    },

    addTask: async (userId: string, input: TaskCreateInput) => {
      try {
        const task = await storageAdapter.addTask(userId, input)
        set(state => ({ tasks: [...state.tasks, task] }))
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    },

    updateTask: async (userId: string, taskId: string, input: TaskUpdateInput) => {
      try {
        const updated = await storageAdapter.updateTask(userId, taskId, input)
        set(state => ({
          tasks: state.tasks.map(t => t.id === taskId ? updated : t)
        }))
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    },

    deleteTask: async (userId: string, taskId: string) => {
      try {
        await storageAdapter.deleteTask(userId, taskId)
        set(state => ({ tasks: state.tasks.filter(t => t.id !== taskId) }))
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    },

    reorderTasks: async (userId: string, sourceId: string, _destinationId: string, newDayOfWeek: DayOfWeek, newOrder: number) => {
      const state = get()
      const task = state.tasks.find(t => t.id === sourceId)

      if (!task) return

      const updatedTasks = state.tasks.filter(t => t.id !== sourceId)
      const tasksInDay = updatedTasks
        .filter(t => t.dayOfWeek === newDayOfWeek)
        .sort((a, b) => a.order - b.order)

      tasksInDay.splice(newOrder, 0, { ...task, dayOfWeek: newDayOfWeek })

      const reorderedTasks = tasksInDay.map((t, idx) => ({ ...t, order: idx }))
      const allTasks = [...updatedTasks.filter(t => t.dayOfWeek !== newDayOfWeek), ...reorderedTasks]

      await storageAdapter.saveTasks(userId, allTasks)
      set({ tasks: allTasks })
    },

    getTasksByDay: (dayOfWeek: DayOfWeek) => {
      return get()
        .tasks.filter(t => t.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.order - b.order)
    }
  }))
)
