<template>
  <div class="vector-card">
    <!-- 卡片头部：向量库信息 -->
    <div class="card-header" @click="toggleDocs">
      <div class="header-left">
        <el-icon :class="{ 'is-open': isDocsVisible }">
          <ArrowRight />
        </el-icon>
        <span class="vector-name">{{ vector.name }}</span>
        <el-tag size="small" type="info" class="dim-tag">维度: {{ vector.dim }}</el-tag>
      </div>
      <div class="header-right">
        <span class="docs-count">{{ knowledges.length }} 个文档</span>
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

    <!-- 可收缩的文档列表 -->
    <el-collapse-transition>
      <div v-show="isDocsVisible" class="docs-wrapper">
        <!-- 分割线 -->
        <div class="divider"></div>

        <!-- 空状态 -->
        <div v-if="knowledges.length === 0" class="empty-docs">
          <el-empty description="暂无关联文档" :image-size="60" />
        </div>

        <!-- 文档列表（类书籍目录） -->
        <div v-else class="docs-container">
          <div
              v-for="(doc, _index) in knowledges"
              :key="doc.id"
              class="doc-item"
          >
            <div class="doc-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="doc-info">
              <div class="doc-name">{{ doc.name }}</div>
              <div class="doc-meta">
                <span class="chunk-info">分块数: {{ doc.chunk }}</span>
                <span class="time-info">{{ formatDate(doc.createTime) }}</span>
              </div>
            </div>
            <div class="link-right" v-if="doc.path">
              <el-button
                  type="primary"
                  :icon="Link"
                  circle
                  class="link-btn"
                  @click="showFile(doc)"
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
  (e: 'remove', vector:  Vector): void,
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
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  margin-bottom: 12px;
  overflow: hidden;

  &:hover {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: #fafbfc;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    .el-icon {
      font-size: 14px;
      transition: transform 0.2s ease;
      color: #909399;

      &.is-open {
        transform: rotate(90deg);
      }
    }

    .vector-name {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }

    .dim-tag {
      background: #ecf5ff;
      border-color: #d9ecff;
      color: #409eff;
      font-size: 11px;
      padding: 0 6px;
      height: 20px;
      line-height: 18px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .docs-count {
      font-size: 12px;
      color: #909399;
      background: #f0f2f5;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .delete-btn {
      padding: 4px;
      font-size: 14px;
      opacity: 0.6;
      transition: all 0.2s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.05);
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
  margin: 0 16px;
}

.docs-container {
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 2px;

    &:hover {
      background: #c0c4cc;
    }
  }
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  transition: all 0.15s ease;
  cursor: default;

  &:hover {
    background: #fafbfc;
  }

  .doc-icon {
    margin-right: 10px;
    color: #c0c4cc;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .doc-info {
    flex: 1;
    min-width: 0;

    .doc-name {
      font-size: 13px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 2px;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .doc-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: #909399;

      .chunk-info {
        &::before {
          content: "📄";
          margin-right: 3px;
          font-size: 10px;
        }
      }

      .time-info {
        &::before {
          content: "🕒";
          margin-right: 3px;
          font-size: 10px;
        }
      }
    }
  }
}

.empty-docs {
  padding: 20px 16px;
}

// 加载状态样式（如果需要）
.loading-state {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 响应式设计
@media (max-width: 768px) {
  .card-header {
    padding: 10px 12px;

    .header-left {
      gap: 6px;

      .vector-name {
        font-size: 13px;
      }

      .dim-tag {
        font-size: 10px;
        padding: 0 4px;
        height: 18px;
        line-height: 16px;
      }
    }

    .header-right {
      gap: 6px;

      .docs-count {
        font-size: 11px;
        padding: 2px 6px;
      }

      .delete-btn {
        padding: 3px;
        font-size: 12px;
      }
    }
  }

  .doc-item {
    padding: 6px 12px;

    .doc-info {
      .doc-name {
        font-size: 12px;
      }

      .doc-meta {
        gap: 8px;
        font-size: 10px;
      }
    }
  }

  .docs-container {
    max-height: 240px;
  }
}

// 暗色模式支持（如果需要）
@media (prefers-color-scheme: dark) {
  .vector-card {
    background: #1e1e1e;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.3);
    }
  }

  .card-header {
    background: #1e1e1e;

    &:hover {
      background: #2d2d2d;
    }

    .header-left {
      .vector-name {
        color: #e5e5e5;
      }

      .el-icon {
        color: #6b6b6b;
      }
    }

    .header-right {
      .docs-count {
        color: #6b6b6b;
        background: #2d2d2d;
      }
    }
  }

  .docs-wrapper {
    background: #1e1e1e;
  }

  .divider {
    background: linear-gradient(90deg, #3a3a3a 0%, #3a3a3a 85%, transparent 100%);
  }

  .doc-item {
    &:hover {
      background: #2d2d2d;
    }

    .doc-icon {
      color: #6b6b6b;
    }

    .doc-info {
      .doc-name {
        color: #e5e5e5;
      }

      .doc-meta {
        color: #6b6b6b;
      }
    }
  }

  .docs-container {
    &::-webkit-scrollbar-track {
      background: #2d2d2d;
    }

    &::-webkit-scrollbar-thumb {
      background: #4a4a4a;

      &:hover {
        background: #5a5a5a;
      }
    }
  }
}

/* 右侧链接按钮 */
.link-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.link-btn:hover {
  transform: translateX(2px) rotate(5deg);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.link-btn:active {
  transform: translateX(1px) rotate(3deg);
}
</style>