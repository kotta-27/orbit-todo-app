<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import type { ChartData } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { format, subDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useDailyTaskStore } from '@/stores/dailyTask'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
)

const dailyStore = useDailyTaskStore()

function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  // 月曜始まり
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// 過去7日間の日付を生成
const dates = getWeekDates()

const weekLabels = ['月', '火', '水', '木', '金', '土', '日']

const chartData = computed<ChartData<'line', number[]>>(() => {
  // 各曜日のタスク数をカウント
  const totalTasks = new Array(7).fill(0)
  const completedTasks = new Array(7).fill(0)

  dailyStore.dailyTasks.forEach((task) => {
    const taskDays = task.days.split(',')
    dates.forEach((date, index) => {
      const dayOfWeek = format(date, 'E', { locale: ja })
      if (taskDays.includes(dayOfWeek)) {
        totalTasks[index]++
        if (task.completed) {
          completedTasks[index]++
        }
      }
    })
  })

  // 達成率を計算
  const completionRates = totalTasks.map((total, index) => {
    if (total === 0) return 0
    return Math.round((completedTasks[index] / total) * 100)
  })

  return {
    labels: weekLabels,
    datasets: [
      {
        label: '日課の達成率',
        data: completionRates,
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 2,
        tension: 0.4,
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
        title: (context: any) => {
          const date = new Date(context[0].label)
          return format(date, 'M月d日 (EEEE)', { locale: ja })
        },
        label: (context: any) => {
          return `達成率: ${context.raw.y}%`
        },
      },
    },
  },
  scales: {
    x: {
      type: 'category' as const,
      time: {
        unit: 'day' as const,
        displayFormats: {
          day: 'M/d',
        },
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (tickValue: string | number) {
          return `${tickValue}%`
        },
      },
    },
  },
}
</script>

<style scoped>
.chart-container {
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
}
</style>
