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

<style scoped>
.knowledge-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}


/* 中间区域 */
.bar-center {
  flex: 1;
  max-width: 400px;
  min-width: 200px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px #409eff inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.search-btn {
  border-radius: 0 8px 8px 0;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-left: none;
  color: #606266;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

/* 右侧区域 */
.bar-right {
  flex-shrink: 0;
}

.add-btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
}

.add-btn:active {
  transform: translateY(0);
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