<template>
  <MainAsideLayout
      :show-aside="showRight"
      @close="showRight = false"
  >
    <!-- 左侧主页面 -->
    <template #main>
      <div>这里是主页面内容</div>
    </template>

    <!-- 右侧页面 -->
    <template #aside>
      <div>这里是右侧面板内容</div>
    </template>
  </MainAsideLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainAsideLayout from "@/components/MainAsideLayout.vue";

// 唯一控制参数
const showRight = ref(false)
</script>