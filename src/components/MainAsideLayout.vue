<template>
  <div class="layout-container">
    <!-- 左侧主内容 -->
    <div class="main-content">
      <slot name="main" />
    </div>

    <!-- 拖动条 -->
    <div
        class="resize-handle"
        @mousedown="startResize"
    />

    <!-- 右侧侧边栏（受控显示隐藏 + 可调节宽度） -->
    <div
        class="aside-content"
        :style="{ width: asideWidth + 'px' }"
    >
      <slot name="aside" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onUnmounted, ref, watch} from 'vue'

const props = defineProps<{
  showAside: boolean
}>()

// 右侧面板初始宽度 & 最小宽度
const asideWidth = ref(0)
const MIN_WIDTH = 260
const defaultWidth = 725

// 拖动调节宽度逻辑
let startX = 0
let startWidth = 0

const startResize = (e: MouseEvent) => {
  startX = e.clientX
  startWidth = asideWidth.value
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)
}

const onMouseMove = (e: MouseEvent) => {
  const width = startWidth - (e.clientX - startX)
  // 限制最小宽度，防止太窄
  asideWidth.value = Math.max(MIN_WIDTH, width)
}

const stopResize = () => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

let animationTimer: number | null = null
// 监听侧边栏显示隐藏，平滑展开/收起
watch(() => props.showAside, (newVal) => {
  // 清除旧定时器
  if (animationTimer) {
    clearInterval(animationTimer)
    animationTimer = null
  }

  const duration = 250 // 动画总时长（毫秒）
  const steps = 30     // 总帧数（越高越流畅）
  const stepTime = duration / steps // 每帧间隔
  let currentStep = 0

  // 开始值 & 目标值
  const startWidth = newVal ? 0 : asideWidth.value
  const endWidth = newVal ? defaultWidth : 0

  // 缓动动画函数（ease-out 曲线：先快后慢，最自然）
  const animate = () => {
    currentStep++
    // 缓动曲线公式（先快后慢）
    const progress = 1 - Math.pow(1 - currentStep / steps, 3)
    // 计算当前宽度
    asideWidth.value = startWidth + (endWidth - startWidth) * progress

    // 结束动画
    if (currentStep >= steps) {
      asideWidth.value = endWidth
      clearInterval(animationTimer!)
      animationTimer = null
    }
  }

  // 启动定时器
  animationTimer = window.setInterval(animate, stepTime)
})

onUnmounted(() => {
  if (animationTimer) clearInterval(animationTimer)
})
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 0;
}

/* 左侧自适应 */
.main-content {
  flex: 1;
  min-width: 0;
}

/* 拖动条 */
.resize-handle {
  width: 4px;
  cursor: col-resize;
  background-color: #e5e7eb;
  transition: background 0.2s;
}
.resize-handle:hover {
  background-color: #409eff;
}

/* 右侧面板 */
.aside-content {
  position: relative;
  background: #fff;
  border-left: 1px solid #e5e7eb;
  overflow: auto;
}
</style>