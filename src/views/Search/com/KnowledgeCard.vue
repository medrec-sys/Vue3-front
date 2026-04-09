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
// KnowledgeCard.vue
<style scoped>
.knowledge-card-wrapper {
  width: 100%;
  cursor: pointer;
}

.knowledge-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #ffffff;
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(102, 126, 234, 0.08);
  gap: 12px;
  position: relative;
  overflow: hidden;
}

/* 背景光晕效果 */
.knowledge-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.knowledge-card:hover::before {
  left: 100%;
}

.knowledge-card:hover {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(6px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.12);
}

/* 图标区域 */
.card-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 12px;
  color: #667eea;
  transition: all 0.3s ease;
}

.knowledge-card:hover .card-icon {
  transform: scale(1.08);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%);
  color: #764ba2;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* 信息区域 */
.card-info {
  flex: 1;
  min-width: 0;
}

.knowledge-name {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.knowledge-card:hover .knowledge-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.knowledge-meta {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.3;
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  color: #909399;
  transition: all 0.25s ease;
  width: 30px;
  height: 30px;
  padding: 0 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(245, 87, 108, 0.3);
}

.delete-btn:active {
  transform: scale(0.95);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .knowledge-card {
    background: linear-gradient(135deg, #1e293b 0%, #172033 100%);
    border-color: rgba(102, 126, 234, 0.15);
  }

  .knowledge-card:hover {
    background: linear-gradient(135deg, #2d3a4e 0%, #1e2a3a 100%);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .knowledge-name {
    color: #e5e7eb;
  }

  .card-icon {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
  }

  .knowledge-meta {
    color: #9ca3af;
  }

  .delete-btn {
    background: rgba(30, 30, 40, 0.9);
    color: #9ca3af;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .knowledge-card {
    padding: 8px 12px;
    border-radius: 12px;
  }

  .card-icon {
    width: 34px;
    height: 34px;
  }

  .card-icon .el-icon {
    font-size: 18px !important;
  }

  .knowledge-name {
    font-size: 14px;
    margin-bottom: 2px;
  }

  .knowledge-meta {
    font-size: 10px;
  }

  .delete-btn {
    width: 28px;
    height: 28px;
  }
}

/* 超紧凑模式 */
@media (max-width: 480px) {
  .knowledge-card {
    padding: 6px 10px;
    border-radius: 10px;
  }

  .card-icon {
    width: 30px;
    height: 30px;
  }

  .card-icon .el-icon {
    font-size: 16px !important;
  }

  .knowledge-name {
    font-size: 13px;
  }

  .knowledge-meta {
    font-size: 9px;
  }

  .delete-btn {
    width: 26px;
    height: 26px;
  }

  .knowledge-card:hover {
    transform: translateX(3px);
  }
}
</style>