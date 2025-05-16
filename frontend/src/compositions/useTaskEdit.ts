import { ref } from 'vue'
import { useDailyTaskStore } from '@/stores/dailyTask'
import { useHabitTaskStore } from '@/stores/habitTask'
import { useTodoTaskStore } from '@/stores/todoTask'
import type { DailyTask } from '@/types/task'
import type { HabitTask } from '@/types/task'
import type { TodoTask } from '@/types/task'

export function useTaskEdit(taskType: string) {
  const showEditModal = ref<boolean>(false)
  const editTarget = ref<DailyTask | HabitTask | TodoTask>()
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

  function openEditModal(task: DailyTask | HabitTask | TodoTask) {
    editTarget.value = task
    showEditModal.value = true
  }

  const handleEditSubmit = async (selectedTask: DailyTask | HabitTask | TodoTask) => {
    switch (taskType) {
      case 'daily':
        await taskStore.value.updateDailyTask(selectedTask.id, selectedTask)
        break
      case 'habit':
        await taskStore.value.updateHabitTask(selectedTask.id, selectedTask)
        break
      case 'todo':
        await taskStore.value.updateTodoTask(selectedTask.id, selectedTask)
        break
    }
    showEditModal.value = false
  }

  return {
    showEditModal,
    editTarget,
    openEditModal,
    handleEditSubmit,
  }
}