<template>
  <div class="column todo-col">
    <div class="column-header">
      <span class="column-title">ToDo</span>
      <button class="add-task-btn" @click="openCreateModal">＋</button>
    </div>

    <div class="sort-options">
      <button
        class="sort-btn"
        :class="{ active: todoStore.sortBy === 'priority' }"
        @click="setSort('priority')"
      >
        優先度順
      </button>
      <button
        class="sort-btn"
        :class="{ active: todoStore.sortBy === 'due_date' }"
        @click="setSort('due_date')"
      >
        期限順
      </button>
      <button
        class="sort-btn"
        :class="{ active: todoStore.sortBy === 'created_at' }"
        @click="setSort('created_at')"
      >
        追加順
      </button>
      <div class="separator"></div>
      <button
        class="completed-btn"
        :class="{ active: todoStore.sortBy === 'completed' }"
        @click="setSort('completed')"
      >
        完了済み
      </button>
    </div>

    <div class="task-list-scroll">
      <div v-for="todo in visibleTasks" :key="todo.id">
        <TaskCard
          :title="todo.title"
          :description="todo.description"
          :completed="todo.completed"
          :date="formatDate(todo.created_at)"
          :due_date="todo.due_date"
          :priority="todo.priority"
          @toggle="toggleTodoTask(todo)"
          @edit="openEditModal(todo)"
          @delete="deleteTodoTask(todo.id)"
        />
      </div>
    </div>
    <AddTaskModal
      :show="showCreateModal"
      modalTitle="ToDo"
      @close="showCreateModal = false"
      @add="handleCreateTask"
    />
    <EditTaskModal
      :show="showEditModal"
      modalTitle="ToDo"
      :selectedTask="editTarget"
      @close="showEditModal = false"
      @add="handleEditSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTodoTaskStore } from '@/stores/todoTask'
import AddTaskModal from './AddTaskModal.vue'
import EditTaskModal from './EditTaskModal.vue'
import TaskCard from './TaskCard.vue'
import { useTaskCreate } from '@/compositions/useTaskCreate'
import { useTaskEdit } from '@/compositions/useTaskEdit'
import type { TodoTask } from '@/types/task'

const todoStore = useTodoTaskStore()
const { showCreateModal, openCreateModal, handleCreateTask } = useTaskCreate('todo')
const { showEditModal, editTarget, openEditModal, handleEditSubmit } = useTaskEdit('todo')

onMounted(() => {
  todoStore.fetchTodos()
})

const setSort = (sortBy: 'created_at' | 'priority' | 'due_date' | 'completed') => {
  todoStore.setSortBy(sortBy)
}

const toggleTodoTask = async (todo: TodoTask) => {
  await todoStore.updateTodoTask(todo.id, {
    title: todo.title,
    description: todo.description,
    completed: !todo.completed,
    priority: todo.priority,
    due_date: todo.due_date,
  })
}

const deleteTodoTask = async (id: number) => {
  await todoStore.deleteTodoTask(id)
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 完了済みのタスクを非表示にする。
// TodoStoreのsortByがcompletedの場合は、完了済みのタスクを表示する。
const visibleTasks = computed(() => {
  if (todoStore.sortBy === 'completed') {
    return todoStore.sortedTasks.filter((t) => t.completed)
  } else {
    return todoStore.sortedTasks.filter((t) => !t.completed)
  }
})
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
  min-height: 70vh;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 4px;
}
.sort-options {
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.sort-btn {
  background: #f1f1f1;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.sort-btn:hover {
  background: #e4e4e4;
}
.sort-btn.active {
  background: #3498db;
  color: white;
  font-weight: bold;
}

.completed-btn {
  background: #f1f1f1;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  margin-left: 0.5rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.completed-btn:hover {
  background: #e4e4e4;
}
.completed-btn.active {
  background: #28a745;
  color: white;
  font-weight: bold;
}

.separator {
  width: 2px;
  border-right: 1px solid #bfbfbf;
}
</style>
