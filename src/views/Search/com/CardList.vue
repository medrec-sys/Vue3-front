<template>
  <div class="card-list">
    <!-- 头部统计信息 -->
    <div class="list-header" v-if="documents.length > 0">
      <div class="stats">
        <el-icon><DocumentCopy /></el-icon>
        <span>共找到 <strong>{{ documents.length }}</strong> 条相关结果</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-if="documents.length === 0">
      <el-empty description="暂无搜索结果" :image-size="120" />
    </div>

    <!-- 卡片列表 -->
    <div class="cards-container">
      <Card
          v-for="(document, index) in documents"
          :key="index"
          :document="document"
          class="card-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @showFile="showFile"
      />
    </div>

    <!-- 底部加载更多（可选） -->
    <div class="list-footer" v-if="documents.length > 0">
      <el-divider>
        <el-icon><Check /></el-icon>
        <span>已显示全部结果</span>
      </el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "@/views/Search/com/Card.vue";
import type { Document } from "@/types/entity/Document";
import {Check,DocumentCopy  } from '@element-plus/icons-vue';

defineProps<{
  documents: Document[]
}>();

interface Emits {
  (e: 'showFile', document: Document): void;
}

const emit = defineEmits<Emits>();

const showFile = ( document: Document) => {
  emit('showFile',  document);
};

</script>

<style scoped>
.card-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;


  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto; /* 垂直滚动条 */
}

/* 头部统计信息 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafbfc;
  border-radius: 12px;
  margin-bottom: 20px;
  animation: fadeInDown 0.4s ease;
}

.stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5a6874;
}

.stats .el-icon {
  font-size: 18px;
  color: #409eff;
}

.stats strong {
  color: #409eff;
  font-size: 18px;
  margin: 0 2px;
}

.sort-hint .el-icon {
  font-size: 14px;
}

/* 卡片容器 */
.cards-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  margin: -4px;
}

.card-item {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条美化 */
.cards-container::-webkit-scrollbar {
  width: 6px;
}

.cards-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.cards-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.cards-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 底部区域 */
.list-footer {
  margin-top: 20px;
  padding: 8px 0;
}

.list-footer :deep(.el-divider) {
  margin: 0;
}

.list-footer :deep(.el-divider__text) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  background-color: transparent;
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  animation: fadeInUp 0.4s ease;
}

/* 响应式 */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .stats strong {
    font-size: 16px;
  }
}
</style>