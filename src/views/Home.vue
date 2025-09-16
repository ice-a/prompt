<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="nav-bar">
          <h1 class="brand">
            <img src="/logo.svg" alt="AI提示词宝典" class="brand-logo" />
            AI提示词宝典
          </h1>
          <div class="nav-actions">
            <t-input
              v-model="searchQuery"
              placeholder="搜索你需要的提示词..."
              class="search-input"
              @enter="handleSearch"
              @input="handleSearch"
            >
              <template #suffix-icon>
                <search-icon />
              </template>
            </t-input>
            <t-button 
              theme="primary" 
              @click="openSubmitForm" 
              class="submit-btn"
            >
              <plus-icon />
              提交提示词
            </t-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <t-loading :loading="promptStore.loading">
          <div class="prompt-grid">
            <div
              v-for="prompt in promptStore.filteredPrompts"
              :key="prompt._id"
              class="prompt-card"
            >
              <div class="card-header">
                <div class="card-title">{{ prompt.title }}</div>
                <div class="card-actions">
                  <t-button
                    variant="text"
                    size="small"
                    @click="copyPrompt(prompt.content)"
                    class="copy-btn"
                  >
                    <copy-icon />
                  </t-button>
                </div>
              </div>
              
              <div class="card-description">
                {{ prompt.description }}
              </div>
              
              <div class="card-tags">
                <span 
                  v-for="model in prompt.models.slice(0, 2)" 
                  :key="model"
                  class="tag model-tag"
                >
                  {{ model }}
                </span>
                <span class="tag type-tag">{{ prompt.type }}</span>
                <span
                  v-for="tag in prompt.tags.slice(0, 2)"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="card-footer">
                <div class="author-info">
                  <span class="author">{{ prompt.author }}</span>
                  <span class="date">{{ formatDate(prompt.uploadTime) }}</span>
                </div>
                <t-button
                  variant="outline"
                  size="small"
                  @click="viewPrompt(prompt._id!)"
                  class="view-btn"
                >
                  查看详情
                </t-button>
              </div>
            </div>
          </div>
        </t-loading>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '../stores/prompt'
import { SearchIcon, CopyIcon, PlusIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const promptStore = usePromptStore()

const searchQuery = ref('')

const handleSearch = () => {
  promptStore.setSearchQuery(searchQuery.value)
}

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  promptStore.setSearchQuery(newQuery)
})

const viewPrompt = (id: string) => {
  router.push(`/prompt/${id}`)
}

const copyPrompt = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    MessagePlugin.success('提示词已复制到剪贴板')
  } catch (error) {
    MessagePlugin.error('复制失败')
  }
}

const openSubmitForm = () => {
  window.open('https://f.wps.cn/g/VjlCWOPV/', '_blank')
}

const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  promptStore.fetchPrompts()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
}

/* 顶部导航 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(187, 222, 251, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(144, 202, 249, 0.2);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1400px;
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1600px;
    padding: 0 40px;
  }
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 300px;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 主要内容 */
.main-content {
  padding: 24px 0;
}

.prompt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* 卡片样式 - 参考导航网站 */
.prompt-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(187, 222, 251, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(144, 202, 249, 0.1);
}

.prompt-card:hover {
  border-color: rgba(66, 165, 245, 0.5);
  box-shadow: 0 8px 24px rgba(144, 202, 249, 0.2);
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.4;
  flex: 1;
  margin-right: 12px;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.copy-btn {
  color: #718096;
  padding: 4px;
  min-width: auto;
}

.copy-btn:hover {
  color: #3182ce;
  background: #edf2f7;
}

.card-description {
  color: #718096;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.model-tag {
  background: #ebf8ff;
  color: #3182ce;
  border-color: #bee3f8;
}

.type-tag {
  background: #f0fff4;
  color: #38a169;
  border-color: #c6f6d5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f7fafc;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author {
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
}

.date {
  font-size: 12px;
  color: #a0aec0;
}

.view-btn {
  font-size: 13px;
  padding: 6px 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-bar {
    flex-direction: column;
    height: auto;
    padding: 16px 0;
    gap: 16px;
  }
  
  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-input {
    flex: 1;
    max-width: 250px;
  }
  
  .prompt-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .prompt-card {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .card-actions {
    align-self: flex-end;
  }
}
</style>