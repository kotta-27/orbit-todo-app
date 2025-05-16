import { defineStore } from 'pinia'
import axios from 'axios'
import type { DailyTask } from '@/types/task'


export const useDailyTaskStore = defineStore('dailyTask', {
  state: () => ({
    dailyTasks: [] as DailyTask[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchDailyTasks() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:3000/api/v1/daily_tasks')
        this.dailyTasks = res.data
        this.error = null
      } catch (e) {
        this.error = '日課の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async createDailyTask(dailyTask: Omit<DailyTask, 'id'>) {
      this.loading = true
      try {
        const res = await axios.post('http://localhost:3000/api/v1/daily_tasks', { daily_task: dailyTask })
        this.dailyTasks.push(res.data)
        this.error = null
      } catch (e) {
        this.error = '日課の作成に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async updateDailyTask(id: number, dailyTask: Partial<DailyTask>) {
      this.loading = true
      try {
        const res = await axios.put(`http://localhost:3000/api/v1/daily_tasks/${id}`, { daily_task: dailyTask })
        const idx = this.dailyTasks.findIndex(d => d.id === id)
        if (idx !== -1) this.dailyTasks[idx] = res.data
        this.error = null
      } catch (e) {
        this.error = '日課の更新に失敗しました'
      } finally {
        this.loading = false
      }
    },
    async deleteDailyTask(id: number) {
      this.loading = true
      try {
        await axios.delete(`http://localhost:3000/api/v1/daily_tasks/${id}`)
        this.dailyTasks = this.dailyTasks.filter(d => d.id !== id)
        this.error = null
      } catch (e) {
        this.error = '日課の削除に失敗しました'
      } finally {
        this.loading = false
      }
    }
  }
}) 