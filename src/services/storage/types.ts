import type { Task, TaskCreateInput, TaskUpdateInput } from '../../types/task'

export interface IStorageAdapter {
  getTasks(userId: string): Promise<Task[]>
  addTask(userId: string, input: TaskCreateInput): Promise<Task>
  updateTask(userId: string, taskId: string, input: TaskUpdateInput): Promise<Task>
  deleteTask(userId: string, taskId: string): Promise<void>
  saveTasks(userId: string, tasks: Task[]): Promise<void>
  clear(userId: string): Promise<void>
}
