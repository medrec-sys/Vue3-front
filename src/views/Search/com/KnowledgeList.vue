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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore, useVectorStore } from "@/stores"
import { onMounted } from "vue"
import KnowledgeCard from "@/components/KnowledgeCard.vue"
import { Loading, FolderOpened } from '@element-plus/icons-vue'

const knowledgeStore = useKnowledgeStore()
const vectorStore = useVectorStore()

// 加载知识库列表
const loadKnowledgeList = async () => {
  if (!vectorStore.searchingVector?.id) {
    return
  }

  knowledgeStore.pageQuery.query.vectorId = vectorStore.searchingVector.id
  await knowledgeStore.fetchKnowledgePage()
}


onMounted(async () => {
  await loadKnowledgeList()
})
</script>

<style scoped>
.knowledge-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #f5f7fa;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #909399;
}

.loading-state .el-icon {
  margin-bottom: 16px;
  animation: rotating 2s linear infinite;
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
}

.empty-state .el-icon {
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* 知识库列表样式 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .knowledge-container {
    padding: 12px;
  }

  .knowledge-list {
    gap: 8px;
  }
}
</style>