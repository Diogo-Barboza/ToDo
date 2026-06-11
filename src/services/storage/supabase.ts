import type { Task, TaskCreateInput, TaskUpdateInput } from '../../types/task'
import type { IStorageAdapter } from './types'

export class SupabaseAdapter implements IStorageAdapter {
  async getTasks(userId: string): Promise<Task[]> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async addTask(userId: string, input: TaskCreateInput): Promise<Task> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async updateTask(userId: string, taskId: string, input: TaskUpdateInput): Promise<Task> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async clear(userId: string): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }
}
