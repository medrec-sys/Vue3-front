<template>
  <div class="knowledge-card-wrapper">
    <div class="knowledge-card">
      <!-- 图标区域 -->
      <div class="card-icon">
        <el-icon :size="24">
          <Files />
        </el-icon>
      </div>

      <!-- 文件名区域 -->
      <div class="card-info">
        <div class="knowledge-name">{{ knowledge.name || '未命名知识库' }}</div>
        <div class="knowledge-meta">
          <span>{{ knowledge.chunk || 0 }} 个分块</span>
          <span class="divider">•</span>
          <span>{{ formatDate(knowledge.createTime) }}</span>
        </div>
      </div>

      <!-- 删除按钮 -->
      <div class="card-buttons">
        <el-button
            class="delete-btn"
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click.stop="handleDelete"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Files } from '@element-plus/icons-vue'
import type { Knowledge } from "@/types/entity/Knowledge"
import {ElMessage, ElMessageBox } from "element-plus"
import {useKnowledgeStore} from "@/stores";

const knowledgeStore = useKnowledgeStore()

// 定义组件 props
interface Props {
  knowledge: Knowledge
}

const props = defineProps<Props>()

// 格式化日期
const formatDate = (date: Date | string | undefined) => {
  if (!date) return '未知时间'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 删除知识库
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
        `确定要删除知识库 "${props.knowledge.name}" 吗？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const res = await knowledgeStore.deleteKnowledge(props.knowledge.id)
    if (res.code === 1) {
      ElMessage.success('删除成功' as any)
    } else {
      ElMessage.error(res.message as any)
    }
  } catch {
    // 用户取消删除，不做任何操作
  }
}
</script>

<style scoped>
.knowledge-card-wrapper {
  width: 100%;
  cursor: pointer;
}

.knowledge-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px; /* 减少上下内边距：从12px 16px 改为 8px 12px */
  background: #ffffff;
  border-radius: 10px; /* 稍微减小圆角 */
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
  gap: 10px; /* 减小间距：从12px 改为 10px */
}

.knowledge-card:hover {
  background: #f5f7fa;
  border-color: #409eff;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

/* 图标区域 - 缩小尺寸 */
.card-icon {
  flex-shrink: 0;
  width: 36px; /* 从44px减小到36px */
  height: 36px; /* 从44px减小到36px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ecf5ff 0%, #e6f0ff 100%);
  border-radius: 10px; /* 从12px减小到10px */
  color: #409eff;
  transition: all 0.3s ease;
}

.knowledge-card:hover .card-icon {
  transform: scale(1.05);
  background: linear-gradient(135deg, #e0edff 0%, #d9e8ff 100%);
}

/* 信息区域 */
.card-info {
  flex: 1;
  min-width: 0;
}

.knowledge-name {
  font-size: 14px; /* 从15px减小到14px */
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px; /* 从4px减小到2px */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
  line-height: 1.4; /* 添加行高控制 */
}

.knowledge-card:hover .knowledge-name {
  color: #409eff;
}

.knowledge-meta {
  font-size: 11px; /* 从12px减小到11px */
  color: #909399;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.3; /* 添加行高控制 */
}

.divider {
  color: #dcdfe6;
}

/* 按钮区域 */
.card-buttons {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.knowledge-card:hover .card-buttons {
  opacity: 1;
}

.delete-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #909399;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
  padding: 0 !important;
}

.delete-btn:hover {
  background: #f56c6c;
  color: white;
  transform: scale(1.05);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .knowledge-card {
    background: #1e293b;
    border-color: #334155;
  }

  .knowledge-card:hover {
    background: #2d3a4e;
    border-color: #409eff;
  }

  .knowledge-name {
    color: #e5e7eb;
  }

  .card-icon {
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.1) 100%);
  }

  .knowledge-meta {
    color: #9ca3af;
  }
}

/* 移动端适配 - 进一步缩小 */
@media (max-width: 768px) {
  .knowledge-card {
    padding: 6px 10px; /* 更小的内边距 */
  }

  .card-icon {
    width: 32px;
    height: 32px;
  }

  .card-icon .el-icon {
    font-size: 20px !important; /* 图标大小从24px减小到20px */
  }

  .knowledge-name {
    font-size: 13px;
    margin-bottom: 2px;
  }

  .knowledge-meta {
    font-size: 10px;
  }

  .delete-btn {
    width: 26px;
    height: 26px;
  }
}

/* 超紧凑模式（可选） */
@media (max-width: 480px) {
  .knowledge-card {
    padding: 5px 8px;
  }

  .card-icon {
    width: 28px;
    height: 28px;
  }

  .knowledge-name {
    font-size: 12px;
  }

  .knowledge-meta {
    font-size: 9px;
  }
}
</style>