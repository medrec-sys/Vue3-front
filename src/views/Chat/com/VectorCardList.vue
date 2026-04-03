<template>
  <div class="vectors-container">
    <!-- 空状态 -->
    <div v-if="vectorStore.vectorsWithAgentId.length === 0" class="empty-state">
      <el-empty description="暂无向量库" :image-size="120">
      </el-empty>
    </div>

    <!-- 向量库列表 -->
    <div v-else class="vectors-list">
      <VectorCard
          v-for="vector in vectorStore.vectorsWithAgentId"
          :key="vector.id"
          :vector="vector"
          @remove="remove"
          @showFile="showFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentStore, useVectorStore } from "@/stores";
import type { Vector } from "@/types/entity/Vector";
import { onMounted } from "vue";
import VectorCard from "@/views/Chat/com/VectorCard.vue";
import {ElMessage} from "element-plus";
import type {Knowledge} from "@/types/entity/Knowledge";

const agentStore = useAgentStore();
const vectorStore = useVectorStore();

interface Emits {
  (e: 'showFile', doc:  Knowledge): void
}
const emit = defineEmits<Emits>();

// 加载向量库列表
const loadVectors = async () => {
  if (agentStore.usingAgent.id == null) return;
  await vectorStore.getVectorsByAgentId(agentStore.usingAgent.id);
};

const remove = async (vector:  Vector) => {
  const res = await agentStore.removeVectorFromAgent(vector.id);
  if (res.code === 1) {
    ElMessage.success('删除成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
  await loadVectors();
};

const showFile = (doc: Knowledge) => {
  emit('showFile', doc)
}


onMounted(() => {
  loadVectors();
});
</script>

<style scoped lang="scss">
.vectors-container {
  padding: 16px;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;

    &:hover {
      background: #c0c4cc;
    }
  }
}

.vectors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state {
  padding: 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>