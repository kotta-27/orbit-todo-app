<template>
  <div class="preview-container">
    <div class="preview-title">〈プレビュー〉</div>
    <div class="desc-preview" v-html="descriptionPreview"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
const props = defineProps<{ markdown: string }>()

// カスタムレンダラー
const customRenderer = new marked.Renderer()
customRenderer.link = function (token) {
  const href = token.href
  const title = token.title ? ` title="${token.title}"` : ''
  const text = token.text
  return `<a href="${href}"${title} target="_blank" rel="noopener">${text}</a>`
}

const descriptionPreview = computed(() =>
  marked(props.markdown || '', { renderer: customRenderer }),
)
</script>

<style scoped>
.preview-container {
  width: 50%;
}
.preview-title {
  height: 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 3px;
}
.desc-preview {
  background: #f8f8f8;
  padding: 0.7rem;
  border-radius: 6px;
  min-height: 80px;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}
:deep(.desc-preview a) {
  color: #006fb9 !important;
}
:deep(.desc-preview a:hover) {
  color: #0025c9 !important;
  text-decoration: underline !important;
}
:deep(.desc-preview li) {
  margin-left: 1rem !important;
}
</style>
