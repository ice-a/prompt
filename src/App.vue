<template>
  <Analytics />
  <SpeedInsights />
  <div id="app">
    
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
// App组件入口
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* 防止水平滚动 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
  background-color: #f8fafc;
}

#app {
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
  display: flex;
  flex-direction: column;
}

/* 确保路由视图占满整个屏幕 */
.router-view {
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* 全局容器样式 */
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

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式字体大小 */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  html {
    font-size: 15px;
  }
}

@media (min-width: 1025px) {
  html {
    font-size: 16px;
  }
}

/* 防止元素超出视口 */
* {
  max-width: 100%;
}

/* 图片响应式 */
img {
  max-width: 100%;
  height: auto;
}

/* 表格响应式 */
table {
  width: 100%;
  table-layout: fixed;
}

/* 防止长文本溢出 */
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式网格 */
.grid-responsive {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1440px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }
}
</style>