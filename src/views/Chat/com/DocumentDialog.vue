<script setup lang="ts">
import CardList from "@/views/Search/com/CardList.vue";
import {useAiChatStore} from "@/stores";
import type {Document} from "@/types/entity/Document";
import {onMounted} from "vue";

interface Emits {
  (e: "showFile", doc: Document): void;
  (e: "close"): void;
}

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<Emits>();

const chatStore = useAiChatStore();

const showFile = (doc: Document) => {
  emit("showFile", doc);
};

const close = () => {
  emit("close");
};

onMounted(async () => {
  await chatStore.getVectors();
})
</script>

<template>
  <el-dialog
      v-model="props.visible"
      width="1000px"
      :align-center="true"
      @close="close"
  >
    <CardList
        class="card-list"
        :documents="chatStore.searchingVectors"
        @showFile="showFile"
    ></CardList>
</el-dialog>
</template>

<style scoped>
.card-list {
  height: 800px;
}
</style>