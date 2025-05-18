// frontend/src/types/task.ts

export interface DailyTask {
  id: number
  title: string
  description: string
  completed: boolean
  days: string
}

export interface HabitTask {
  id: number
  title: string
  description: string
  completed: boolean
  importance: number
}

export interface TodoTask {
  id: number
  title: string
  description: string
  completed: boolean
  due_date: string
  created_at: string
  priority: number
}