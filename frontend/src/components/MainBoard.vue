<template>
  <div class="main-board">
    <HabitColumn />
    <DailyTaskColumn />
    <TodoColumn />
  </div>
</template>

<script setup lang="ts">
import HabitColumn from './HabitColumn.vue'
import DailyTaskColumn from './DailyTaskColumn.vue'
import TodoColumn from './TodoColumn.vue'
</script>

<style scoped>
.main-board {
  width: 85%;
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
