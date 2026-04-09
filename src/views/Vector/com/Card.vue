<template>
  <div
      @click="click"
      class="vector-card-wrapper">
    <el-card class="vector-card" shadow="hover" body-style="{ padding: '0px' }">
      <!-- 按钮区 -->
      <div class="card-buttons">
        <el-button class="alert-btn" type="primary" round :icon="MoreFilled" @click.stop="alertVector"></el-button>
        <el-button class="delete-btn" type="primary" round :icon="Close" @click.stop="deleteVector"></el-button>
      </div>

      <div class="card-content">



        <!-- 装饰性背景光晕 -->
        <div class="card-glow"></div>

        <!-- 卡片图标区域 -->
        <div class="card-icon">
          <el-icon :size="32">
            <Collection/>
          </el-icon>
        </div>

        <!-- 卡片信息区域 -->
        <div class="card-info">
          <div class="card-name">{{ vector.name || '未命名向量库' }}</div>
          <div class="card-description">{{ vector.description || '暂无描述' }}</div>
        </div>

        <!-- 底部装饰线 -->
        <div class="card-footer-line"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {Close, MoreFilled} from '@element-plus/icons-vue'
import {Collection} from '@element-plus/icons-vue'
import type {Vector} from "@/types/entity/Vector";
import {useVectorStore} from "@/stores";
import {ElMessage, ElMessageBox} from "element-plus";
import {ROUTE_PATHS} from '@/constant/SystemRouterConfig'
import {useHomeStore} from '@/stores';

import {useRouter} from "vue-router";

const router = useRouter();
const homeStore = useHomeStore();


// 定义组件 props
interface Props {
  vector: Vector
}

const props = defineProps<Props>()


interface Emits {
  (e: 'alert', vector: Vector): void
}

const emit = defineEmits<Emits>()

const vectorStore = useVectorStore()


const deleteVector = async () => {
  try {
    await ElMessageBox.confirm(
        `确定要删除向量库 "${props.vector.name}" 吗？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const res = await vectorStore.deleteVector(props.vector.id)
    if (res.code === 1) {
      ElMessage.success('删除成功' as any)
    } else {
      ElMessage.error(res.message as any)
    }
  } catch {
    // 用户取消删除，不做任何操作
  }
}

const click = () => {
  vectorStore.searchingVector = props.vector
  router.push(ROUTE_PATHS.SEARCH)
  homeStore.activeMenuItem = ROUTE_PATHS.SEARCH
}

const alertVector = () => {
  emit('alert', props.vector)
}

</script>
// Card.vue
<style scoped>
.vector-card-wrapper {
  width: 100%;
  max-width: 280px;
  height: 280px;
}

.vector-card {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.vector-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 35px -12px rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  z-index: 2;
}

/* 装饰性背景光晕 */
.card-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
  border-radius: 50%;
}

.vector-card:hover .card-glow {
  opacity: 1;
}

.card-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 22px;
  margin-bottom: 20px;
  color: #667eea;
  transition: all 0.3s ease;
  position: relative;
}

.vector-card:hover .card-icon {
  transform: scale(1.05);
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%);
  box-shadow: 0 8px 20px -8px rgba(102, 126, 234, 0.4);
  color: #764ba2;
}

.card-info {
  text-align: center;
  width: 100%;
}

.card-name {
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
  transition: all 0.2s ease;
}

.vector-card:hover .card-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-description {
  font-size: 13px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.vector-card:hover .card-description {
  color: #606266;
}

/* 底部装饰线 */
.card-footer-line {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  border-radius: 2px;
  opacity: 0;
  transition: all 0.3s ease;
}

.vector-card:hover .card-footer-line {
  opacity: 0.6;
  width: 60px;
}

/* 按钮组容器 - 定位到右上角 */
.card-buttons {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vector-card:hover .card-buttons {
  opacity: 1;
}

/* 按钮通用样式 */
.delete-btn,
.alert-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  width: 30px;
  height: 30px;
  padding: 0 !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #606266;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 删除按钮悬停效果 */
.delete-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(245, 87, 108, 0.3);
}

/* 警告/更多按钮悬停效果 */
.alert-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.delete-btn:active,
.alert-btn:active {
  transform: scale(0.95);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .vector-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: rgba(102, 126, 234, 0.2);
  }

  .card-icon {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
  }

  .vector-card:hover .card-icon {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%);
  }

  .card-name {
    color: #e5e5e5;
  }

  .card-description {
    color: #8a8a8a;
  }

  .delete-btn,
  .alert-btn {
    background: rgba(30, 30, 30, 0.9);
    color: #c0c4cc;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .vector-card-wrapper {
    max-width: 220px;
    height: 220px;
  }

  .card-icon {
    width: 55px;
    height: 55px;
    margin-bottom: 14px;
  }

  .card-icon .el-icon {
    font-size: 26px !important;
  }

  .card-name {
    font-size: 14px;
  }

  .card-description {
    font-size: 11px;
    -webkit-line-clamp: 2;
  }

  .card-buttons {
    top: 8px;
    right: 8px;
    gap: 6px;
  }

  .delete-btn,
  .alert-btn {
    width: 26px;
    height: 26px;
  }

  .card-footer-line {
    bottom: 14px;
  }
}

@media (max-width: 480px) {
  .vector-card-wrapper {
    max-width: 180px;
    height: 180px;
  }

  .card-content {
    padding: 16px;
  }

  .card-icon {
    width: 45px;
    height: 45px;
    margin-bottom: 10px;
  }

  .card-icon .el-icon {
    font-size: 22px !important;
  }

  .card-name {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .card-description {
    font-size: 10px;
    -webkit-line-clamp: 1;
  }
}
</style>