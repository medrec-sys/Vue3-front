<template>
  <div class="knowledge-top-bar">

    <div class="bar-center">
      <el-input
          v-model="knowledgeStore.pageQuery.query.name"
          placeholder="搜索文档名称..."
          clearable
          prefix-icon="Search"
          size="default"
          class="search-input"
          @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button
              :icon="Search"
              @click="handleSearch"
              class="search-btn"
          >搜索</el-button>
        </template>
      </el-input>
    </div>

    <div class="bar-right">
      <el-upload
          ref="uploadRef"
          :show-file-list="false"
          :on-change="handleAdd"
          :auto-upload="false"
          accept=".pdf"
      >
        <el-button
            type="primary"
            :icon="Plus"
            class="add-btn"
        >
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Search, Plus } from '@element-plus/icons-vue'
import {useKnowledgeStore, useVectorStore} from "@/stores";
import { ref } from "vue";
import { ElMessage } from "element-plus";

const knowledgeStore = useKnowledgeStore()
const vectorStore = useVectorStore()

const uploadRef = ref(null)

// 搜索
const handleSearch = () => {
  knowledgeStore.fetchKnowledgePage()
}

// 添加知识库
const handleAdd = async (file: { raw: File }) => {
  const f = file.raw;
  const res = await knowledgeStore.createKnowledge(f, vectorStore.searchingVector.id)
  if (res.code) {
    ElMessage.success('添加成功' as any);
  } else {
    ElMessage.error('添加失败' as any);
  }
}
</script>
// KnowledgeTopBar.vue
<style scoped>
.knowledge-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

/* 中间区域 */
.bar-center {
  flex: 1;
  max-width: 450px;
  min-width: 200px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 14px 0 0 14px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px #667eea inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #667eea inset, 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
}

.search-btn {
  border-radius: 0 14px 14px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border: 1px solid #e4e7ed;
  border-left: none;
  color: #606266;
  transition: all 0.3s ease;
  font-weight: 500;
}

.search-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: translateX(2px);
}

/* 右侧区域 */
.bar-right {
  flex-shrink: 0;
}

.add-btn {
  border-radius: 14px;
  padding: 10px 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.45);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
}

.add-btn:active {
  transform: translateY(0);
}

.add-btn :deep(.el-icon) {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-top-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
  }

  .bar-center {
    max-width: 100%;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>