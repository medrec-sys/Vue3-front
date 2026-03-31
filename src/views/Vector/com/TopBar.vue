<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <h2 class="title">知识库管理</h2>
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

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
  border-radius: 8px 8px 0 0;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>