<script setup lang="ts">
import MainBoard from '@/components/MainBoard.vue'
import { computed } from 'vue'

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']
const today = new Date()
const todayStr = computed(() => {
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  const w = daysOfWeek[today.getDay()]
  return `${y}/${m}/${d}（${w}）`
})
</script>

<template>
  <div class="app">
    <header>
      <div class="header-content">
        <div class="header-date">
          <span>{{ todayStr }}</span>
        </div>
        <img src="@/assets/app-icon.png" alt="アプリアイコン" class="app-logo" />
        <div>
          <h1>タスク管理アプリ</h1>
          <p class="header-subtitle">習慣・日課・ToDoを一元管理</p>
        </div>
      </div>
    </header>

    <main>
      <MainBoard />
    </main>

    <footer>
      <p>© 2024 TODOアプリ - シンプルなタスク管理ツール</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --background-color: #f5f7fa;
  --text-color: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-color: #e9ecef;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, var(--primary-color), #2980b9);
  color: white;
  padding: 1rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  position: relative;
  align-items: center;
  gap: 1.5rem;
  justify-content: center;
}

.header-date {
  position: absolute;
  left: 0;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 600;
  margin-right: 1.5rem;
  min-width: 120px;
  text-align: left;
}

.app-logo {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: white;
  object-fit: cover;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 1rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  header h1 {
    font-size: 2rem;
  }
  .header-subtitle {
    font-size: 1rem;
  }
  main {
    padding: 1rem;
  }
  .app-logo {
    width: 40px;
    height: 40px;
  }
}
</style>
