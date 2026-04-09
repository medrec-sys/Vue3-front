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

// Input.vue (Search 页面的输入组件)
<style scoped>
.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.search-input:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.2);
}

.query-input :deep(.el-textarea__inner) {
  border-radius: 20px;
  border: 1.5px solid #e4e7ed;
  font-size: 14px;
  transition: all 0.3s;
  background: #fafbfc;
  font-family: inherit;
  padding: 14px 16px;
}

.query-input :deep(.el-textarea__inner):hover {
  border-color: #c0c4cc;
  background: white;
}

.query-input :deep(.el-textarea__inner):focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.config {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  padding: 0 8px 12px;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.threshold {
  flex: 1;
  min-width: 200px;
}

.value {
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 36px;
}

.knowledge-btn {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  transition: all 0.3s ease;
}

.knowledge-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.knowledge-btn:active {
  transform: scale(0.96);
}

/* 滑动条样式优化 */
.config-item :deep(.el-slider__runway) {
  background: #e4e7ed;
}

.config-item :deep(.el-slider__bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.config-item :deep(.el-slider__button) {
  border-color: #667eea;
}

/* 数字输入框优化 */
.config-item :deep(.el-input-number) {
  width: 100px;
}

.config-item :deep(.el-input-number .el-input__wrapper) {
  border-radius: 12px;
}

.config-item :deep(.el-input-number .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

/* 查询按钮 */
.config :deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.config :deep(.el-button--primary):hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

.config :deep(.el-button--primary):active {
  transform: translateY(0);
}

.config :deep(.el-button--primary.is-disabled) {
  background: linear-gradient(135deg, #cbd5e0 0%, #e2e8f0 100%);
}

@media (max-width: 768px) {
  .config {
    gap: 12px;
  }

  .threshold {
    min-width: 160px;
  }

  .label {
    font-size: 12px;
  }
}
</style>