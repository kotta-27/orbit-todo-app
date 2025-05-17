import { defineStore } from 'pinia'
import axios from 'axios'
import type { TodoTask } from '@/types/task'

export const useTodoTaskStore = defineStore('todo', {
  state: () => ({
    todoTasks: [] as TodoTask[],
    loading: false,
    error: null as string | null,
    sortBy: 'priority' as 'created_at' | 'priority' | 'due_date' | 'completed'
  }),

  getters: {
    sortedTasks: (state) => {
      const tasks = [...state.todoTasks]
      
      switch (state.sortBy) {
        case 'created_at':
          // 追加された順（デフォルト）
          return tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        case 'priority':
          // 優先度順（高い順）
          return tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0))
        
        case 'due_date':
          // 期限順（近い順）
          return tasks.sort((a, b) => {
            // 期限なしは最後に
            if (!a.due_date) return 1
            if (!b.due_date) return -1
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          })
        
        case 'completed':
          // 完了済み順（完了済みは最後に）
          return tasks.sort((a, b) => (b.completed ? 1 : -1) - (a.completed ? 1 : -1))
          
          
        default:
          return tasks
      }
    }
  },

  actions: {
    setSortBy(sort: 'created_at' | 'priority' | 'due_date' | 'completed') {
      this.sortBy = sort
    },
    
    async fetchTodos() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:3000/api/v1/todo_tasks')
        this.todoTasks = response.data
        this.error = null
      } catch (err) {
        this.error = 'TODOの取得に失敗しました'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createTodoTask(todoTask: { title: string; description: string; completed: boolean; due_date?: string; priority?: number }) {
      this.loading = true
      try {
        const response = await axios.post('http://localhost:3000/api/v1/todo_tasks', { todo_task: todoTask })
        this.todoTasks.push(response.data)
        this.error = null
      } catch (err) {
        this.error = 'TODOの作成に失敗しました'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async updateTodoTask(id: number, todoTask: Partial<TodoTask>) {
      this.loading = true
      try {
        const response = await axios.put(`http://localhost:3000/api/v1/todo_tasks/${id}`, { todo_task: todoTask })
        const index = this.todoTasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.todoTasks[index] = response.data
        }
        this.error = null
      } catch (err) {
        this.error = 'TODOの更新に失敗しました'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async deleteTodoTask(id: number) {
      this.loading = true
      try {
        await axios.delete(`http://localhost:3000/api/v1/todo_tasks/${id}`)
        this.todoTasks = this.todoTasks.filter(todo => todo.id !== id)
        this.error = null
      } catch (err) {
        this.error = 'TODOの削除に失敗しました'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}) 