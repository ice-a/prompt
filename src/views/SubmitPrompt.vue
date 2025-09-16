<template>
  <div class="submit-prompt">
    <div class="header">
      <div class="nav-bar">
        <t-button variant="text" @click="$router.back()">
          <template #icon>
            <chevron-left-icon />
          </template>
          返回
        </t-button>
        <h1>提交新提示词</h1>
      </div>
    </div>

    <div class="content">
      <div class="form-container">
        <t-form
          ref="formRef"
          :data="formData"
          :rules="rules"
          label-width="100px"
          @submit="handleSubmit"
        >
          <t-form-item label="标题" name="title">
            <t-input
              v-model="formData.title"
              placeholder="请输入提示词标题"
              maxlength="100"
            />
          </t-form-item>

          <t-form-item label="描述" name="description">
            <t-textarea
              v-model="formData.description"
              placeholder="请简要描述这个提示词的用途"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="200"
            />
          </t-form-item>

          <t-form-item label="适用模型" name="models">
            <t-select
              v-model="formData.models"
              placeholder="请选择适用的AI模型（可多选）"
              multiple
              clearable
            >
              <t-option value="GPT-4" label="GPT-4" />
              <t-option value="Claude" label="Claude" />
              <t-option value="Gemini" label="Gemini" />
              <t-option value="ChatGLM" label="ChatGLM" />
              <t-option value="Llama" label="Llama" />
            </t-select>
          </t-form-item>

          <t-form-item label="类型" name="type">
            <t-select
              v-model="formData.type"
              placeholder="请选择提示词类型"
            >
              <t-option value="写作" label="写作" />
              <t-option value="编程" label="编程" />
              <t-option value="分析" label="分析" />
              <t-option value="翻译" label="翻译" />
              <t-option value="创意" label="创意" />
              <t-option value="教育" label="教育" />
              <t-option value="商务" label="商务" />
              <t-option value="通用" label="通用" />
            </t-select>
          </t-form-item>

          <t-form-item label="作者" name="author">
            <t-input
              v-model="formData.author"
              placeholder="请输入您的名称"
              maxlength="50"
            />
          </t-form-item>

          <t-form-item label="标签" name="tags">
            <t-tag-input
              v-model="formData.tags"
              placeholder="输入标签后按回车添加"
              :max="10"
            />
          </t-form-item>

          <t-form-item label="Prompt内容" name="content">
            <t-textarea
              v-model="formData.content"
              placeholder="请输入完整的提示词内容..."
              :autosize="{ minRows: 8, maxRows: 20 }"
              maxlength="5000"
            />
          </t-form-item>

          <t-form-item>
            <t-space>
              <t-button
                theme="primary"
                type="submit"
                :loading="promptStore.loading"
              >
                提交提示词
              </t-button>
              <t-button variant="outline" @click="resetForm">
                重置
              </t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>

      <div class="preview-container">
        <t-card title="预览">
          <div class="preview-content">
            <h3>{{ formData.title || '标题预览' }}</h3>
            <p class="preview-description">
              {{ formData.description || '描述预览' }}
            </p>
            <t-space class="preview-tags">
              <t-tag 
                v-for="model in formData.models" 
                :key="model"
                theme="primary"
              >
                {{ model }}
              </t-tag>
              <t-tag v-if="formData.type" theme="success">
                {{ formData.type }}
              </t-tag>
              <t-tag
                v-for="tag in formData.tags"
                :key="tag"
                variant="outline"
              >
                {{ tag }}
              </t-tag>
            </t-space>
            <div class="preview-content-box">
              <div class="content-header">
                <span class="content-label">提示词内容</span>
                <t-button
                  v-if="formData.content"
                  theme="default"
                  variant="text"
                  size="small"
                  @click="copyContent"
                  class="copy-btn"
                >
                  <template #icon>
                    <copy-icon />
                  </template>
                  复制
                </t-button>
              </div>
              <pre>{{ formData.content || '提示词内容预览...' }}</pre>
            </div>
            <div class="preview-footer">
              <span>作者: {{ formData.author || '作者名称' }}</span>
            </div>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '../stores/prompt'
import { ChevronLeftIcon, CopyIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const promptStore = usePromptStore()
const formRef = ref()

const formData = reactive({
  title: '',
  description: '',
  models: [] as string[],
  type: '',
  author: '',
  tags: [] as string[],
  content: ''
})

const rules = {
  title: [{ required: true, message: '请输入标题' }],
  description: [{ required: true, message: '请输入描述' }],
  models: [{ required: true, message: '请至少选择一个适用模型' }],
  type: [{ required: true, message: '请选择类型' }],
  author: [{ required: true, message: '请输入作者名称' }],
  content: [{ required: true, message: '请输入Prompt内容' }]
}

const handleSubmit = async ({ validateResult }: any) => {
  if (validateResult === true) {
    try {
      // 演示模式：显示成功消息但不实际提交
      MessagePlugin.success('提示词提交成功！（演示模式，数据未保存）')
      router.push('/')
    } catch (error) {
      MessagePlugin.error('提交失败，请重试')
    }
  }
}

const resetForm = () => {
  formRef.value?.reset()
  Object.assign(formData, {
    title: '',
    description: '',
    models: [],
    type: '',
    author: '',
    tags: [],
    content: ''
  })
}

const copyContent = async () => {
  if (!formData.content) return
  
  try {
    await navigator.clipboard.writeText(formData.content)
    MessagePlugin.success('内容已复制到剪贴板')
  } catch (error) {
    MessagePlugin.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.submit-prompt {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(187, 222, 251, 0.3);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(144, 202, 249, 0.2);
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
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

.nav-bar h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  letter-spacing: -0.3px;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 32px;
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

.form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(144, 202, 249, 0.15);
  border: 1px solid rgba(187, 222, 251, 0.3);
}

.preview-container {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.preview-container :deep(.t-card) {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(144, 202, 249, 0.15);
  border: 1px solid rgba(187, 222, 251, 0.3);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.preview-container :deep(.t-card__header) {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
}

.preview-container :deep(.t-card__body) {
  padding: 24px;
}

.preview-content h3 {
  margin: 0 0 16px 0;
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.preview-description {
  color: #718096;
  margin: 0 0 20px 0;
  line-height: 1.7;
  font-size: 15px;
}

.preview-tags {
  margin-bottom: 20px;
}

.preview-content-box {
  background: linear-gradient(135deg, #f3f8ff 0%, #e8f4fd 100%);
  border: 1px solid rgba(187, 222, 251, 0.5);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  max-height: 320px;
  overflow-y: auto;
  position: relative;
}

.preview-content-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #42a5f5 0%, #1e88e5 100%);
  border-radius: 12px 12px 0 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.content-label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.copy-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  opacity: 1;
  color: #42a5f5;
}

.preview-content-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #4a5568;
}

.preview-footer {
  font-size: 14px;
  color: #a0aec0;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  font-weight: 500;
}

/* 表单样式优化 */
:deep(.t-form-item__label) {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

:deep(.t-input), :deep(.t-textarea), :deep(.t-select) {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

:deep(.t-input:focus), :deep(.t-textarea:focus), :deep(.t-select:focus) {
  border-color: #42a5f5;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.15);
}

:deep(.t-button--theme-primary) {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.t-button--theme-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 165, 245, 0.3);
}

:deep(.t-button--variant-outline) {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.t-button--variant-outline:hover) {
  border-color: #42a5f5;
  color: #42a5f5;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .preview-container {
    position: static;
  }
}

@media (max-width: 768px) {
  .nav-bar {
    height: 64px;
  }
  
  .nav-bar h1 {
    font-size: 20px;
  }
  
  .content {
    padding: 20px 16px;
  }
  
  .form-container {
    padding: 24px 20px;
  }
}
</style>