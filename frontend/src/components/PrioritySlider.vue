<template>
  <div
    class="priority-slider-container"
    :class="{
      'priority-slider-container-add': modalType === 'add',
      'priority-slider-container-edit': modalType === 'edit',
    }"
  >
    <div class="priority-slider-title">優先度:</div>
    <div class="priority-slider-wrapper">
      <input
        type="range"
        class="priority-slider"
        min="1"
        max="5"
        step="1"
        v-model.number="localPriority"
        @input="updatePriority"
      />
      <div class="priority-labels">
        <span
          v-for="n in 5"
          :key="n"
          :class="{ active: localPriority >= n }"
          class="priority-label"
        >
          {{ n }}
        </span>
      </div>
      <div class="priority-text">{{ priorityText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 3 },
  modalType: { type: String, default: 'add' },
})

const emit = defineEmits(['update:modelValue'])

const localPriority = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localPriority.value = newVal
  },
)

const updatePriority = () => {
  emit('update:modelValue', localPriority.value)
}

const priorityText = computed(() => {
  switch (localPriority.value) {
    case 1:
      return '最低'
    case 2:
      return '低い'
    case 3:
      return '普通'
    case 4:
      return '高い'
    case 5:
      return '最高'
    default:
      return '普通'
  }
})
</script>

<style scoped>
.priority-slider-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}
.priority-slider-container-add {
  background-color: rgba(131, 212, 255, 0.5);
}
.priority-slider-container-edit {
  background-color: rgba(131, 255, 170, 0.5);
}

.priority-slider-title {
  width: 100%;
  font-weight: bold;
}

.priority-slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 0 auto;
}

.priority-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #d3d3d3;
  outline: none;
  border-radius: 4px;
  margin-bottom: 8px;
}

.priority-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.priority-slider-container-add .priority-slider::-webkit-slider-thumb {
  background: #3498db;
}

.priority-slider-container-edit .priority-slider::-webkit-slider-thumb {
  background: #21bb6b;
}

.priority-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.priority-slider-container-add .priority-slider::-moz-range-thumb {
  background: #3498db;
}

.priority-slider-container-edit .priority-slider::-moz-range-thumb {
  background: #21bb6b;
}

.priority-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 2px;
}

.priority-label {
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.priority-label.active {
  color: #3498db;
  font-weight: bold;
}

.priority-slider-container-add .priority-label.active {
  color: #3498db;
}

.priority-slider-container-edit .priority-label.active {
  color: #21bb6b;
}

.priority-text {
  margin-top: 8px;
  font-weight: bold;
  color: #3498db;
}

.priority-slider-container-add .priority-text {
  color: #3498db;
}

.priority-slider-container-edit .priority-text {
  color: #21bb6b;
}
</style>
