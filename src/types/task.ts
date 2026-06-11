export type Priority = 'high' | 'medium' | 'low'
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface Task {
  id: string
  userId: string
  dayOfWeek: DayOfWeek
  title: string
  time: string
  description: string
  priority: Priority
  completed: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export interface TaskCreateInput {
  title: string
  time: string
  description: string
  priority: Priority
  dayOfWeek: DayOfWeek
}

export interface TaskUpdateInput {
  title?: string
  time?: string
  description?: string
  priority?: Priority
  dayOfWeek?: DayOfWeek
  completed?: boolean
}
