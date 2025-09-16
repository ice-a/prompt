<template>
  <div class="prompt-detail">
    <div class="header">
      <div class="nav-bar">
        <t-button variant="text" @click="$router.back()">
          <template #icon>
            <chevron-left-icon />
          </template>
          返回列表
        </t-button>
      </div>
    </div>

    <div class="content">
      <t-loading :loading="promptStore.loading">
        <div v-if="promptStore.currentPrompt" class="detail-container">
          <div class="main-content">
            <div class="prompt-header">
              <h1 class="prompt-title">{{ promptStore.currentPrompt.title }}</h1>
              
              <div class="meta-section">
                <div class="meta-group">
                  <span class="meta-label">适用模型:</span>
                  <div class="meta-tags">
                    <t-tag 
                      v-for="model in promptStore.currentPrompt.models"
                      :key="model"
                      theme="primary"
                      size="small"
                    >
                      {{ model }}
                    </t-tag>
                  </div>
                </div>
                
                <div class="meta-group">
                  <span class="meta-label">类型:</span>
                  <div class="meta-tags">
                    <t-tag theme="success" size="small">{{ promptStore.currentPrompt.type }}</t-tag>
                  </div>
                </div>
                
                <div v-if="promptStore.currentPrompt.tags.length" class="meta-group">
                  <span class="meta-label">标签:</span>
                  <div class="meta-tags">
                    <t-tag
                      v-for="tag in promptStore.currentPrompt.tags"
                      :key="tag"
                      variant="outline"
                      size="small"
                    >
                      {{ tag }}
                    </t-tag>
                  </div>
                </div>
              </div>
            </div>

            <div class="prompt-description">
              <h3>描述</h3>
              <p>{{ promptStore.currentPrompt.description }}</p>
            </div>

            <div class="prompt-content">
              <div class="content-header">
                <h3>提示词内容</h3>
                <div class="content-actions">
                  <t-button theme="primary" variant="outline" @click="copyPrompt" class="copy-button">
                    <template #icon>
                      <copy-icon />
                    </template>
                    复制内容
                  </t-button>
                  <t-button variant="text" @click="copyPrompt" class="quick-copy">
                    <copy-icon />
                  </t-button>
                </div>
              </div>
              <div class="content-box">
                <div class="content-toolbar">
                  <span class="content-label">提示词内容</span>
                  <t-button 
                    variant="text" 
                    size="small" 
                    @click="copyPrompt"
                    class="toolbar-copy"
                  >
                    <copy-icon />
                    复制
                  </t-button>
                </div>
                <pre>{{ promptStore.currentPrompt.content }}</pre>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <t-card title="适用模型">
              <div class="models-list">
                <t-tag 
                  v-for="model in promptStore.currentPrompt.models"
                  :key="model"
                  size="small"
                  theme="primary"
                  variant="outline"
                >
                  {{ model }}
                </t-tag>
              </div>
            </t-card>

            <t-card title="详细信息">
              <div class="info-item">
                <span class="label">类型:</span>
                <span class="value">{{ promptStore.currentPrompt.type }}</span>
              </div>
              <div class="info-item">
                <span class="label">作者:</span>
                <span class="value">{{ promptStore.currentPrompt.author }}</span>
              </div>
              <div class="info-item">
                <span class="label">上传时间:</span>
                <span class="value">{{ formatDate(promptStore.currentPrompt.uploadTime) }}</span>
              </div>
            </t-card>

            <t-card v-if="promptStore.currentPrompt.tags.length" title="标签">
              <div class="tags-list">
                <t-tag
                  v-for="tag in promptStore.currentPrompt.tags"
                  :key="tag"
                  size="small"
                  variant="outline"
                >
                  {{ tag }}
                </t-tag>
              </div>
            </t-card>

            <t-card title="操作" class="actions-card">
              <t-space direction="vertical" style="width: 100%">
                <t-button theme="primary" block @click="copyPrompt">
                  <template #icon>
                    <copy-icon />
                  </template>
                  复制提示词
                </t-button>
                <t-button variant="outline" block @click="sharePrompt">
                  <template #icon>
                    <share-icon />
                  </template>
                  分享
                </t-button>
              </t-space>
            </t-card>
          </div>
        </div>
      </t-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePromptStore } from '../stores/prompt'
import { ChevronLeftIcon, CopyIcon, ShareIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

const route = useRoute()
const promptStore = usePromptStore()

const copyPrompt = async () => {
  if (promptStore.currentPrompt) {
    try {
      await navigator.clipboard.writeText(promptStore.currentPrompt.content)
      MessagePlugin.success('提示词已复制到剪贴板')
    } catch (error) {
      MessagePlugin.error('复制失败')
    }
  }
}

const sharePrompt = async () => {
  if (navigator.share && promptStore.currentPrompt) {
    try {
      await navigator.share({
        title: promptStore.currentPrompt.title,
        text: promptStore.currentPrompt.description,
        url: window.location.href
      })
    } catch (error) {
      // 如果不支持原生分享，复制链接
      try {
        await navigator.clipboard.writeText(window.location.href)
        MessagePlugin.success('链接已复制到剪贴板')
      } catch (clipboardError) {
        MessagePlugin.error('分享失败')
      }
    }
  } else {
    // 备用方案：复制链接
    try {
      await navigator.clipboard.writeText(window.location.href)
      MessagePlugin.success('链接已复制到剪贴板')
    } catch (error) {
      MessagePlugin.error('分享失败')
    }
  }
}

const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    promptStore.fetchPromptById(id)
  }
})
</script>

<style scoped>
.prompt-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 72px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .nav-bar {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .nav-bar {
    max-width: 1400px;
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .nav-bar {
    max-width: 1600px;
    padding: 0 40px;
  }
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

@media (min-width: 640px) {
  .content {
    padding: 32px 24px;
  }
}

@media (min-width: 1024px) {
  .content {
    max-width: 1400px;
    padding: 32px 32px;
  }
}

@media (min-width: 1440px) {
  .content {
    max-width: 1600px;
    padding: 32px 40px;
  }
}

.detail-container {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
}

.main-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #2196f3 0%, #64b5f6 50%, #90caf9 100%);
}

.prompt-header {
  margin-bottom: 40px;
  padding-top: 8px;
}

.prompt-title {
  margin: 0 0 20px 0;
  font-size: 36px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.meta-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.meta-tags :deep(.t-tag) {
  border-radius: 16px;
  font-weight: 500;
  padding: 6px 12px;
}

.prompt-description {
  margin-bottom: 40px;
}

.prompt-description h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #2d3748;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.prompt-description p {
  margin: 0;
  color: #718096;
  line-height: 1.7;
  font-size: 16px;
}

.prompt-content h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2d3748;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-button {
  border-radius: 8px;
  font-weight: 500;
}

.quick-copy {
  padding: 8px;
  border-radius: 6px;
  color: #718096;
}

.quick-copy:hover {
  background: #f7fafc;
  color: #3182ce;
}

.content-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.content-label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
}

.toolbar-copy {
  font-size: 12px;
  padding: 4px 8px;
  color: #718096;
}

.toolbar-copy:hover {
  color: #3182ce;
  background: #edf2f7;
}

.content-box pre {
  margin: 0;
  padding: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #2d3748;
  background: #fff;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar :deep(.t-card) {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.sidebar :deep(.t-card__header) {
  background: linear-gradient(135deg, #2196f3 0%, #64b5f6 50%, #90caf9 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
}

.sidebar :deep(.t-card__body) {
  padding: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.info-item.models-item {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #4a5568;
  min-width: 90px;
}

.value {
  color: #2d3748;
  text-align: right;
  flex: 1;
  font-weight: 500;
}

.models-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.models-list .t-tag {
  justify-self: start;
}

.tags-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.tags-list .t-tag {
  justify-self: start;
}

@media (max-width: 768px) {
  .models-list,
  .tags-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .models-list,
  .tags-list {
    grid-template-columns: 1fr;
  }
}

.actions-card {
  margin-top: 4px;
}

/* 按钮样式优化 */
:deep(.t-button--theme-primary) {
  background: linear-gradient(135deg, #2196f3 0%, #64b5f6 50%, #90caf9 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.t-button--theme-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
}

:deep(.t-button--variant-outline) {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.t-button--variant-outline:hover) {
  border-color: #2196f3;
  color: #2196f3;
  transform: translateY(-1px);
}

:deep(.t-button--variant-text) {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.t-button--variant-text:hover) {
  background: rgba(33, 150, 243, 0.1);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .nav-bar {
    height: 64px;
  }
  
  .content {
    padding: 20px 16px;
  }
  
  .main-content {
    padding: 24px 20px;
  }
  
  .prompt-title {
    font-size: 28px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .prompt-title {
    font-size: 24px;
  }
  
  .content-box {
    padding: 20px;
  }
}
</style>