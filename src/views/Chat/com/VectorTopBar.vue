<!-- VectorTopBar.vue -->
<template>
  <div class="knowledge-top-bar">
    <div class="bar-left">
      <span class="knowledge-title">📚 知识库管理</span>
      <span class="knowledge-count">{{ vectorStore.vectorsWithAgentId.length }} 个向量库</span>
    </div>
    <div class="bar-right">
      <el-popover
          :visible="popoverVisible"
          placement="bottom-end"
          :width="340"
          :popper-style="{ padding: '0' }"
          :show-arrow="false"
          @show="handlePopoverShow"
      >
        <div class="select-popover">
          <div class="popover-header">
            <span class="popover-title">✨ 添加向量库</span>
            <el-button
                text
                :icon="Close"
                size="small"
                @click="popoverVisible = false"
            />
          </div>
          <div class="popover-content">
            <el-select
                v-model="selectedVector"
                placeholder="搜索或选择向量库"
                class="popover-select"
                size="large"
                filterable
                popper-class="vector-select-popper"
                @change="handleSelectChange"
            >
              <el-option
                  v-for="item in filter(vectorStore.vectors)"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
              >
                <div class="select-option">
                  <span class="option-name">{{ item.name }}</span>
                  <el-tag size="small" type="info" class="option-dim">维度: {{ item.dim }}</el-tag>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="popover-footer">
            <el-button @click="popoverVisible = false">取消</el-button>
            <el-button
                type="primary"
                :disabled="!selectedVector?.id"
                :loading="isLoading"
                @click="handleConfirmAdd"
            >
              确认添加
            </el-button>
          </div>
        </div>

        <template #reference>
          <el-button
              type="primary"
              :icon="Plus"
              class="add-btn"
              :class="{ 'is-active': popoverVisible }"
              @click="togglePopover"
          />
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Close } from '@element-plus/icons-vue'
import { useAgentStore, useVectorStore } from "@/stores";
import { ElMessage } from "element-plus";
import type { Vector } from "@/types/entity/Vector";
import { onMounted, ref } from "vue";

const agentStore = useAgentStore()
const vectorStore = useVectorStore()

const selectedVector = ref<Vector | null>(null)
const popoverVisible = ref(false)
const isLoading = ref(false)

const togglePopover = () => {
  if (!agentStore.usingAgent?.id) {
    ElMessage.warning('请先选择智能体')
    return
  }
  popoverVisible.value = !popoverVisible.value
}

const handlePopoverShow = () => {
  selectedVector.value = null
}

const handleSelectChange = (value: Vector) => {
  selectedVector.value = value
}

const handleConfirmAdd = async () => {
  if (!selectedVector.value?.id) {
    ElMessage.warning('请选择向量库')
    return
  }

  isLoading.value = true
  try {
    const res = await agentStore.addVectorToAgent(selectedVector.value.id)
    if (res.code === 1) {
      ElMessage.success(`成功添加向量库：${selectedVector.value.name}`)
      popoverVisible.value = false
      selectedVector.value = null
      await vectorStore.getVectorsByAgentId(agentStore.usingAgent.id)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('添加失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const filter = (vectors: Vector[]): Vector[] => {
  return vectors.filter(vector => !vectorStore.vectorsWithAgentId.some(v => v.id === vector.id))
}

onMounted(async () => {
  await vectorStore.fetchVectorPage()
})
</script>

<style scoped lang="scss">
.knowledge-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);

  .bar-left {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .knowledge-title {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
    }

    .knowledge-count {
      font-size: 12px;
      font-weight: 500;
      color: #667eea;
      background: rgba(102, 126, 234, 0.12);
      padding: 4px 10px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }
  }
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.06);
    box-shadow: 0 8px 22px rgba(102, 126, 234, 0.45);
    background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.96);
  }

  &.is-active {
    transform: rotate(45deg);
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 4px 14px rgba(240, 147, 251, 0.35);

    &:hover {
      transform: rotate(45deg) translateY(-2px) scale(1.06);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #c0c4cc 0%, #a0a4ab 100%);
    box-shadow: none;
    transform: none;
  }

  :deep(.el-icon) {
    font-size: 22px;
    color: white;
  }
}

.select-popover {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  animation: fadeIn 0.25s ease-out;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);

  .popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
    border-bottom: 1px solid rgba(102, 126, 234, 0.12);

    .popover-title {
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.3px;
    }

    :deep(.el-button) {
      color: #909399;
      padding: 0;
      transition: all 0.25s ease;

      &:hover {
        color: #667eea;
        transform: rotate(90deg) scale(1.1);
      }
    }
  }

  .popover-content {
    padding: 20px;

    .popover-select {
      width: 100%;

      :deep(.el-input__wrapper) {
        border-radius: 14px;
        background: #f8f9fa;
        border: 1.5px solid transparent;
        transition: all 0.3s;
        box-shadow: none;
        padding: 4px 12px;

        &:hover {
          background: #ffffff;
          border-color: rgba(102, 126, 234, 0.4);
        }

        &.is-focus {
          background: #ffffff;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
        }
      }

      :deep(.el-input__inner) {
        font-size: 14px;
        font-weight: 500;
        color: #2c3e50;
      }
    }
  }

  .popover-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 14px 20px;
    background: #fafbfc;
    border-top: 1px solid rgba(0, 0, 0, 0.05);

    :deep(.el-button) {
      border-radius: 12px;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    :deep(.el-button--primary) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
      }

      &:disabled {
        background: linear-gradient(135deg, #c0c4cc 0%, #a0a4ab 100%);
        opacity: 0.6;
      }
    }
  }
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;

  .option-name {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option-dim {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 500;
    padding: 0 10px;
    height: 24px;
    line-height: 22px;
    background: linear-gradient(135deg, #ecf5ff 0%, #e8f0fe 100%);
    border: none;
    color: #667eea;
    border-radius: 14px;
  }
}

:deep(.el-select-dropdown) {
  border-radius: 18px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.15);
  overflow: hidden;
  margin-top: 8px;

  .el-select-dropdown__item {
    padding: 12px 18px;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
      color: #667eea;
      font-weight: 600;
    }
  }

  .el-select-dropdown__wrap {
    max-height: 340px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.3);
      border-radius: 10px;

      &:hover {
        background: rgba(102, 126, 234, 0.5);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .knowledge-top-bar {
    padding: 12px 16px;

    .bar-left {
      gap: 10px;

      .knowledge-title {
        font-size: 15px;
      }

      .knowledge-count {
        font-size: 11px;
        padding: 3px 8px;
      }
    }
  }

  .add-btn {
    width: 40px;
    height: 40px;

    :deep(.el-icon) {
      font-size: 20px;
    }
  }

  .select-popover {
    .popover-header {
      padding: 14px 16px;

      .popover-title {
        font-size: 15px;
      }
    }

    .popover-content {
      padding: 16px;
    }

    .popover-footer {
      padding: 12px 16px;

      :deep(.el-button) {
        padding: 6px 16px;
      }
    }
  }

  .select-option {
    .option-dim {
      display: none;
    }
  }
}
</style>