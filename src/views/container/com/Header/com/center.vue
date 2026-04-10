<script setup lang="ts">
import { useLoginStore } from "@/stores";
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import { ref } from "vue";
import TaskDialog from "@/views/container/com/Header/com/TaskDiolag.vue";
import { TaskUtil } from "@/utils/TaskUtil";

const loginStore = useLoginStore()
const router = useRouter()

const isVisible = ref<boolean>(false)

const logout = () => {
  loginStore.logout()
  router.push('/login');
  ElMessage.success('已退出登录' as any);
}

const openDialog = () => {
  isVisible.value = true
}

const closeDialog = () => {
  isVisible.value = false
}
</script>

<template>
  <div class="header-buttons">
    <div class="logout-btn" @click="logout">
      退出登录
    </div>
    <div class="task-btn" @click="openDialog">
      📋
    </div>
  </div>

  <TaskDialog
      :task-map="TaskUtil.taskMap"
      :dialog-visible="isVisible"
      @close="closeDialog"
  />
</template>

<style scoped>
.header-buttons {
  position: fixed;
  right: 20px;
  top: 15px;
  z-index: 100;
  display: flex;
  gap: 12px;
}

.task-btn {
  user-select: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px 18px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: white;
  text-align: center;
}

.task-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

.task-btn:active {
  transform: translateY(0) scale(0.98);
}

.logout-btn {
  user-select: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 10px 18px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.logout-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 1);
}

.logout-btn:active {
  transform: translateY(0) scale(0.98);
}

@media (max-width: 768px) {
  .header-buttons {
    right: 10px;
    top: 10px;
    gap: 8px;
  }

  .task-btn, .logout-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>