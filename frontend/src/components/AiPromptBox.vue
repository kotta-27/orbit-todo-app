<template>
  <div class="ai-prompt-box">
    <form @submit.prevent="onSubmit" class="ai-form">
      <input v-model="prompt" class="ai-input" placeholder="AIに質問..." />
      <button type="submit" class="ai-send-btn">送信</button>
    </form>
    <div v-if="loading" class="ai-loading">送信中...</div>
    <div v-if="response" class="ai-response">
      <strong>AIの返答:</strong>
      <div class="ai-response-text">{{ response }}</div>
    </div>
    <div v-if="error" class="ai-error">{{ error }}</div>
    <div class="ai-token-info">
      <div>入力トークン数: {{ inputTokens }}</div>
      <div>出力トークン数: {{ outputTokens }}</div>
      <div>
        推定料金: {{ ((inputTokens + outputTokens) * pricePerToken * usdToJpy).toFixed(1) }}円
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHabitTaskStore } from '@/stores/habitTask'
import { useDailyTaskStore } from '@/stores/dailyTask'
import { useTodoTaskStore } from '@/stores/todoTask'

const prompt = ref('')
const response = ref('')
const loading = ref(false)
const error = ref('')

const habitStore = useHabitTaskStore()
const dailyStore = useDailyTaskStore()
const todoStore = useTodoTaskStore()

const inputTokens = ref(0)
const outputTokens = ref(0)
const pricePerToken = 0.35 / 1000000 // $0.35 per 1M token
const usdToJpy = 160 // 1ドル=160円換算

function buildTaskJson() {
  return JSON.stringify(
    {
      habits: habitStore.habitTasks.slice(0, 1),
      dailies: dailyStore.dailyTasks.slice(0, 1),
      todos: todoStore.todoTasks.slice(0, 1),
    },
    null,
    2,
  )
}

// const basePrompt = `あなたは習慣・日課・ToDoの専門コーチです。以下のユーザーの実行データを分析し、次の観点で自然言語で評価してください：\n\n1. タスクごとの達成状況\n2. 継続・失敗傾向とその原因分析\n3. 改善のための具体的なアクション提案（数値・習慣変更案）\n4. 総合フィードバック\n\n# ユーザーデータ\n`
const basePrompt = `こんにちはとだけ返答して.`

function countTokens(text: string) {
  try {
    return text.length // fallback: 1文字=1token
  } catch {
    return text.length // fallback: 1文字=1token
  }
}

async function onSubmit() {
  if (!prompt.value.trim()) return
  response.value = ''
  error.value = ''
  loading.value = true
  try {
    const fullPrompt = basePrompt + buildTaskJson() + '\n' + prompt.value
    inputTokens.value = countTokens(fullPrompt)
    const res = await fetch('http://localhost:3000/api/v1/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt }),
    })
    const data = await res.json()
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    response.value = outputText || '返答なし'
    outputTokens.value = countTokens(outputText)
  } catch (e) {
    error.value = '通信エラーが発生しました'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ai-prompt-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.2rem 1.5rem;
  max-width: 600px;
}
.ai-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}
.ai-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 1px solid #bcd;
  border-radius: 6px;
  font-size: 1rem;
}
.ai-send-btn {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.ai-send-btn:hover {
  background: #217dbb;
}
.ai-loading {
  color: #888;
  font-size: 0.95rem;
}
.ai-response {
  margin-top: 0.7rem;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  color: #222;
}
.ai-response-text {
  margin-top: 0.3rem;
  white-space: pre-wrap;
}
.ai-error {
  color: #e74c3c;
  margin-top: 0.5rem;
}
.ai-token-info {
  margin-top: 0.7rem;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  color: #222;
}
</style>
