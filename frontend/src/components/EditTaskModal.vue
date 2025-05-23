<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>編集</h2>
      <div class="split-line"></div>
      <form @submit.prevent="submit" class="modal-form">
        <div class="task-input-container">
          <div class="task-input-title">タイトル :</div>
          <input
            v-model="localTask.title"
            type="text"
            placeholder="タイトル"
            required
            class="task-input"
          />
        </div>
        <div class="habit-importance-container" v-if="modalTitle === '習慣'">
          <label>重要度:</label>
          <div class="star-input">
            <span
              v-for="n in 3"
              :key="n"
              class="star"
              :class="{ active: n <= localTask.importance, hovered: n <= hoverIndex }"
              @click="localTask.importance = n"
              @mouseenter="hoverIndex = n"
              @mouseleave="hoverIndex = 0"
              >★</span
            >
          </div>
        </div>
        <div v-if="modalTitle === 'ToDo'" class="task-todo-option-container">
          <div class="task-input-due-date-container">
            <div class="task-input-due-date-title">期限 :</div>
            <input
              v-model="localTask.due_date"
              type="date"
              class="task-input-due-date"
              placeholder="期限"
            />
          </div>
          <PrioritySlider v-model="localTask.priority" modalType="edit" />
        </div>
        <div class="desc-container">
          <div class="desc-container-title">詳細（任意）:</div>
          <div class="desc-container-input">
            <textarea
              v-model="localTask.description"
              placeholder="markdown形式で記述できます"
              class="task-textarea"
            ></textarea>
            <MarkdownPreview :markdown="localTask.description" />
          </div>
        </div>
        <div v-if="showWeekdays" class="weekday-group">
          <label v-for="day in daysOfWeek" :key="day.value" class="weekday-label">
            <input type="checkbox" v-model="localTask.daysArr" :value="day.value" />
            {{ day.label }}
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" class="modal-cancel-button" @click="close">キャンセル</button>
          <button type="submit" class="modal-edit-button">更新</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import MarkdownPreview from './MarkdownPreview.vue'
import PrioritySlider from './PrioritySlider.vue'
const props = defineProps({
  show: Boolean,
  modalTitle: { type: String, required: true },
  showWeekdays: { type: Boolean, default: false },
  selectedTask: { type: Object, default: null },
})
const emit = defineEmits(['close', 'add'])

const daysOfWeek = [
  { value: '月', label: '月' },
  { value: '火', label: '火' },
  { value: '水', label: '水' },
  { value: '木', label: '木' },
  { value: '金', label: '金' },
  { value: '土', label: '土' },
  { value: '日', label: '日' },
]

// 今日の曜日をデフォルト選択
const todayIndex = new Date().getDay()
const todayIndexFromMonday = (todayIndex + 6) % 7
const todayValue = daysOfWeek[todayIndexFromMonday].value

const localTask = ref({
  title: '',
  description: '',
  completed: false,
  due_date: '',
  daysArr: props.showWeekdays ? [todayValue] : [],
  priority: 3,
  importance: 1,
})

const hoverIndex = ref(0)

watch(
  () => props.show,
  (val) => {
    if (val) {
      if (props.selectedTask) {
        localTask.value = {
          title: props.selectedTask.title,
          description: props.selectedTask.description,
          completed: props.selectedTask.completed,
          daysArr: props.selectedTask.days ? props.selectedTask.days.split(',') : [],
          due_date: props.selectedTask.due_date,
          priority: props.selectedTask.priority || 2,
          importance: props.selectedTask.importance || 1,
        }
      } else {
        localTask.value = {
          title: '',
          description: '',
          completed: false,
          daysArr: props.showWeekdays ? [todayValue] : [],
          due_date: '',
          priority: 3,
          importance: 1,
        }
      }
    }
  },
)

function close() {
  emit('close')
}

function submit() {
  const payload: any = {
    title: localTask.value.title,
    description: localTask.value.description,
    completed: false,
    due_date: localTask.value.due_date,
  }
  if (props.showWeekdays) {
    payload.days = localTask.value.daysArr.join(',')
  }
  if (props.modalTitle === 'ToDo') {
    payload.priority = localTask.value.priority
  }
  if (props.selectedTask && props.selectedTask.id) {
    payload.id = props.selectedTask.id
  }
  if (props.modalTitle === '習慣') {
    payload.importance = localTask.value.importance
  }
  emit('add', payload)
  close()
}
</script>

<style scoped>
.split-line {
  width: 100%;
  height: 5px;
  border-top: 1px solid #21bb6b;
  margin-bottom: 1rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: 50%;
  min-width: 700px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.task-input-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  background-color: rgba(131, 255, 170, 0.5);
  padding: 0.5rem;
}
.task-input-title {
  font-weight: bold;
}
.task-input {
  width: 70%;
  margin-left: 2rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.task-todo-option-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.task-input-due-date-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgba(131, 255, 170, 0.5);
  padding: 0.5rem;
}
.task-input-due-date-title {
  width: 100%;
  font-weight: bold;
}
.task-input-due-date {
  width: 70%;
  margin: 0 auto;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.desc-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgba(131, 255, 170, 0.5);
  padding: 0.5rem;
}
.desc-container-title {
  width: 100%;
  font-weight: bold;
}
.desc-container-input {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.task-textarea {
  margin-top: 23px;
  width: 50%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.modal-cancel-button {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
}
.modal-cancel-button:hover {
  background: #ccc;
}
.modal-edit-button {
  background: #21bb6b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.modal-edit-button:hover {
  background: #238928;
}
.weekday-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.weekday-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition:
    background 0.2s,
    border 0.2s;
  user-select: none;
}
.weekday-label input[type='checkbox'] {
  accent-color: #006fb9;
  width: 1.1em;
  height: 1.1em;
  margin: 0;
}
.weekday-label:hover {
  background: #eaf4fb;
  /* border: 1.5px solid #3498db; */
}
.habit-importance-container {
  display: flex;
  align-items: center;
  background-color: rgba(131, 255, 170, 0.5);
  padding: 0.5rem;
  gap: 0.7rem;
  margin: 0.1rem 0;
}

.habit-importance-container label {
  font-weight: bold;
  margin-right: 0.5rem;
}
.star-input {
  display: flex;
  gap: 0.2rem;
}

.star {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
  transition:
    color 0.2s,
    border 0.2s;
  user-select: none;
  border: 2px solid rgba(131, 255, 170, 0.1);
  border-radius: 4px;
  padding: 0.2rem;
}

.star.hovered {
  border-color: #ffd700;
}

.star.active {
  color: #ffd700;
}
</style>
