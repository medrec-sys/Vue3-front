<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 物体配置
interface DraggableItem {
  id: number
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  dragOffset: { x: number; y: number }
  rotation: number
  scale: number
  size: { width: number; height: number }
  color: string
  isDragging: boolean
  collisionCount: number
  isEntering: boolean
  enterDelay: number // 新增入场延迟时间
}

// 配置参数
const config = {
  itemCount: 5,
  minSize: 60,
  maxSize: 120,
  friction: 0.96,
  bounce: 0.85,
  followStiffness: 0.3,
  maxSpeed: 40,
  collisionBounce: 0.9,
  collisionPushFactor: 1.2,
  minVelocity: 0.5,
  enterAnimationDuration: 1200, // 入场动画时长
  enterStaggerDelay: 200 // 每个元素入场延迟间隔
}

const containerSize = ref({ width: 0, height: 0 })
const items = ref<DraggableItem[]>([])
let animationFrameId: number
let lastTimestamp = 0

// 初始化物体
const initItems = () => {
  const newItems: DraggableItem[] = []

  for (let i = 0; i < config.itemCount; i++) {
    const size = Math.random() * (config.maxSize - config.minSize) + config.minSize
    const hue = Math.floor(Math.random() * 360)

    newItems.push({
      id: i,
      position: {
        x: Math.random() * (containerSize.value.width - size),
        y: Math.random() * (containerSize.value.height - size)
      },
      velocity: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
      rotation: 0,
      scale: 0,
      size: { width: size, height: size },
      color: `hsl(${hue}, 70%, 60%)`,
      isDragging: false,
      collisionCount: 0,
      isEntering: true,
      enterDelay: i * config.enterStaggerDelay // 设置递增的延迟时间
    })
  }

  items.value = newItems

  // 设置入场动画完成后状态
  setTimeout(() => {
    items.value.forEach(item => {
      setTimeout(() => {
        item.isEntering = false
        item.scale = 1
      }, item.enterDelay + config.enterAnimationDuration)
    })
  }, 0)
}

// 获取容器尺寸
const updateContainerSize = () => {
  containerSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  initItems()
}

// 限制速度
const limitVelocity = (vel: { x: number; y: number }) => {
  const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
  if (speed > config.maxSpeed) {
    const ratio = config.maxSpeed / speed
    vel.x *= ratio
    vel.y *= ratio
  }
  return vel
}

// 检测物体与边界碰撞
const checkBounds = (item: DraggableItem) => {
  if (item.position.x < 0) {
    item.position.x = 0
    item.velocity.x *= -config.bounce
  }
  if (item.position.x > containerSize.value.width - item.size.width) {
    item.position.x = containerSize.value.width - item.size.width
    item.velocity.x *= -config.bounce
  }
  if (item.position.y < 0) {
    item.position.y = 0
    item.velocity.y *= -config.bounce
  }
  if (item.position.y > containerSize.value.height - item.size.height) {
    item.position.y = containerSize.value.height - item.size.height
    item.velocity.y *= -config.bounce
  }
}

// 检测物体间碰撞 (优化版)
const checkCollisions = () => {
  for (let i = 0; i < items.value.length; i++) {
    for (let j = i + 1; j < items.value.length; j++) {
      const item1 = items.value[i]
      const item2 = items.value[j]

      // 圆形碰撞检测
      const center1 = {
        x: item1.position.x + item1.size.width / 2,
        y: item1.position.y + item1.size.height / 2
      }
      const center2 = {
        x: item2.position.x + item2.size.width / 2,
        y: item2.position.y + item2.size.height / 2
      }

      const dx = center1.x - center2.x
      const dy = center1.y - center2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDistance = (item1.size.width + item2.size.width) / 2

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx)
        const overlap = (minDistance - distance) * config.collisionPushFactor

        item1.collisionCount++
        item2.collisionCount++

        const relativeVelocity = {
          x: item1.velocity.x - item2.velocity.x,
          y: item1.velocity.y - item2.velocity.y
        }

        const impulse = (1 + config.collisionBounce) *
            (relativeVelocity.x * Math.cos(angle) + relativeVelocity.y * Math.sin(angle)) /
            (1/item1.size.width + 1/item2.size.width)

        if (!item1.isDragging) {
          item1.position.x += Math.cos(angle) * overlap * 0.5
          item1.position.y += Math.sin(angle) * overlap * 0.5

          item1.velocity.x -= impulse * Math.cos(angle) / item1.size.width
          item1.velocity.y -= impulse * Math.sin(angle) / item1.size.width
        }

        if (!item2.isDragging) {
          item2.position.x -= Math.cos(angle) * overlap * 0.5
          item2.position.y -= Math.sin(angle) * overlap * 0.5

          item2.velocity.x += impulse * Math.cos(angle) / item2.size.width
          item2.velocity.y += impulse * Math.sin(angle) / item2.size.width
        }

        if (Math.abs(item1.velocity.x) < config.minVelocity) item1.velocity.x = config.minVelocity * (item1.velocity.x < 0 ? -1 : 1)
        if (Math.abs(item1.velocity.y) < config.minVelocity) item1.velocity.y = config.minVelocity * (item1.velocity.y < 0 ? -1 : 1)
        if (Math.abs(item2.velocity.x) < config.minVelocity) item2.velocity.x = config.minVelocity * (item2.velocity.x < 0 ? -1 : 1)
        if (Math.abs(item2.velocity.y) < config.minVelocity) item2.velocity.y = config.minVelocity * (item2.velocity.y < 0 ? -1 : 1)
      }
    }
  }

  items.value.forEach(item => {
    if (item.collisionCount > 0) {
      item.collisionCount -= 0.1
    } else {
      item.collisionCount = 0
    }
  })
}

// 动画循环
const myAnimate = (timestamp: number) => {
  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  if (deltaTime > 0) {
    items.value.forEach(item => {
      if (!item.isDragging && !item.isEntering) {
        item.position.x += item.velocity.x * (deltaTime / 16)
        item.position.y += item.velocity.y * (deltaTime / 16)

        item.velocity.x *= Math.pow(config.friction, deltaTime / 16)
        item.velocity.y *= Math.pow(config.friction, deltaTime / 16)

        if (Math.abs(item.velocity.x) < config.minVelocity) item.velocity.x = 0
        if (Math.abs(item.velocity.y) < config.minVelocity) item.velocity.y = 0

        checkBounds(item)
      }
    })

    checkCollisions()
  }

  animationFrameId = requestAnimationFrame(myAnimate)
}

// 拖拽事件
const startDrag = (e: MouseEvent, item: DraggableItem) => {
  if (item.isEntering) return // 入场动画期间禁止拖拽

  item.isDragging = true
  item.dragOffset = {
    x: e.clientX - item.position.x,
    y: e.clientY - item.position.y
  }
  item.scale = 1.1
  item.velocity = { x: 0, y: 0 }
  item.position = {
    x: e.clientX - item.dragOffset.x,
    y: e.clientY - item.dragOffset.y
  }
}

const onDrag = (e: MouseEvent, item: DraggableItem) => {
  if (!item.isDragging || item.isEntering) return

  const targetX = e.clientX - item.dragOffset.x
  const targetY = e.clientY - item.dragOffset.y

  item.velocity = {
    x: (targetX - item.position.x) * config.followStiffness * 10,
    y: (targetY - item.position.y) * config.followStiffness * 10
  }

  item.velocity = limitVelocity(item.velocity)
  item.position = { x: targetX, y: targetY }
  item.rotation = item.velocity.x * 0.3
}

const stopDrag = (item: DraggableItem) => {
  item.isDragging = false
  item.scale = 1
}

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
  animationFrameId = requestAnimationFrame(myAnimate)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div
      v-for="item in items"
      :key="item.id"
      class="draggable"
      :style="{
      transform: `
        translate(${item.position.x}px, ${item.position.y}px)
        rotate(${item.rotation}deg)
        scale(${item.scale})
      `,
      transition: item.isDragging
        ? 'none'
        : item.isEntering
          ? 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease'
          : 'transform 0.15s ease-out, box-shadow 0.3s ease',
      width: `${item.size.width}px`,
      height: `${item.size.height}px`,
      background: `rgba(255, 255, 255, 0.1)`,
      borderRadius: '10px',
      boxShadow: item.isDragging
        ? `0 25px 45px rgba(0, 0, 0, 0.2),
           inset 0 0 15px rgba(255, 255, 255, 0.2),
           0 0 ${Math.min(item.collisionCount * 3, 15)}px ${item.color}`
        : `0 25px 45px rgba(0, 0, 0, 0.1),
           inset 0 0 10px rgba(255, 255, 255, 0.1)`,
      border: `1px solid rgba(255, 255, 255, 0.5)`,
      borderRight: `1px solid rgba(255, 255, 255, 0.2)`,
      borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
      backdropFilter: 'blur(8px)',
      zIndex: item.isDragging ? 20 : 10,
      opacity: item.isDragging ? 0.95 : 0.9,
      animation: item.isEntering
        ? `enterAnimation ${config.enterAnimationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${item.enterDelay}ms forwards`
        : 'none',
      pointerEvents: item.isEntering ? 'none' : 'auto'
    }"
      @mousedown="startDrag($event, item)"
      @mousemove="onDrag($event, item)"
      @mouseup="stopDrag(item)"
      @mouseleave="stopDrag(item)"
  >
    <div
        class="glass-highlight"
        :style="{
        background: `linear-gradient(135deg, rgba(255,255,255,0.3), transparent)`
      }"
    ></div>
    <div
        class="collision-effect"
        v-if="item.collisionCount > 0"
        :style="{
        background: `radial-gradient(circle at center, ${item.color}, transparent 70%)`,
        opacity: item.collisionCount * 0.2
      }"
    ></div>
  </div>
</template>

<style scoped>
.draggable {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  transition: all 0.3s ease;
  will-change: transform;
  transform-origin: center;
}

.draggable:active {
  cursor: grabbing;
  z-index: 30;
}

.content {
  position: relative;
  z-index: 2;
  font-size: 1.5em;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.collision-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  z-index: 1;
  animation: collisionPulse 0.5s ease-out infinite alternate;
  pointer-events: none;
}

@keyframes collisionPulse {
  0% {
    opacity: 0.1;
    transform: scale(1);
  }
  100% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

@keyframes enterAnimation {
  0% {
    transform: translate(-50px, -50px) scale(0.2) rotate(-180deg);
    opacity: 0;
    filter: blur(2px);
  }
  40% {
    transform: translate(0, 0) scale(1.05) rotate(15deg);
    opacity: 0.8;
    filter: blur(0);
  }
  70% {
    transform: scale(0.98) rotate(-5deg);
    opacity: 1;
  }
  85% {
    transform: scale(1.01) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.9;
  }
}
</style>
