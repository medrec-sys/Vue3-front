<template>
  <div class="card-list-container">
    <!-- 空状态 -->
    <div v-if="!agents || agents.length === 0" class="empty-state">
      <el-icon :size="48"><FolderOpened /></el-icon>
      <p>暂无向量库数据</p>
    </div>

    <!-- 卡片网格 -->
    <div v-else class="card-grid">
      <Card
          v-for="agent in agents"
          :key="agent.id"
          :agent="agent"
          @alert="alert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'
import type {Agent} from "@/types/entity/Agent";
import Card from "@/views/Agent/com/Card.vue";

// 定义组件 props
interface Props {
  agents: Agent[]
}

defineProps<Props>()

interface Emits {
  (e: 'alert', agents: Agent): void
}

const emit = defineEmits<Emits>()

const alert = (agents: Agent) => {
  emit('alert', agents)
}
</script>

<style scoped>
.card-list-container {
  width: 100%;
  height: 100%; /* 或设置固定高度，如 600px */
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto; /* 垂直滚动条 */
  /* overflow: auto;  水平和垂直滚动条 */
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);
}



.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}

/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: start;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .card-list-container {
    padding: 16px;
  }

  .card-grid {
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>