<template>
  <div class="analytics-container">
    <h2>タスク分析</h2>
    <div class="analytics-grid">
      <div class="analytics-card">
        <div class="analytics-card-header-1">
          <h3>日課達成度</h3>
          <p>{{ weekRange }}</p>
        </div>
        <div class="chart-wrapper">
          <DailyCompletionChart />
        </div>
      </div>
      <div class="analytics-card">
        <h3>タスク完了率</h3>
        <div class="completion-rate">{{ completionRate }}%</div>
      </div>
      <div class="analytics-card">
        <h3>優先度分布</h3>
        <div class="priority-distribution">
          <!-- 優先度の分布を表示 -->
          <PriorityDistributionChart />
        </div>
      </div>
      <div class="analytics-card">
        <h3>期限切れタスク</h3>
        <div class="overdue-tasks">{{ overdueTasksCount }}件</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoTaskStore } from '@/stores/todoTask'
import DailyCompletionChart from './DailyCompletionChart.vue'
import PriorityDistributionChart from './PriorityDistributionChart.vue'
import { format } from 'date-fns'

const todoStore = useTodoTaskStore()

// 現在日を含む週の月曜〜日曜の日付範囲を計算
function getCurrentWeekRange() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0:日, 1:月, ...
  // 月曜始まり
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${format(monday, 'M/d(月)')}〜${format(sunday, 'M/d(日)')}`
}
const weekRange = getCurrentWeekRange()

const completionRate = computed(() => {
  const total = todoStore.todoTasks.length
  if (total === 0) return 0
  const completed = todoStore.todoTasks.filter((task) => task.completed).length
  return Math.round((completed / total) * 100)
})

const overdueTasksCount = computed(() => {
  const today = new Date()
  return todoStore.todoTasks.filter((task) => {
    if (!task.due_date || task.completed) return false
    return new Date(task.due_date) < today
  }).length
})
</script>

<style scoped>
.analytics-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.analytics-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.analytics-card-header-1 {
  display: flex;
  align-items: center;
}

.analytics-card-header-1 p {
  margin-left: 1rem;
  color: var(--text-color);
}

.completion-rate {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.overdue-tasks {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e74c3c;
  text-align: center;
}
</style>
