<template>
  <el-card class="document-card" shadow="hover" :body-style="{ padding: '20px' }">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <!-- 左侧元数据 -->
      <div class="meta-left">
        <div class="meta-badge" v-if="document.metadata.name">
          <el-icon><DocumentChecked /></el-icon>
          <span>{{ document.metadata.name }}</span>
        </div>
        <div class="meta-badge" v-if="document.metadata.page">
          <el-icon><Notebook /></el-icon>
          <span>第 {{ document.metadata.page }} 页</span>
        </div>
        <div class="meta-badge distance">
          <el-icon><TrendCharts /></el-icon>
          <span>相似距离：{{ document.metadata.distance.toFixed(4) }}</span>
        </div>
      </div>

      <!-- 右侧链接按钮 -->
      <div class="link-right" v-if="document.metadata.url">
        <el-button
            type="primary"
            :icon="Link"
            circle
            class="link-btn"
            @click="showFile(document)"
        />
      </div>
    </div>

    <!-- 核心内容 -->
    <div class="document-content">
      <p class="text">{{ document.text }}</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Document } from '@/types/entity/Document'
import { DocumentChecked, Notebook, TrendCharts, Link } from '@element-plus/icons-vue'

defineProps<{
  document: Document
}>()

interface Emits {
  (e: 'showFile', document: Document): void;
}

const emit = defineEmits<Emits>();

const showFile = ( document: Document) => {
  emit('showFile',  document);
};

</script>

<style scoped>
.document-card {
  width: 100%;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.document-card :deep(.el-card__header) {
  padding: 0;
  border: none;
}

.document-card :deep(.el-card__body) {
  padding: 20px;
}

/* 顶部布局 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

/* 左侧元数据 */
.meta-left {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 12px;
  color: #5a6874;
  transition: all 0.2s ease;
}

.meta-badge:hover {
  background: #ecf5ff;
  color: #409eff;
}

.meta-badge .el-icon {
  font-size: 14px;
}

.meta-badge.distance {
  background: linear-gradient(135deg, #e8f5e9 0%, #e0f2e9 100%);
  color: #2e7d32;
}

.meta-badge.distance .el-icon {
  color: #4caf50;
}

/* 右侧链接按钮 */
.link-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.link-btn:hover {
  transform: translateX(2px) rotate(5deg);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.link-btn:active {
  transform: translateX(1px) rotate(3deg);
}

/* 文档主体内容 */
.document-content {
  padding: 4px 0;
}

.text {
  line-height: 1.8;
  color: #2c3e50;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  text-align: justify;
  letter-spacing: 0.3px;
}

/* 响应式 */
@media (max-width: 768px) {
  .meta-left {
    gap: 8px;
  }

  .meta-badge {
    padding: 2px 8px;
    font-size: 11px;
  }

  .text {
    font-size: 13px;
    line-height: 1.6;
  }
}
</style>