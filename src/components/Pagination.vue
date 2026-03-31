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
  color: #909399;
  font-weight: 500;
}
</style>