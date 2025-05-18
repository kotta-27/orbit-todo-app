<template>
  <div class="weekly-report-box">
    <div class="scroll-box">
      <div class="report-title-container">
        <div class="report-title-text">
          今週のレポート
          <span class="tooltip-container">
            <span class="tooltip-icon">&#9432;</span>
            <span class="tooltip-text">
              1週間分の習慣・日課の達成状況と改善点をAIが自動で要約します。
            </span>
          </span>
        </div>
        <div class="report-title-date">{{ reportTitle }}</div>
      </div>
      <div v-if="loading">
        <div class="spinner"></div>
        <div style="margin-top: 0.7rem">AIがレポートを作成中...</div>
      </div>
      <div v-else>
        <div v-if="report" class="report-result" v-html="reportHtml"></div>
        <div v-if="error" class="report-error">{{ error }}</div>
        <div class="ai-token-info" v-if="inputTokens || outputTokens">
          <div>入力トークン数: {{ inputTokens }}</div>
          <div>出力トークン数: {{ outputTokens }}</div>
          <div>
            推定料金: {{ ((inputTokens + outputTokens) * pricePerToken * usdToJpy).toFixed(1) }}円
          </div>
        </div>
        <div class="regenerate-btn-container">
          <button class="regenerate-btn" @click="generateReport" style="margin-top: 1rem">
            レポート再生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHabitTaskStore } from '@/stores/habitTask'
import { useDailyTaskStore } from '@/stores/dailyTask'
import { format } from 'date-fns'
import { marked } from 'marked'

const habitStore = useHabitTaskStore()
const dailyStore = useDailyTaskStore()
const weekData = ref<{
  weekDates: string[]
  habits: any[]
  dailies: any[]
}>({
  weekDates: [],
  habits: [],
  dailies: [],
})
const report = ref('')
const reportHtml = ref('')
const loading = ref(false)
const error = ref('')
const inputTokens = ref(0)
const outputTokens = ref(0)
const pricePerToken = 0.35 / 1000000
const usdToJpy = 160

const reportTitle = computed(() => {
  if (weekData.value.weekDates.length === 7) {
    return `${weekData.value.weekDates[0]}(月)〜${weekData.value.weekDates[6]}(日)`
  } else {
    return
  }
})

function countTokens(text: string) {
  return text.length // 目安
}

function getTodayKey() {
  const today = new Date()
  return format(today, 'yyyy-MM-dd')
}

function getThisWeekData() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return format(d, 'yyyy-MM-dd')
  })
  const dailies = dailyStore.dailyTasks
  const habits = habitStore.habitTasks
  return { weekDates, habits, dailies }
}

async function generateReport() {
  loading.value = true
  error.value = ''
  report.value = ''
  reportHtml.value = ''
  // weekDataを更新
  weekData.value = getThisWeekData()
  const weekDataObj = weekData.value
  // 簡素なプロンプト
  const prompt = `
あなたは習慣・日課のコーチです。以下の今週のデータを見て、達成状況・改善点を簡潔に必ずMarkdownでまとめてください。形式は必ずMarkdownで出力し、<code>タグは絶対に使用しないでください。

フォーマットは以下の通りです。

## 達成状況
### 習慣
- 習慣1 OK/NG
- 習慣2 OK/NG
- 習慣3 OK/NG

### 日課
- 日課1 X曜日 OK/NG
- 日課2 X曜日 OK/NG
- 日課3 X曜日 OK/NG

## 改善点


# データ
${JSON.stringify(weekDataObj, null, 2)}
`
  inputTokens.value = countTokens(prompt)
  try {
    const res = await fetch('http://localhost:3000/api/v1/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    // OK/NG をアイコンに置換
    const iconText = outputText.replace(/OK/g, '✅').replace(/NG/g, '❌')
    report.value = iconText
    reportHtml.value = await marked.parse(iconText)
    outputTokens.value = countTokens(outputText)
    // 保存
    const todayKey = getTodayKey()
    localStorage.setItem(
      'weekly_report_' + todayKey,
      JSON.stringify({
        report: iconText,
        inputTokens: inputTokens.value,
        outputTokens: outputTokens.value,
      }),
    )
  } catch (e) {
    error.value = '通信エラーが発生しました'
  } finally {
    loading.value = false
  }
}

async function loadReportFromStorage() {
  const todayKey = getTodayKey()
  const saved = localStorage.getItem('weekly_report_' + todayKey)
  if (saved) {
    try {
      const obj = JSON.parse(saved)
      report.value = obj.report
      return obj
    } catch {}
  }
  return null
}

onMounted(async () => {
  // 週データを初期化
  const week = getThisWeekData()
  weekData.value = week
  // レポートのロード
  const loaded = await loadReportFromStorage()
  if (loaded) {
    reportHtml.value = await marked.parse(loaded.report)
    inputTokens.value = loaded.inputTokens
    outputTokens.value = loaded.outputTokens
  } else {
    await generateReport()
  }
})
</script>

<style scoped>
.weekly-report-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0.5rem 0.5rem;
  max-width: 25vw;
  min-width: 25vw;
}

.scroll-box {
  overflow-y: auto;
  max-height: 80vh;
  min-height: 80vh;
}

.report-title-container {
  padding: 0.1rem 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.report-title-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 0.5rem;
}
.report-title-date {
  font-size: 1rem;
  color: #050505;
  margin-bottom: 0.5rem;
}

.report-result {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  color: #222;
}
:deep(.report-result h1) {
  font-size: 1.4rem;
  font-weight: bold;
  color: #0e12dc;
  margin-bottom: 0.7rem;
  border-bottom: 2px solid #dbeafe;
  padding-bottom: 0.2rem;
}
:deep(.report-result h2) {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2563eb;
  background-color: #ebebeb;
  margin-bottom: 0.5rem;
  border-left: 4px solid #a5b4fc;
  padding-left: 0.5rem;
}
:deep(.report-result h3) {
  font-weight: bold;
  margin-left: 1.2rem;
}
:deep(.report-result ul),
:deep(.report-result ol) {
  margin-left: 1.2rem;
  margin-bottom: 0.5rem;
  padding-left: 0 !important;
  gap: 0 !important;
  padding-inline-start: 0 !important;
}

:deep(.report-result li) {
  margin-left: 1.5rem !important;
  font-size: 0.9rem;
}
:deep(.report-result p) {
  font-weight: normal !important;
  margin: 0rem !important;
  font-size: 0.8rem;
  line-height: 1.7;
}
:deep(.report-result strong) {
  color: #e67e22;
  font-weight: bold;
}
:deep(.report-result em) {
  color: #2563eb;
  font-style: italic;
}
:deep(.report-result code) {
  background: #f3f4f6;
  color: #d97706;
  border-radius: 4px;
  padding: 0.1em 0.4em;
  font-size: 0.95em;
}
:deep(.report-result blockquote) {
  border-left: 4px solid #a5b4fc;
  background: #f8fafc;
  color: #555;
  margin: 0.7rem 0;
  padding: 0.5rem 1rem;
  font-style: italic;
}

.report-error {
  color: #e74c3c;
  margin-top: 0.5rem;
}
.ai-token-info {
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  color: #222;
}
.regenerate-btn-container {
  margin-top: 0.7rem;
  text-align: center;
}
.regenerate-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1.2rem;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.regenerate-btn:hover {
  background: #1e40af;
}

.tooltip-container {
  display: inline-block;
  position: relative;
  margin-left: 0.4em;
}
.tooltip-icon {
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  color: #2563eb;
  vertical-align: middle;
}
.tooltip-text {
  visibility: hidden;
  opacity: 0;
  width: 190px;
  background: #222;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 0.5em 0.8em;
  position: absolute;
  z-index: 50;
  left: 0%;
  top: 160%;
  transform: translateY(-50%);
  transition: opacity 0.2s;
  font-size: 0.55em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.spinner {
  margin: 1.5rem auto 0.5rem auto;
  border: 4px solid #e0e7ef;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
