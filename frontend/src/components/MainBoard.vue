<template>
  <div class="main-board">
    <HabitColumn />
    <DailyTaskColumn />
    <TodoColumn />
    <WeeklyReportBox />
  </div>
</template>

<script setup lang="ts">
import HabitColumn from './HabitColumn.vue'
import DailyTaskColumn from './DailyTaskColumn.vue'
import TodoColumn from './TodoColumn.vue'
import WeeklyReportBox from './WeeklyReportBox.vue'
</script>

<style scoped>
.main-board {
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
