<script setup lang="ts">
import {useLoginStore} from "@/stores";
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";

const loginStore = useLoginStore()
const router = useRouter()

const logout = () => {
  loginStore.logout()
  // 可选：跳转到登录页
  router.push('/login');

  ElMessage.success('已退出登录' as any);
}

</script>

<template>
  <div class="center-box"
    @click="logout"
  >
    退出登录
  </div>

</template>

<style scoped>
.center-box {
  user-select: none;
  position: fixed;
  right: 20px;
  top: 15px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1px);
  padding: 10px 15px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.center-box:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.7);
}

.center-box:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s ease;
}

@media (max-width: 768px) {
  .center-box {
    right: 10px;
    top: 10px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .center-box:hover {
    transform: translateY(-1px) scale(1.01);
  }
}
</style>