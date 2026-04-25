<!-- VectorCard.vue -->
<template>
  <div class="vector-card">
    <div class="card-header" @click="toggleDocs">
      <div class="header-left">
        <el-icon :class="{ 'is-open': isDocsVisible }" class="expand-icon">
          <ArrowRight />
        </el-icon>
        <span class="vector-name">{{ vector.name }}</span>
        <el-tag size="small" type="info" class="dim-tag">维度: {{ vector.dim }}</el-tag>
      </div>
      <div class="header-right">
        <span class="docs-count">
          <el-icon><Document /></el-icon>
          {{ knowledges.length }}
        </span>
        <el-button
            class="delete-btn"
            :icon="Delete"
            size="small"
            type="danger"
            plain
            circle
            @click.stop="handleRemove"
        />
      </div>
    </div>

    <el-collapse-transition>
      <div v-show="isDocsVisible" class="docs-wrapper">
        <div class="divider"></div>

        <div v-if="knowledges.length === 0" class="empty-docs">
          <el-empty description="暂无关联文档" :image-size="60">
            <template #image>
              <el-icon :size="60" color="#cbd5e1"><Document /></el-icon>
            </template>
          </el-empty>
        </div>

        <div v-else class="docs-container">
          <div
              v-for="(doc, index) in knowledges"
              :key="doc.id"
              class="doc-item"
              :style="{ animationDelay: `${index * 0.03}s` }"
          >
            <div class="doc-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="doc-info">
              <div class="doc-name">{{ doc.name }}</div>
              <div class="doc-meta">
                <span class="chunk-info">📄 {{ doc.chunk }} 个分块</span>
                <span class="time-info">🕒 {{ formatDate(doc.createTime) }}</span>
              </div>
            </div>
            <div class="link-wrapper" v-if="doc.path">
              <el-button
                  type="primary"
                  :icon="Link"
                  circle
                  class="link-btn"
                  @click.stop="showFile(doc)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import type { Vector } from "@/types/entity/Vector";
import { onMounted, ref } from "vue";
import { useKnowledgeStore, useAgentStore } from "@/stores";
import type { Knowledge } from "@/types/entity/Knowledge";
import {ArrowRight, Delete, Document, Link} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";

const props = defineProps<{
  vector: Vector;
}>();

interface Emits {
  (e: 'remove', vector: Vector): void,
  (e: 'showFile', doc: Knowledge): void
}

const emit = defineEmits<Emits>();

const agentStore = useAgentStore();
const knowledgeStore = useKnowledgeStore();

const knowledges = ref<Knowledge[]>([]);
const isDocsVisible = ref(true);

onMounted(async () => {
  const res = await knowledgeStore.getKnowledgeByVectorId(props.vector.id);
  knowledges.value = res.data;
});

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const toggleDocs = () => {
  isDocsVisible.value = !isDocsVisible.value;
};

const handleRemove = async () => {
  try {
    if (agentStore.usingAgent.id == null) return;
    await ElMessageBox.confirm(
        `确定要移除知识库 "${props.vector.name}" 吗？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'custom-message-box'
        }
    )
    emit('remove', props.vector)
  } catch {
    // 用户取消删除，不做任何操作
  }
};

const showFile = (doc: Knowledge) => {
  emit('showFile', doc)
}
</script>

<style scoped lang="scss">
.vector-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.2);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);

    .expand-icon {
      color: #667eea;
    }
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;

    .expand-icon {
      font-size: 14px;
      transition: all 0.3s ease;
      color: #c0c4cc;

      &.is-open {
        transform: rotate(90deg);
        color: #667eea;
      }
    }

    .vector-name {
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
      transition: color 0.2s;
    }

    .dim-tag {
      background: linear-gradient(135deg, #ecf5ff 0%, #e8f0fe 100%);
      border: none;
      color: #409eff;
      font-size: 11px;
      padding: 0 10px;
      height: 22px;
      line-height: 20px;
      border-radius: 12px;
      font-weight: 500;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .docs-count {
      font-size: 12px;
      color: #909399;
      background: #f0f2f5;
      padding: 4px 10px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;

      .el-icon {
        font-size: 12px;
      }
    }

    .delete-btn {
      padding: 6px;
      font-size: 14px;
      opacity: 0.5;
      transition: all 0.2s ease;
      background: transparent;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
        background: rgba(245, 108, 108, 0.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.docs-wrapper {
  background: #ffffff;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, #e4e7ed 0%, #e4e7ed 85%, transparent 100%);
  margin: 0 18px;
}

.docs-container {
  max-height: 320px;
  overflow-y: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 4px;

    &:hover {
      background: #c0c4cc;
    }
  }
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  transition: all 0.2s ease;
  cursor: default;
  animation: slideIn 0.3s ease-out backwards;

  &:hover {
    background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
    padding-left: 22px;
  }

  .doc-icon {
    margin-right: 12px;
    color: #c0c4cc;
    font-size: 18px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .doc-info {
    flex: 1;
    min-width: 0;

    .doc-name {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 4px;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.2s;
    }

    .doc-meta {
      display: flex;
      gap: 16px;
      font-size: 11px;
      color: #909399;

      .chunk-info, .time-info {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  &:hover .doc-icon {
    color: #667eea;
  }

  &:hover .doc-info .doc-name {
    color: #667eea;
  }
}

.empty-docs {
  padding: 24px 18px;
}

.link-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateX(2px) scale(1.05);
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateX(1px) scale(0.98);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .vector-card {
    border-radius: 14px;
  }

  .card-header {
    padding: 12px 14px;

    .header-left {
      gap: 8px;

      .vector-name {
        font-size: 14px;
      }

      .dim-tag {
        font-size: 10px;
        padding: 0 6px;
        height: 20px;
        line-height: 18px;
      }
    }

    .header-right {
      gap: 8px;

      .docs-count {
        font-size: 11px;
        padding: 2px 8px;

        .el-icon {
          font-size: 11px;
        }
      }

      .delete-btn {
        padding: 4px;
        font-size: 12px;
      }
    }
  }

  .doc-item {
    padding: 8px 14px;

    .doc-info {
      .doc-name {
        font-size: 13px;
      }

      .doc-meta {
        gap: 12px;
        font-size: 10px;
      }
    }
  }

  .docs-container {
    max-height: 280px;
  }
}

// 添加 link-wrapper 包裹层样式
.link-wrapper {
  flex-shrink: 0;
  opacity: 0;                    // 默认隐藏
  transition: opacity 0.3s ease;
  margin-left: 8px;
}

.doc-item:hover .link-wrapper {
  opacity: 1;                    // 悬停时显示
}

.link-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  width: 32px;
  height: 32px;
  padding: 0 !important;

  &:hover {
    transform: translateX(2px) scale(1.05);
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateX(1px) scale(0.98);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .link-btn {
    width: 28px;
    height: 28px;

    .el-icon {
      font-size: 14px !important;
    }
  }
}

@media (max-width: 480px) {
  .link-btn {
    width: 26px;
    height: 26px;

    .el-icon {
      font-size: 12px !important;
    }
  }
}
</style>