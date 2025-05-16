import { defineStore } from 'pinia'
import axios from 'axios'
import type { HabitTask } from '@/types/task'

export const useHabitTaskStore = defineStore('habit', {
  state: () => ({
    habitTasks: [] as HabitTask[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchHabitTasks() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:3000/api/v1/habit_tasks')
        this.habitTasks = res.data
        this.error = null
      } catch (e) {
        this.error = '習慣の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async createHabitTask(habitTask: Omit<HabitTask, 'id'>) {
      this.loading = true
      try {
        const res = await axios.post('http://localhost:3000/api/v1/habit_tasks', { habit_task: habitTask })
        this.habitTasks.push(res.data)
        this.error = null
      } catch (e) {
        this.error = '習慣の作成に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async updateHabitTask(id: number, habitTask: Partial<HabitTask>) {
      this.loading = true
      try {
        const res = await axios.put(`http://localhost:3000/api/v1/habit_tasks/${id}`, { habit_task: habitTask })
        const idx = this.habitTasks.findIndex(h => h.id === id)
        if (idx !== -1) this.habitTasks[idx] = res.data
        this.error = null
      } catch (e) {
        this.error = '習慣の更新に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async deleteHabitTask(id: number) {
      this.loading = true
      try {
        await axios.delete(`http://localhost:3000/api/v1/habit_tasks/${id}`)
        this.habitTasks = this.habitTasks.filter(h => h.id !== id)
        this.error = null
      } catch (e) {
        this.error = '習慣の削除に失敗しました'
      } finally {
        this.loading = false
      }
    }
  }
}) 