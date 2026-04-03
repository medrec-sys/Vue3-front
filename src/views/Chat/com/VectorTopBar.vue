<template>
  <div class="knowledge-top-bar">
    <div class="bar-right">
      <el-popover
          :visible="popoverVisible"
          placement="bottom-end"
          :width="300"
          :popper-style="{ padding: '0' }"
          @show="handlePopoverShow"
      >
        <div class="select-popover">
          <div class="popover-header">
            <span class="popover-title">选择向量库</span>
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
                placeholder="请选择向量库"
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
    ElMessage.warning('请先选择智能体' as any)
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
    ElMessage.warning('请选择向量库' as any)
    return
  }

  isLoading.value = true
  try {
    const res = await agentStore.addVectorToAgent(selectedVector.value.id)
    if (res.code === 1) {
      ElMessage.success(`成功添加向量库：${selectedVector.value.name}` as any)
      popoverVisible.value = false
      selectedVector.value = null
      await vectorStore.getVectorsByAgentId(agentStore.usingAgent.id)
    } else {
      ElMessage.error(res.message as any)
    }
  } catch (error) {
    ElMessage.error('添加失败，请重试' as any)
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
  justify-content: flex-end;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #eef2f6;
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.35);
    background: linear-gradient(135deg, #66b1ff 0%, #4ecdc4 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }

  &.is-active {
    transform: rotate(45deg);
    background: linear-gradient(135deg, #f56c6c 0%, #f093fb 100%);
    box-shadow: 0 2px 8px rgba(245, 108, 108, 0.25);

    &:hover {
      transform: rotate(45deg) translateY(-2px) scale(1.05);
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
    margin: 0;
    font-size: 20px;
  }
}

.select-popover {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;

  .popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #eef2f6;

    .popover-title {
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
    }

    :deep(.el-button) {
      color: #909399;
      padding: 0;

      &:hover {
        color: #409eff;
      }
    }
  }

  .popover-content {
    padding: 16px;

    .popover-select {
      width: 100%;

      :deep(.el-input__wrapper) {
        border-radius: 10px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        transition: all 0.3s;
        box-shadow: none;

        &:hover {
          background: #ffffff;
          border-color: #409eff;
        }

        &.is-focus {
          background: #ffffff;
          border-color: #409eff;
          box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
        }
      }
    }
  }

  .popover-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-top: 1px solid #eef2f6;

    :deep(.el-button) {
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-1px);
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
    padding: 0 6px;
    height: 20px;
    line-height: 18px;
    background: #ecf5ff;
    border: none;
    color: #409eff;
  }
}

:deep(.el-select-dropdown) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #eef2f6;
  overflow: hidden;
  margin-top: 8px;

  .el-select-dropdown__item {
    padding: 10px 16px;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
    }

    &.selected {
      background: #ecf5ff;
      color: #409eff;
      font-weight: 500;
    }
  }

  .el-select-dropdown__wrap {
    max-height: 320px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }
}

:deep(.el-overlay) {
  backdrop-filter: blur(2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.knowledge-top-bar {
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 768px) {
  .knowledge-top-bar {
    padding: 12px 16px;
  }

  .add-btn {
    width: 36px;
    height: 36px;

    :deep(.el-icon) {
      font-size: 18px;
    }
  }

  .select-option {
    .option-dim {
      display: none;
    }
  }
}
</style>