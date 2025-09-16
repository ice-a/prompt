import { defineStore } from 'pinia'
import rolesData from '@/assets/roles.json'

export interface Prompt {
  _id?: string
  title: string
  content: string
  models: string[]
  type: string
  author: string
  uploadTime?: Date
  tags: string[]
  description: string
}

// 转换原始数据格式到我们的 Prompt 格式
const convertRoleToPrompt = (role: any, index: number): Prompt => {
  // 根据角色名称推断类型
  const getType = (act: string): string => {
    if (act.includes('翻译') || act.includes('英')) return '翻译'
    if (act.includes('写作') || act.includes('文章')) return '写作'
    if (act.includes('编程') || act.includes('代码') || act.includes('终端')) return '编程'
    if (act.includes('教学') || act.includes('老师') || act.includes('教育')) return '教育'
    if (act.includes('分析') || act.includes('数据')) return '分析'
    if (act.includes('创意') || act.includes('设计')) return '创意'
    if (act.includes('商务') || act.includes('商业')) return '商务'
    return '通用'
  }

  // 根据角色名称生成标签
  const getTags = (act: string): string[] => {
    const tags = ['实用']
    if (act.includes('充当') || act.includes('担任')) tags.push('角色扮演')
    if (act.includes('翻译')) tags.push('翻译')
    if (act.includes('写作')) tags.push('写作')
    if (act.includes('编程')) tags.push('编程')
    if (act.includes('教育')) tags.push('教育')
    if (act.includes('英语')) tags.push('英语')
    return tags
  }

  return {
    _id: `role_${index}`,
    title: role.act,
    content: role.prompt,
    models: ['GPT-4', 'Claude', 'Gemini'], // 默认支持的模型
    type: getType(role.act),
    author: '系统',
    uploadTime: new Date(),
    tags: getTags(role.act),
    description: `${role.act}相关的提示词模板`
  }
}

export const usePromptStore = defineStore('prompt', {
  state: () => ({
    prompts: [] as Prompt[],
    currentPrompt: null as Prompt | null,
    loading: false,
    searchQuery: ''
  }),

  getters: {
    filteredPrompts: (state) => {
      return state.prompts.filter(prompt => {
        const matchesSearch = !state.searchQuery || 
          prompt.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
        
        return matchesSearch
      })
    }
  },

  actions: {
    async fetchPrompts() {
      this.loading = true
      try {
        // 从本地 JSON 文件加载数据
        this.prompts = rolesData.map((role, index) => convertRoleToPrompt(role, index))
      } catch (error) {
        console.error('获取提示词失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPromptById(id: string) {
      this.loading = true
      try {
        const prompt = this.prompts.find(p => p._id === id)
        this.currentPrompt = prompt || null
      } catch (error) {
        console.error('获取Prompt详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    }
  }
})