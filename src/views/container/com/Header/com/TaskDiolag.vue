<script setup lang="ts">
import type { Task } from "@/types/dto/Task";
import { ref, watch } from "vue";
import { Document } from '@element-plus/icons-vue'
const isVisible = ref<boolean>(false);

const props = defineProps<{
  taskMap: Map<string, Task>
  dialogVisible: boolean
}>();

interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>();

const getTaskTagType = (code: number) => {
  if (code === 1) return 'success';
  if (code === -1) return 'danger';
  return 'info';
};

const getTaskStatusText = (code: number) => {
  if (code === 1) return '已完成';
  if (code === -1) return '失败';
  return '进行中';
};

const handleClose = () => {
  emit('close');
};

watch(() => props.dialogVisible, (newVal) => {
  isVisible.value = newVal
}, { immediate: true })
</script>

<template>
  <el-dialog
      v-model="isVisible"
      @close="handleClose"
      :append-to-body="true"
      title="任务列表"
      width="500px"
      class="task-dialog"
  >
    <div v-if="taskMap.size === 0" class="empty-tasks">
      <el-empty description="暂无进行中的任务" :image-size="80" />
    </div>
    <div v-else class="task-list">
      <div v-for="[taskId, task] in taskMap" :key="taskId" class="task-item">
        <div class="task-icon">
          <el-icon :size="24">
            <Document />
          </el-icon>
        </div>
        <div class="task-info">
          <div class="task-title">{{ task.description }}</div>
          <div class="task-meta">
            <span class="task-status-text">{{ task.status }}</span>
            <el-tag :type="getTaskTagType(task.code)" size="small">
              {{ getTaskStatusText(task.code) }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.task-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.task-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.task-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.task-list {
  max-height: 450px;
  overflow-y: auto;
}

.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.task-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
}

.task-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 12px;
  color: #667eea;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
  word-break: break-all;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.task-status-text {
  font-size: 12px;
  color: #909399;
}

.empty-tasks {
  padding: 40px 20px;
  text-align: center;
}
</style>