<script setup lang="ts">
import {onBeforeMount, ref, nextTick} from 'vue'
import {animate} from "animejs";

const rainContainer = ref<HTMLElement | null>(null)
const wordList = ref<string[]>([])
const words = ref<{text: string, left: number, id: number, size: number, color: string}[]>([])

// 生成随机颜色
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B',
    '#FB5607', '#8338EC', '#3A86FF', '#FF006E'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 生成随机大小 (12px-36px)
const getRandomSize = () => Math.floor(Math.random() * 25) + 12

onBeforeMount(async () => {
  wordList.value = [
    'health', 'disease', 'medicine', 'prevention', 'immunity',
    'nutrition', 'exercise', 'rehabilitation', 'diagnosis', 'treatment',
    'blood pressure', 'blood sugar', 'cholesterol', 'respiration', 'heart',
    'cancer', 'allergy', 'genetics', 'virus', 'bacteria'
  ]
  wordList.value.forEach((item, index) => {
    const word = {
      text: item,
      left: Math.random() * 100,
      id: index,
      size: getRandomSize(),
      color: getRandomColor()
    }
    words.value.push(word)

    nextTick(() => {
      animate(`.word-${word.id}`,{
        translateY: 1400,
        translateX: 1000 * (Math.random() * 2 - 1),
        rotateX: 360,  // X轴旋转
        rotateY: 360,  // Y轴旋转
        rotate: 500 * Math.random() * (index % 2 == 0 ? 1 : -1),
        duration: 8000,
        delay: index * 500,
        loop: true,
        ease: 'linear'
      })

    })
  })
})


</script>

<template>
  <div class="word-rain-container" ref="rainContainer">
    <div
        v-for="word in words"
        :key="word.id"
        class="word"
        :class="`word-${word.id}`"
        :style="{
        left: `${word.left}%`,
        fontSize: `${word.size}px`,
        '--word-color': word.color, // 传递颜色变量
        textShadow: `0 0 8px ${word.color}80`
      }"
    >
      {{ word.text }}
    </div>
  </div>
</template>

<!--suppress CssUnresolvedCustomProperty -->
<style scoped>
.word {
  position: absolute;
  top: -50px;
  font-weight: bold;
  white-space: nowrap;
  will-change: transform, opacity;
  opacity: 0.4;

  /* 渐变颜色效果 */
  background: linear-gradient(
      to bottom,
      var(--word-color),
      color-mix(in srgb, var(--word-color), white 50%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 8px color-mix(in srgb, var(--word-color), transparent 70%);

  /* 3D变换支持 */
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.word:hover {
  opacity: 1;
  transform: scale(1.1);
}

.word-rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
  perspective: 1000px;
}
</style>
