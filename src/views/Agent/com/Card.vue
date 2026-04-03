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
          <div class="card-name">{{ agent.name || '未命名向量库' }}</div>
          <div class="card-description">{{ agent.description || '暂无描述' }}</div>
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
import {ElMessage, ElMessageBox} from "element-plus";
import type {Agent} from "@/types/entity/Agent";
import {ROUTE_PATHS} from "@/constant/SystemRouterConfig";
import {useHomeStore, useAgentStore} from "@/stores";
import {useRouter} from "vue-router";


// 定义组件 props
interface Props {
  agent: Agent
}

const router = useRouter();

const props = defineProps<Props>()


interface Emits {
  (e: 'alert', agent: Agent): void
}

const emit = defineEmits<Emits>()

const homeStore = useHomeStore()
const agentStore = useAgentStore()


const deleteVector = async () => {
  try {
    await ElMessageBox.confirm(
        `确定要删除向量库 "${props.agent.name}" 吗？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const res = await agentStore.deleteAgent(props.agent.id)
    if (res.code === 1) {
      ElMessage.success('删除成功' as any)
    } else {
      ElMessage.error(res.message as any)
    }
  } catch {
    // 用户取消删除，不做任何操作
  }
}

const alertVector = () => {
  emit('alert', props.agent)
}

const click = () => {
  agentStore.usingAgent = props.agent
  router.push(ROUTE_PATHS.CHAT)
  homeStore.activeMenuItem = ROUTE_PATHS.CHAT
}

</script>

<style scoped>
.vector-card-wrapper {
  width: 260px;
  height: 260px;
}

.vector-card {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(100, 108, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.vector-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.2);
  border-color: rgba(100, 108, 255, 0.3);
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
  backdrop-filter: blur(0px);
}

/* 装饰性背景光晕 */
.card-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 20%, rgba(100, 108, 255, 0.08), transparent 70%);
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
  background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-9) 100%);
  border-radius: 20px;
  margin-bottom: 20px;
  color: var(--el-color-primary);
  transition: all 0.3s ease;
  position: relative;
}

.vector-card:hover .card-icon {
  transform: scale(1.05);
  border-radius: 24px;
  background: linear-gradient(135deg, var(--el-color-primary-light-7) 0%, var(--el-color-primary-light-8) 100%);
  box-shadow: 0 8px 20px -8px rgba(100, 108, 255, 0.4);
}

.card-info {
  text-align: center;
  width: 100%;
}

.card-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
  transition: color 0.2s ease;
}

.vector-card:hover .card-name {
  color: var(--el-color-primary);
}

.card-description {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  line-height: 1.5;
  transition: color 0.2s ease;
}

/* 底部装饰线 */
.card-footer-line {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--el-color-primary), transparent);
  border-radius: 2px;
  opacity: 0;
  transition: all 0.3s ease;
}

.vector-card:hover .card-footer-line {
  opacity: 0.6;
  width: 50px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .vector-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: rgba(100, 108, 255, 0.2);
  }

  .card-icon {
    background: linear-gradient(135deg, rgba(100, 108, 255, 0.2) 0%, rgba(100, 108, 255, 0.1) 100%);
  }

  .vector-card:hover .card-icon {
    background: linear-gradient(135deg, rgba(100, 108, 255, 0.3) 0%, rgba(100, 108, 255, 0.2) 100%);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .vector-card-wrapper {
    width: 200px;
    height: 200px;
  }

  .card-icon {
    width: 55px;
    height: 55px;
    margin-bottom: 14px;
  }

  .card-name {
    font-size: 14px;
  }

  .card-description {
    font-size: 11px;
  }
}

/* 按钮组容器 - 定位到右上角 */
.card-buttons {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

/* 按钮通用样式 */
.delete-btn,
.alert-btn {
  background: rgba(0, 0, 0, 0.06);
  border: none;
  width: 28px;
  height: 28px;
  padding: 0 !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #606266;
}

/* 删除按钮悬停效果 */
.delete-btn:hover {
  background: #f56c6c;
  color: white;
}

/* 警告/更多按钮悬停效果 */
.alert-btn:hover {
  background: #409eff;
  color: white;
}

/* 可选：默认隐藏，悬停显示 */
.card-buttons {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vector-card:hover .card-buttons {
  opacity: 1;
}
</style>