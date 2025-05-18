<template>
  <div
    class="todo-card"
    :class="{ completed }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="todo-content">
      <input type="checkbox" :checked="completed" @change="$emit('toggle')" class="task-checkbox" />
      <div class="todo-text">
        <h3>{{ title }}</h3>
        <div v-if="priority && priority > 0" class="task-priority">
          <div class="priority-indicator">
            <span class="priority-pre-text">優先度: </span>
            <div
              v-for="n in 5"
              :key="n"
              class="priority-dot"
              :class="{ active: priority >= n }"
            ></div>
          </div>
        </div>
        <p v-html="descriptionHtml" class="task-description"></p>
        <div v-if="due_date">
          <span class="todo-due-date">期限: {{ due_date }}</span>
          <span class="due-remaining">{{ dueRemainingText }}</span>
        </div>
        <div v-if="days" class="task-days">曜日: {{ days }}</div>
        <div class="habit-stars" v-if="importance && importance > 0">
          <span v-for="star in 3" :key="star" class="star" :class="{ active: star <= importance }"
            >★</span
          >
        </div>
        <slot></slot>
      </div>
      <div
        class="menu-trigger"
        v-if="showOption"
        @mouseenter="showMenu = true"
        @mouseleave="showMenu = false"
      >
        ⋮
        <div v-if="showMenu" class="menu-popup">
          <div class="menu-item" @click="$emit('edit')">編集</div>
          <div class="menu-item delete" @click="$emit('delete')">削除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  date: { type: String, default: '' },
  due_date: { type: String, default: '' },
  days: { type: String, default: '' },
  priority: { type: Number, default: 0 },
  importance: { type: Number, default: 0 },
})
const hover = ref<boolean>(false)
const showMenu = ref<boolean>(false)

const showOption = computed(() => hover.value && !props.completed)

// カスタムレンダラー
const customRenderer = new marked.Renderer()
customRenderer.link = function (token) {
  const href = token.href
  const title = token.title ? ` title="${token.title}"` : ''
  const text = token.text
  return `<a href="${href}"${title} target="_blank" rel="noopener">${text}</a>`
}

const descriptionHtml = computed(() =>
  marked(props.description || '', { renderer: customRenderer }),
)

const isPastDue = computed(() => {
  if (!props.due_date) return false
  const dueDate = new Date(props.due_date)
  const today = new Date()
  return dueDate < today
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

const dueRemainingText = computed(() => {
  if (!props.due_date) return ''
  const due = new Date(props.due_date)
  const today = new Date()
  // 時間を無視して日付だけ比較
  due.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff > 0) return `あと${diff}日`
  if (diff === 0) return '今日'
  return '期限切れ'
})
</script>

<style scoped>
.todo-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  transition: box-shadow 0.2s;
  position: relative;
}
.todo-card:hover {
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.18);
  background: #ebe8e8;
}
.todo-card.completed {
  border-right: 10px solid #28a745;
}
.todo-content {
  display: flex;
  align-items: flex-start;
}
.task-checkbox {
  margin-top: auto;
  margin-bottom: auto;
  width: 1rem;
  height: 1rem;
  cursor: pointer !important;
  z-index: 2;
}
.todo-text {
  border-left: 1px solid #cbcbcb;
  padding-left: 0.8rem;
  margin-left: 0.7rem;
}
.todo-text h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
}
.todo-text p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}
:deep(.task-description) {
  padding-left: 0.5rem;
}
:deep(.task-description a) {
  color: #006fb9 !important;
}
:deep(.task-description a:hover) {
  color: #0025c9 !important;
  text-decoration: underline !important;
}
:deep(.task-description li) {
  margin-left: 1rem !important;
}
.delete-button {
  background: transparent;
  color: #e74c3c;
  border: none;
  border-radius: 4px;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.2rem 0.7rem;
  align-self: flex-start;
  transition: background 0.2s;
}
.delete-button:hover {
  background: #fde8e8;
}
.menu-trigger {
  position: absolute;
  top: 0.2rem;
  right: 0.7rem;
  font-size: 2rem;
  color: #494949;
  cursor: pointer;
  z-index: 10;
  /* background: #fff; */
  border-radius: 30%;
  padding: 0.2em 0.4em;
  transition: background 0.2s;
}
.menu-trigger:hover {
  background: #eaf4fb;
}
.menu-popup {
  position: absolute;
  top: 2.2rem;
  right: 2rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  min-width: 120px;
  padding: 0.5rem 0;
  z-index: 20;
}
.menu-item {
  padding: 0.5rem 1.2rem;
  margin: 0.2rem 0.4rem;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  transition: background 0.2s;
}
.menu-item:hover {
  background: #cbcbcb;
}
.menu-item.delete {
  color: #e74c3c;
  font-weight: bold;
}
.todo-add-date {
  font-size: 0.8rem;
  color: #888;
}
.todo-due-date {
  font-size: 0.8rem;
  color: #888;
  text-decoration: underline;
}
.task-days {
  font-size: 0.8rem;
  color: #888;
}
.task-priority {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  margin-bottom: 6px;
}

.priority-indicator {
  display: flex;
  gap: 2px;
}

.priority-dot {
  margin: auto 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  transition: background-color 0.2s;
}

.priority-dot.active {
  background-color: #db3434;
}
.priority-pre-text {
  font-size: 0.8rem;
  color: #666;
  margin-right: 4px;
}
.priority-text {
  font-size: 0.8rem;
  color: #666;
}

.task-due-date {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #666;
}

.past-due {
  color: #e74c3c;
  font-weight: bold;
}

.due-remaining {
  margin-left: 0.5em;
  font-size: 0.9em;
  color: #e67e22;
  font-weight: bold;
}

.habit-stars .star {
  color: #ccc;
  font-size: 1.1em;
}
.habit-stars .star.active {
  color: #ffd700;
}
</style>
