<template>
  <div class="column habit-col">
    <div class="column-header">
      <span class="column-title">習慣</span>
      <button class="add-task-btn" @click="openCreateModal">＋</button>
    </div>

    <div class="task-list-scroll">
      <div v-for="habit in habitTaskStore.habitTasks">
        <TaskCard
          :key="habit.id"
          :title="habit.title"
          :description="habit.description"
          :completed="habit.completed"
          :importance="habit.importance"
          @toggle="toggleHabitTask(habit)"
          @edit="openEditModal(habit)"
          @delete="deleteHabitTask(habit.id)"
        />
      </div>
    </div>
    <AddTaskModal
      :show="showCreateModal"
      modalTitle="習慣"
      @close="showCreateModal = false"
      @add="handleCreateTask"
    />
    <EditTaskModal
      :show="showEditModal"
      modalTitle="習慣"
      :selectedTask="editTarget"
      @close="showEditModal = false"
      @add="handleEditSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHabitTaskStore } from '@/stores/habitTask'
import AddTaskModal from './AddTaskModal.vue'
import EditTaskModal from './EditTaskModal.vue'
import TaskCard from './TaskCard.vue'
import { useTaskCreate } from '@/compositions/useTaskCreate'
import { useTaskEdit } from '@/compositions/useTaskEdit'
import type { HabitTask } from '@/types/task'
const habitTaskStore = useHabitTaskStore()
const { showCreateModal, openCreateModal, handleCreateTask } = useTaskCreate('habit')
const { showEditModal, editTarget, openEditModal, handleEditSubmit } = useTaskEdit('habit')

onMounted(() => {
  habitTaskStore.fetchHabitTasks()
})

const toggleHabitTask = async (habit: HabitTask) => {
  await habitTaskStore.updateHabitTask(habit.id, {
    title: habit.title,
    description: habit.description,
    completed: !habit.completed,
  })
}

const deleteHabitTask = async (id: number) => {
  await habitTaskStore.deleteHabitTask(id)
}
</script>

<style scoped>
.column {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  min-width: 300px;
  max-width: 350px;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.column-title {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.add-task-btn {
  width: 2rem;
  height: 2rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
  transition: background 0.2s;
}
.add-task-btn:hover {
  background: #217dbb;
}
.task-list-scroll {
  min-height: 75vh;
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 4px;
}
</style>
