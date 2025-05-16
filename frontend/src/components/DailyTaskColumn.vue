<template>
  <div class="column daily-col">
    <div class="column-header">
      <span class="column-title">日課</span>
      <div class="daily-progress-container">
        <div class="daily-progress">
          {{ todayTasks.filter((t) => t.completed).length }} / {{ todayTasks.length }}
          <span
            v-if="todayTasks.length > 0 && todayTasks.every((t) => t.completed)"
            class="material-icons done-icon"
          >
            check_circle
          </span>
        </div>
      </div>
      <button class="add-task-btn" @click="openCreateModal">＋</button>
    </div>
    <div v-for="task in todayTasks">
      <TaskCard
        :title="task.title"
        :description="task.description"
        :completed="task.completed"
        :days="task.days"
        @toggle="toggleDailyTask(task)"
        @edit="openEditModal(task)"
        @delete="deleteDailyTask(task.id)"
      />
    </div>

    <AddTaskModal
      :show="showCreateModal"
      modalTitle="日課"
      showWeekdays
      @close="showCreateModal = false"
      @add="handleCreateTask"
    />
    <EditTaskModal
      :show="showEditModal"
      modalTitle="日課"
      :selectedTask="editTarget"
      showWeekdays
      @close="showEditModal = false"
      @add="handleEditSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDailyTaskStore } from '@/stores/dailyTask'
import AddTaskModal from './AddTaskModal.vue'
import EditTaskModal from './EditTaskModal.vue'
import TaskCard from './TaskCard.vue'
import type { DailyTask } from '@/types/task'
import { useTaskCreate } from '@/compositions/useTaskCreate'
import { useTaskEdit } from '@/compositions/useTaskEdit'

const dailyTaskStore = useDailyTaskStore()
const { showCreateModal, openCreateModal, handleCreateTask } = useTaskCreate('daily')
const { showEditModal, editTarget, openEditModal, handleEditSubmit } = useTaskEdit('daily')

const getToday = () => {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[new Date().getDay()]
}

const todayTasks = computed(() =>
  dailyTaskStore.dailyTasks.filter((task) => task.days.split(',').includes(getToday())),
)

onMounted(() => {
  dailyTaskStore.fetchDailyTasks()
})

const toggleDailyTask = async (task: DailyTask) => {
  await dailyTaskStore.updateDailyTask(task.id, {
    title: task.title,
    description: task.description,
    completed: !task.completed,
    days: task.days,
  })
}

const deleteDailyTask = async (id: number) => {
  await dailyTaskStore.deleteDailyTask(id)
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
.daily-progress-container {
  width: 90px;
  display: flex;
  padding: 0.2rem 0.5rem;
}
.daily-progress {
  width: 70px;
  color: #6c757d;
}
.done-icon {
  color: #28a745;
  font-size: 1.4rem;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
