<template>
  <div class="search-input">
    <!-- 问题输入 -->
    <el-input
        v-model="args.query"
        type="textarea"
        :rows="4"
        resize="none"
        placeholder="请输入您的问题..."
        class="query-input"
        @keyup.enter.exact="handleSearch"
    />

    <!-- 配置区域 -->
    <div class="config">
      <div class="config-item">
        <el-button
            :icon="Notebook"
            @click.stop="handleShowKnowledge"
            circle
            size="default"
            class="knowledge-btn"
        ></el-button>

        <span class="label">TopK</span>
        <el-input-number
            v-model="args.topK"
            :min="1"
            :max="100"
            size="small"
            controls-position="right"
        />
      </div>

      <div class="config-item threshold">
        <span class="label">相似度</span>
        <el-slider
            v-model="args.similarityThreshold"
            :min="0"
            :max="1"
            :step="0.01"
            style="width: 160px"
        />
        <span class="value">{{ args.similarityThreshold.toFixed(2) }}</span>
      </div>

      <span  v-if="vectorStore.searchingVector.name == null" class="label">未选择知识库</span>
      <span v-else class="label">{{vectorStore.searchingVector.name}}</span>

      <el-button
          type="primary"
          @click="handleSearch"
          :disabled="!args.query.trim()"
          size="small"
      >
        查询
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElInput, ElInputNumber, ElSlider, ElButton, ElMessage } from 'element-plus';
import { Notebook } from '@element-plus/icons-vue'
import type { VectorSearchArgs } from "@/types/dto/VectorSearchArgs";
import {useVectorStore} from "@/stores";

const vectorStore = useVectorStore();

const args = ref<VectorSearchArgs>({
  query: '',
  topK: 5,
  similarityThreshold: 0.8,
});

const emit = defineEmits<{
  (e: 'search', args: VectorSearchArgs): void;
  (e: 'showKnowledge'): void;
}>();

const handleSearch = () => {
  if (!args.value.query.trim()) return;
  if (vectorStore.searchingVector.name == null) {
    ElMessage.error('未选择知识库' as any);
    return;
  }
  emit('search', args.value);
};

const handleShowKnowledge = () => {
  if (vectorStore.searchingVector.name == null) {
    ElMessage.error('未选择知识库' as any);
    return;
  }
  emit('showKnowledge');
};
</script>

<style scoped>
.search-input {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.query-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  border: 1px solid #e2e6eb;
  font-size: 14px;
  transition: all 0.2s;
}

.query-input :deep(.el-textarea__inner):focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.config {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 6px;
  padding: 0 4px 5px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.threshold {
  flex: 1;
}

.value {
  font-size: 13px;
  color: #409eff;
  font-weight: 500;
  min-width: 36px;
}

.query-input :deep(.el-textarea__inner) {
  padding: 12px 10px;

}

.knowledge-btn {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
  color: #409eff;
  transition: all 0.3s ease;
}

.knowledge-btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.knowledge-btn:active {
  transform: scale(0.95);
}
</style>