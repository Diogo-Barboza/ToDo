import { supabase } from './supabaseClient'
import type { Task, TaskCreateInput, TaskUpdateInput } from '../../types/task'
import type { IStorageAdapter } from './types'

export class SupabaseAdapter implements IStorageAdapter {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true })

    if (error) throw new Error(error.message)

    return (data ?? []).map(row => ({
      id: row.id,
      userId: row.user_id,
      dayOfWeek: row.day_of_week,
      title: row.title,
      time: row.time,
      description: row.description,
      priority: row.priority,
      completed: row.completed,
      order: row.order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }

  async addTask(userId: string, input: TaskCreateInput): Promise<Task> {
    const existingTasks = await this.getTasks(userId)
    const maxOrder = Math.max(
      ...existingTasks
        .filter(t => t.dayOfWeek === input.dayOfWeek)
        .map(t => t.order),
      -1
    )

    const now = Date.now()
    const newRow = {
      id: crypto.randomUUID(),
      user_id: userId,
      day_of_week: input.dayOfWeek,
      title: input.title,
      time: input.time,
      description: input.description,
      priority: input.priority,
      completed: false,
      order: maxOrder + 1,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(newRow)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      userId: data.user_id,
      dayOfWeek: data.day_of_week,
      title: data.title,
      time: data.time,
      description: data.description,
      priority: data.priority,
      completed: data.completed,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateTask(userId: string, taskId: string, input: TaskUpdateInput): Promise<Task> {
    const updateData: Record<string, unknown> = {
      updated_at: Date.now(),
    }
    if (input.title !== undefined) updateData.title = input.title
    if (input.time !== undefined) updateData.time = input.time
    if (input.description !== undefined) updateData.description = input.description
    if (input.priority !== undefined) updateData.priority = input.priority
    if (input.dayOfWeek !== undefined) updateData.day_of_week = input.dayOfWeek
    if (input.completed !== undefined) updateData.completed = input.completed

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      userId: data.user_id,
      dayOfWeek: data.day_of_week,
      title: data.title,
      time: data.time,
      description: data.description,
      priority: data.priority,
      completed: data.completed,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  }

  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    // Delete all tasks for user then upsert the new list
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId)

    if (deleteError) throw new Error(deleteError.message)

    if (tasks.length === 0) return

    const rows = tasks.map(t => ({
      id: t.id,
      user_id: t.userId,
      day_of_week: t.dayOfWeek,
      title: t.title,
      time: t.time,
      description: t.description,
      priority: t.priority,
      completed: t.completed,
      order: t.order,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    }))

    const { error } = await supabase.from('tasks').insert(rows)
    if (error) throw new Error(error.message)
  }

  async clear(userId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  }
}
