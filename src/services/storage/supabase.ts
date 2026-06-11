import type { Task, TaskCreateInput, TaskUpdateInput } from '../../types/task'
import type { IStorageAdapter } from './types'

export class SupabaseAdapter implements IStorageAdapter {
  async getTasks(_userId: string): Promise<Task[]> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async addTask(_userId: string, _input: TaskCreateInput): Promise<Task> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async updateTask(_userId: string, _taskId: string, _input: TaskUpdateInput): Promise<Task> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async deleteTask(_userId: string, _taskId: string): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async saveTasks(_userId: string, _tasks: Task[]): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }

  async clear(_userId: string): Promise<void> {
    throw new Error('SupabaseAdapter not yet implemented')
  }
}
