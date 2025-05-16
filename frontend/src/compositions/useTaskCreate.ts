// タスク作成のためのコンポジション
import { ref } from 'vue'
import { useDailyTaskStore } from '@/stores/dailyTask'
import { useHabitTaskStore } from '@/stores/habitTask'
import { useTodoTaskStore } from '@/stores/todoTask'
import type { DailyTask } from '@/types/task'
import type { HabitTask } from '@/types/task'
import type { TodoTask } from '@/types/task'

export function useTaskCreate(taskType: string) {
  const showCreateModal = ref<boolean>(false)
  const taskStore = ref<any>(undefined)

  switch (taskType) {
    case 'daily':
      taskStore.value = useDailyTaskStore()
      break
    case 'habit':
      taskStore.value = useHabitTaskStore()
      break
    case 'todo':
      taskStore.value = useTodoTaskStore()
      break
  }

  function openCreateModal() {
    showCreateModal.value = true
  }

  const handleCreateTask = async (task: DailyTask | HabitTask | TodoTask) => {

    switch (taskType) {
      case 'daily':
        await taskStore.value.createDailyTask(task)
        break
      case 'habit':
        await taskStore.value.createHabitTask(task)
        break
      case 'todo':
        await taskStore.value.createTodoTask(task)
        break
    }
  }
  return {
    showCreateModal,
    openCreateModal,
    handleCreateTask,
  }
}
