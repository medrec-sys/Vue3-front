<template>
  <el-card class="document-card" shadow="hover" :body-style="{ padding: '20px' }">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <!-- 左侧元数据 -->
      <div class="meta-left">
        <div class="meta-badge" v-if="document.metadata.name">
          <el-icon>
            <DocumentChecked/>
          </el-icon>
          <span>{{ document.metadata.name }}</span>
        </div>
        <div class="meta-badge" v-if="document.metadata.page">
          <el-icon>
            <Notebook/>
          </el-icon>
          <span>第 {{ document.metadata.page }} 页</span>
        </div>
        <div class="meta-badge distance">
          <el-icon>
            <TrendCharts/>
          </el-icon>
          <span>相似度：{{ document.score }}</span>
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
      <p class="text" v-html="markDownIt.render(document.text)"></p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type {Document} from '@/types/entity/Document'
import {DocumentChecked, Notebook, TrendCharts, Link} from '@element-plus/icons-vue'
import {markDownIt} from "@/utils/tools";

defineProps<{
  document: Document
}>()

interface Emits {
  (e: 'showFile', document: Document): void;
}

const emit = defineEmits<Emits>();

const showFile = (document: Document) => {
  emit('showFile', document);
};

</script>
// Card.vue
<style scoped>
.document-card {
  width: 100%;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.08);
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
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
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
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
  padding: 4px 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #5a6874;
  transition: all 0.2s ease;
}

.meta-badge:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  color: #667eea;
  transform: translateY(-1px);
}

.meta-badge .el-icon {
  font-size: 14px;
}

.meta-badge.distance {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%);
  color: #667eea;
}

.meta-badge.distance .el-icon {
  color: #667eea;
}

/* 右侧链接按钮 */
.link-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.link-btn:hover {
  transform: translateX(2px) rotate(5deg) scale(1.05);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.45);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

.link-btn:active {
  transform: translateX(1px) rotate(3deg) scale(0.98);
}

/* 文档主体内容 */
.document-content {
  padding: 4px 0;
}

.text * {
  user-select: text;
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
    padding: 3px 10px;
    font-size: 11px;
  }

  .text {
    font-size: 13px;
    line-height: 1.65;
  }
}
</style>