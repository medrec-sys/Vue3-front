<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <h2 class="title">Ai智能体管理</h2>
    </div>
    <div class="top-bar-right">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加知识库
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

interface Emits {
  (e: 'add'): void
}

const emit = defineEmits<Emits>()

const handleAdd = () => {
  emit('add')
}
</script>
// TopBar.vue
<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 0;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.top-bar-right :deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.top-bar-right :deep(.el-button--primary):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

.top-bar-right :deep(.el-button--primary):active {
  transform: translateY(0);
}

.top-bar-right :deep(.el-button--primary .el-icon) {
  margin-right: 6px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 12px 16px;
  }

  .title {
    font-size: 18px;
  }

  .top-bar-right :deep(.el-button--primary) {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>