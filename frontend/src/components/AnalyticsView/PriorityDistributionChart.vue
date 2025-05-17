<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="legend">
      <div v-for="(item, index) in priorityLabels" :key="index" class="legend-item">
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <span>{{ item.label }} ({{ item.count }}件)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTodoTaskStore } from '@/stores/todoTask'

ChartJS.register(ArcElement, Tooltip, Legend)

const todoStore = useTodoTaskStore()

const priorityLabels = [
  { label: '最低', color: '#95a5a6', count: 0 },
  { label: '低い', color: '#3498db', count: 0 },
  { label: '普通', color: '#f1c40f', count: 0 },
  { label: '高い', color: '#e67e22', count: 0 },
  { label: '最高', color: '#e74c3c', count: 0 },
]

const chartData = computed(() => {
  // 優先度ごとのタスク数をカウント
  const counts = [0, 0, 0, 0, 0]
  todoStore.todoTasks.forEach((task) => {
    if (task.priority && task.priority >= 1 && task.priority <= 5) {
      counts[task.priority - 1]++
    }
  })

  // 優先度ラベルのカウントを更新
  priorityLabels.forEach((label, index) => {
    label.count = counts[index]
  })

  return {
    labels: priorityLabels.map((label) => label.label),
    datasets: [
      {
        data: counts,
        backgroundColor: priorityLabels.map((label) => label.color),
        borderWidth: 0,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${value}件`
        },
      },
    },
  },
  cutout: '70%',
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.chart-wrapper {
  height: 250px;
  position: relative;
  margin-bottom: 1rem;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
