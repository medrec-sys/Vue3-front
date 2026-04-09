<template>
  <div class="pagination-wrapper">
    <!-- 左侧：总数信息 -->
    <div class="pagination-total">
      Total {{ total }}
    </div>

    <!-- 中间：分页器 -->
    <el-pagination
        :current-page="current"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next, jumper"
        :background="false"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
}

const props = defineProps<Props>()

interface Emits {
  (e: 'change', page: number, pageSize: number): void
}

const emit = defineEmits<Emits>()

// 页码变化
const handleCurrentChange = (page: number) => {
  emit('change', page, props.pageSize)
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  emit('change', 1, size) // 重置到第一页
}
</script>
// Pagination.vue
<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 0;
  background-color: transparent;
}

/* 总数样式 */
.pagination-total {
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0 8px;
}

/* 分页器样式优化 */
.pagination-wrapper :deep(.el-pagination) {
  --el-pagination-button-bg-color: transparent;
  --el-pagination-hover-color: #667eea;
  --el-pagination-button-disabled-bg-color: transparent;
}

.pagination-wrapper :deep(.el-pagination .el-pager li) {
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.25s ease;
  margin: 0 2px;
}

.pagination-wrapper :deep(.el-pagination .el-pager li:hover) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.pagination-wrapper :deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.pagination-wrapper :deep(.el-pagination button) {
  border-radius: 10px;
  transition: all 0.25s ease;
}

.pagination-wrapper :deep(.el-pagination button:hover:not(:disabled)) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.pagination-wrapper :deep(.el-pagination .btn-prev),
.pagination-wrapper :deep(.el-pagination .btn-next) {
  border-radius: 10px;
}

.pagination-wrapper :deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
  transition: all 0.25s ease;
}

.pagination-wrapper :deep(.el-select .el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.2);
}

.pagination-wrapper :deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
}

.pagination-wrapper :deep(.el-pagination .el-input__inner) {
  border-radius: 10px;
}

.pagination-wrapper :deep(.el-pagination__jump) {
  margin-left: 12px;
}

.pagination-wrapper :deep(.el-pagination__jump .el-input__wrapper) {
  border-radius: 10px;
  transition: all 0.25s ease;
}

.pagination-wrapper :deep(.el-pagination__jump .el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.2);
}

.pagination-wrapper :deep(.el-pagination__jump .el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
}

/* 下拉选项样式 */
:deep(.el-select-dropdown__item) {
  transition: all 0.2s ease;
}

:deep(.el-select-dropdown__item.selected) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%);
  color: #667eea;
  font-weight: 500;
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(102, 126, 234, 0.06);
}

@media (max-width: 768px) {
  .pagination-wrapper {
    gap: 12px;
    padding: 16px 0;
  }

  .pagination-total {
    font-size: 12px;
  }

  .pagination-wrapper :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-wrapper :deep(.el-pagination .el-pager li) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .pagination-wrapper :deep(.el-pagination button) {
    min-width: 28px;
    height: 28px;
  }
}
</style>