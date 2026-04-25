<template>
  <div class="layout-container">

    <!-- 左侧侧边栏（受控显示隐藏 + 可调节宽度） -->
    <div
        class="aside-content"
        :style="{ width: leftWidth + 'px' }"
    >
      <slot name="left" />
    </div>

    <!-- 拖动条 -->
    <div
        v-show="showLeftAside"
        class="resize-handle"
        @mousedown="startResizeL"
    />

    <!-- 主内容 -->
    <div class="main-content">
      <slot name="main" />
    </div>

    <!-- 拖动条 -->
    <div
        v-show="showRightAside"
        class="resize-handle"
        @mousedown="startResizeR"
    />

    <!-- 右侧侧边栏（受控显示隐藏 + 可调节宽度） -->
    <div
        class="aside-content"
        :style="{ width: rightWidth + 'px' }"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onUnmounted, type Ref, ref, watch} from 'vue'

const props = defineProps<{
  showRightAside: boolean
  showLeftAside: boolean
}>()

// 右侧面板初始宽度 & 最小宽度
const rightWidth = ref(0)
const leftWidth = ref(0)
const MIN_WIDTH = 300
const defaultRightWidth = 725
const defaultLeftWidth = 325

// 拖动调节宽度逻辑
let startX = 0
let startWidth = 0

const startResizeR = (e: MouseEvent) => {
  startX = e.clientX
  startWidth = rightWidth.value
  document.addEventListener('mousemove', onMouseMoveR)
  document.addEventListener('mouseup', stopResizeR)
}

const onMouseMoveR = (e: MouseEvent) => {
  const width = startWidth - (e.clientX - startX)
  // 限制最小宽度，防止太窄
  rightWidth.value = Math.max(MIN_WIDTH, width)
}

const stopResizeR = () => {
  document.removeEventListener('mousemove', onMouseMoveR)
  document.removeEventListener('mouseup', stopResizeR)
}

const startResizeL = (e: MouseEvent) => {
  startX = e.clientX
  startWidth = leftWidth.value
  document.addEventListener('mousemove', onMouseMoveL)
  document.addEventListener('mouseup', stopResizeL)
}

const onMouseMoveL = (e: MouseEvent) => {
  const width = startWidth + (e.clientX - startX)
  // 限制最小宽度，防止太窄
  leftWidth.value = Math.max(MIN_WIDTH, width)
}

const stopResizeL = () => {
  document.removeEventListener('mousemove', onMouseMoveL)
  document.removeEventListener('mouseup', stopResizeL)
}

let rightTimer: number | null = null
let leftTimer: number | null = null
const animateResize = (isShow: boolean, animationTimer: number | null,
                       width: Ref<number>, defaultWidth: number) => {
  // 清除旧动画帧
  if (animationTimer) {
    cancelAnimationFrame(animationTimer)
    animationTimer = null
  }

  const duration = 250 // 动画总时长（毫秒）
  const startTime = performance.now()
  const startWidth = isShow ? 0 : width.value
  const endWidth = isShow ? defaultWidth : 0

  // 缓动动画函数（ease-out 曲线：先快后慢，最自然）
  const animate = (timestamp: number) => {
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    // 缓动曲线公式（ease-out）
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    
    // 计算当前宽度
    width.value = startWidth + (endWidth - startWidth) * easedProgress

    // 继续动画或结束
    if (progress < 1) {
      animationTimer = requestAnimationFrame(animate)
    } else {
      width.value = endWidth
      animationTimer = null
    }
  }

  // 启动动画
  animationTimer = requestAnimationFrame(animate)
}
// 监听侧边栏显示隐藏，平滑展开/收起
watch(() => props.showRightAside, (newVal) => {
  if (rightTimer) cancelAnimationFrame(rightTimer)
  animateResize(newVal, rightTimer, rightWidth, defaultRightWidth)
})

watch(() => props.showLeftAside, (newVal) => {
  if (leftTimer) cancelAnimationFrame(leftTimer)
  animateResize(newVal, leftTimer, leftWidth, defaultLeftWidth)
})

onUnmounted(() => {
  if (rightTimer) cancelAnimationFrame(rightTimer)
  if (leftTimer) cancelAnimationFrame(leftTimer)
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