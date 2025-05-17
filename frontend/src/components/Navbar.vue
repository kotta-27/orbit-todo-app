<template>
  <nav class="navbar">
    <div class="navbar-time-container">
      <p class="navbar-time">{{ nowString }}</p>
    </div>
    <div class="navbar-brand">
      <img src="@/assets/app-new-icon.png" alt="アプリアイコン" class="navbar-logo" />
      <h1 class="navbar-brand-title">Orbital</h1>
      <p>
        <span class="navbar-brand-subtitle">毎日を、軌道にのせる。</span>
      </p>
    </div>

    <div class="navbar-tabs">
      <button
        class="tab-button"
        :class="{ active: currentTab === 'tasks' }"
        @click="$emit('change-tab', 'tasks')"
      >
        タスク
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'analytics' }"
        @click="$emit('change-tab', 'analytics')"
      >
        分析
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  currentTab: 'tasks' | 'analytics'
}>()

const emit = defineEmits<{
  (e: 'change-tab', tab: 'tasks' | 'analytics'): void
}>()

const day = new Date().toLocaleDateString('ja-JP', {
  weekday: 'long',
})
const dayLabel = day[0]

const nowString = ref('')
let timer: number | undefined

function updateNow() {
  const now = new Date()
  const week = ['日', '月', '火', '水', '木', '金', '土']
  nowString.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${week[now.getDay()]}) ${now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}`
}

onMounted(() => {
  updateNow()
  timer = window.setInterval(updateNow, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, var(--primary-color), #2980b9);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid white;
  background-color: white;
}

.navbar-brand-title {
  color: white;
  font-size: 1.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  margin: 0;
}

.navbar-brand-subtitle {
  color: white;
  font-size: 0.8rem;
  margin: 0;
}

.navbar-time-container {
  width: 20%;
  margin: 0;
}

.navbar-time-container p {
  font-size: 1rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.navbar-tabs {
  display: flex;
  gap: 1rem;
}

.tab-button {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
  background: white;
  color: var(--primary-color);
  font-weight: bold;
}

.navbar-right {
  margin-left: auto;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.navbar-time {
  font-family: 'Menlo', 'Consolas', monospace;
  font-size: 1.1rem;
}
</style>
