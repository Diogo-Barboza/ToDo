import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Task, TaskCreateInput, TaskUpdateInput, DayOfWeek } from '../types/task'
import { SupabaseAdapter } from '../services/storage/supabase'

const storageAdapter = new SupabaseAdapter()

interface TaskStoreState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  initialized: boolean

  loadTasks: (userId: string) => Promise<void>
  addTask: (userId: string, input: TaskCreateInput) => Promise<void>
  updateTask: (userId: string, taskId: string, input: TaskUpdateInput) => Promise<void>
  deleteTask: (userId: string, taskId: string) => Promise<void>
  reorderTasks: (
    userId: string,
    sourceId: string,
    destinationId: string,
    newDayOfWeek: DayOfWeek,
    newOrder: number
  ) => Promise<void>
  finishWeek: (userId: string) => Promise<void>
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
          tasks: state.tasks.map(t => (t.id === taskId ? updated : t))
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

    reorderTasks: async (
      userId: string,
      sourceId: string,
      _destinationId: string,
      newDayOfWeek: DayOfWeek,
      newOrder: number
    ) => {
      const state = get()
      const task = state.tasks.find(t => t.id === sourceId)

      if (!task) return

      const updatedTasks = state.tasks.filter(t => t.id !== sourceId)
      const tasksInDay = updatedTasks
        .filter(t => t.dayOfWeek === newDayOfWeek)
        .sort((a, b) => a.order - b.order)

      tasksInDay.splice(newOrder, 0, { ...task, dayOfWeek: newDayOfWeek })

      const reorderedTasks = tasksInDay.map((t, idx) => ({ ...t, order: idx }))
      const allTasks = [
        ...updatedTasks.filter(t => t.dayOfWeek !== newDayOfWeek),
        ...reorderedTasks
      ]

      set({ tasks: allTasks })

      try {
        await storageAdapter.saveTasks(userId, allTasks)
      } catch (err) {
        console.error('Falha ao salvar a reordenação das tasks', err)
      }
    },

    finishWeek: async (userId: string) => {
      const state = get()
      
      const remainingTasks = state.tasks
        .filter(t => !t.completed)
        .map(t => ({ ...t, dayOfWeek: 1 as DayOfWeek }))

      // Reorder them so they appear sequentially on Monday
      const reorderedRemaining = remainingTasks.map((t, idx) => ({ ...t, order: idx }))

      set({ tasks: reorderedRemaining })

      try {
        await storageAdapter.saveTasks(userId, reorderedRemaining)
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Unknown error' })
        // If it fails, maybe revert or reload tasks? Let's just log or set error for now.
        console.error('Falha ao finalizar semana', err)
      }
    },

    getTasksByDay: (dayOfWeek: DayOfWeek) => {
      return get()
        .tasks.filter(t => t.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.order - b.order)
    }
  }))
)
