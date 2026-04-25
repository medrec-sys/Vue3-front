<template>
  <div class="knowledge-container">
    <!-- 加载状态 -->
    <div v-if="knowledgeStore.loading" class="loading-state">
      <el-icon class="is-loading" :size="32">
        <Loading />
      </el-icon>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="knowledgeStore.knowledges.length === 0" class="empty-state">
      <el-icon :size="48">
        <FolderOpened />
      </el-icon>
      <p>暂无知识</p>
    </div>

    <!-- 知识库列表 -->
    <div v-else class="knowledge-list">
      <KnowledgeCard
          v-for="knowledge in knowledgeStore.knowledges"
          :key="knowledge.id"
          :knowledge="knowledge"
          @showFile="showFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from "@/stores"
import KnowledgeCard from "@/views/Search/com/KnowledgeCard.vue"
import { Loading, FolderOpened } from '@element-plus/icons-vue'
import type {Knowledge} from "@/types/entity/Knowledge";

const knowledgeStore = useKnowledgeStore()

interface Emits {
  (event: 'showFile', doc: Knowledge) : void
}

const emit = defineEmits<Emits>()

const showFile = (doc: Knowledge) => {
  emit('showFile', doc)
}

</script>
// KnowledgeList.vue
<style scoped>
.knowledge-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  overflow-y: auto;
}

/* 自定义滚动条 */
.knowledge-container::-webkit-scrollbar {
  width: 6px;
}

.knowledge-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.knowledge-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.knowledge-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #667eea;
}

.loading-state .el-icon {
  margin-bottom: 16px;
  animation: rotating 2s linear infinite;
  color: #667eea;
}

.loading-state p {
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #8f8a8a;
  animation: fadeIn 0.4s ease;
}

.empty-state .el-icon {
  margin-bottom: 20px;
  color: #cbd5e1;
  filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.15));
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 知识库列表样式 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin: 0 auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .knowledge-container {
    padding: 16px;
  }

  .knowledge-list {
    gap: 10px;
  }

  .loading-state,
  .empty-state {
    height: 300px;
  }
}
</style>