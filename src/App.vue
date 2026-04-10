<script setup lang="ts">


import {onMounted} from "vue";
import {TaskUtil} from "@/utils/TaskUtil";

onMounted(
    () => {
      TaskUtil.startPolling()
  }
)
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
