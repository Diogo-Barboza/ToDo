import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskCreateInput, TaskUpdateInput } from '../../types/task'
import type { IStorageAdapter } from './types'

const STORAGE_KEY = 'kanban_tasks'

export class LocalStorageAdapter implements IStorageAdapter {
  async getTasks(userId: string): Promise<Task[]> {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  async addTask(userId: string, input: TaskCreateInput): Promise<Task> {
    const tasks = await this.getTasks(userId)
    const maxOrder = Math.max(
      ...tasks.filter(t => t.dayOfWeek === input.dayOfWeek).map(t => t.order),
      -1
    )

    const task: Task = {
      id: uuidv4(),
      userId,
      dayOfWeek: input.dayOfWeek,
      title: input.title,
      time: input.time,
      description: input.description,
      priority: input.priority,
      completed: false,
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    tasks.push(task)
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(tasks))
    return task
  }

  async updateTask(userId: string, taskId: string, input: TaskUpdateInput): Promise<Task> {
    const tasks = await this.getTasks(userId)
    const task = tasks.find(t => t.id === taskId)

    if (!task) throw new Error(`Task ${taskId} not found`)

    Object.assign(task, input, { updatedAt: Date.now() })
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(tasks))
    return task
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const tasks = await this.getTasks(userId)
    const filtered = tasks.filter(t => t.id !== taskId)
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered))
  }

  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(tasks))
  }

  async clear(userId: string): Promise<void> {
    localStorage.removeItem(`${STORAGE_KEY}_${userId}`)
  }
}
