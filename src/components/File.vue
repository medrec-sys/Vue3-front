<template>
  <div class="pdf-viewer">
    <!-- PDF 标题栏 -->
    <div class="top-bar">
      <div class="bar-left">
        <el-button
            type="primary"
            @click="close"
            :icon="Close"
            round
            size="small"
            class="action-btn"
        />
        <el-button
            round
            type="primary"
            size="small"
            :icon="Download"
            @click="downloadPdf"
            class="action-btn"
        />
      </div>
      <div class="bar-center">
        <span class="pdf-name" :title="name">{{ name }}</span>
      </div>
      <div class="bar-right">
        <span class="page-number">第 {{ page }} 页</span>
      </div>
    </div>

    <!-- PDF 渲染区域 -->
    <div class="pdf-container">
      <iframe
          :key="`pdf-${url}-${page}`"
          :src="`${url}#toolbar=0&page=${page}`"
          type="application/pdf"
          class="pdf-content"
          loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close, Download } from "@element-plus/icons-vue";
import { FileUtils } from "@/utils/filrUtil";

const props = defineProps<{
  showRight: boolean
  url: string
  name: string
  page: number
}>()

interface Emits {
  (e: 'close'): void;
}

const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

// 下载 PDF
const downloadPdf = () => {
  FileUtils.downloadFile(props.name, props.url)
};
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.pdf-viewer:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 顶部标题栏 - 优化布局和视觉 */
.top-bar {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  backdrop-filter: blur(8px);
}

/* 左侧按钮区域 */
.bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 中间文件名区域 */
.bar-center {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

/* 右侧页码区域 */
.bar-right {
  flex-shrink: 0;
}

/* 优化按钮样式 */
.action-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

/* 文件名样式 - 优化文字溢出处理 */
.pdf-name {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  letter-spacing: 0.3px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  display: inline-block;
  padding: 4px 0;
}

/* 页码显示样式 - 更现代化的设计 */
.page-number {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  display: inline-block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

/* PDF 容器 - 优化背景和滚动 */
.pdf-container {
  flex: 1;
  position: relative;
  background: #eef2f6;
  overflow: auto;
}

/* PDF 内容 - 确保完美填充和滚动 */
.pdf-content {
  width: 100%;
  height: 100%;
  border: none;
  background: #fefefe;
  display: block;
}

/* 响应式适配 - 小屏幕优化 */
@media (max-width: 768px) {
  .top-bar {
    padding: 10px 16px;
    gap: 12px;
  }

  .pdf-name {
    font-size: 13px;
    max-width: 180px;
  }

  .page-number {
    font-size: 12px;
    padding: 3px 10px;
  }

  .action-btn {
    padding: 8px;
  }
}

/* 优化加载状态 - 添加平滑过渡 */
.pdf-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1;
}


@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 确保内容区域无额外边距 */
* {
  box-sizing: border-box;
}
</style>