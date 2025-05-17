<script setup lang="ts">
import { ref } from 'vue'
import MainBoard from '@/components/MainBoard.vue'
import Navbar from '@/components/Navbar.vue'
import AnalyticsView from '@/components/AnalyticsView/AnalyticsView.vue'

const currentTab = ref<'tasks' | 'analytics'>('tasks')

const changeTab = (tab: 'tasks' | 'analytics') => {
  currentTab.value = tab
}
</script>

<template>
  <div class="app">
    <Navbar :current-tab="currentTab" @change-tab="changeTab" />

    <main>
      <div v-if="currentTab === 'tasks'">
        <MainBoard />
      </div>
      <div v-else>
        <AnalyticsView />
      </div>
    </main>

    <footer>
      <p>© 2024 Orbital - シンプルなタスク管理ツール</p>
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  background: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
