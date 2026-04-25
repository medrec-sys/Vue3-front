<script setup lang="ts">


import {onMounted} from "vue";
import {TaskUtil} from "@/utils/TaskUtil";
import File from "@/components/File.vue";

onMounted(
    () => {
      TaskUtil.startPolling()
  }
)
</script>

<template>
<!--  <File-->
<!--      url="http://localhost:9090/medrec/1/7/1777275869229.pdf"-->
<!--      name="1"-->
<!--      :page="4"-->
<!--      :bbox="[101, 480, 866, 573]"-->
<!--  ></File>-->
  <RouterView></RouterView>
</template>

<style scoped>
</style>
