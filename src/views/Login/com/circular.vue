<script setup lang="ts">
import {onMounted} from "vue";
import {animate, stagger, createDraggable} from "animejs";

const initAnimation = () => {

  const draggable = () => {
    createDraggable(".circle");

  };

  animate(".circle", {
    y: {from: 100},
    scale: {from: 0, to: 1},
    opacity: {from: 0, to: 1},
    duration: 1800,
    delay: stagger(200, {start: 0}),
    autoplay: true,
    easing: "inOutQuad",
    onComplete: () => {
      draggable()
    }
  });
};

onMounted(() => {

  initAnimation();
});
</script>

<template>
  <div class="circle" v-for="i in 8" :key="i" :style="`--i:${i-1};`">
    <div class="bubble-highlight"></div>
  </div>
</template>

<style scoped>
.circle {
  position: fixed;
  backdrop-filter: blur(20px); /* 进一步增加模糊度 */
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08), /* 更柔和的阴影 */ inset 0 -10px 30px rgba(255, 255, 255, 0.1); /* 更微妙的内阴影 */
  border: 1px solid rgba(255, 255, 255, 0.15); /* 更淡的边框 */
  background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.15) 0%, /* 更低的核心透明度 */ rgba(255, 255, 255, 0.06) 30%, /* 更早开始渐变 */ rgba(255, 255, 255, 0.005) 80% /* 几乎完全透明的边缘 */
  );
  border-radius: 50%;
  will-change: transform, opacity;
  overflow: hidden;
  z-index: 1;
  opacity: 0.85; /* 稍低的整体透明度 */
  transition: opacity 0.5s ease; /* 添加透明度过渡效果 */
}

/* 更柔和的泡泡高光效果 */
.bubble-highlight {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.5) 0%, /* 更低的高光强度 */ rgba(255, 255, 255, 0) 70% /* 更快过渡到透明 */
  );
  border-radius: 50%;
  filter: blur(10px); /* 更大的模糊 */
  transform: rotate(45deg);
  animation: bubbleBreath 6s ease-in-out infinite; /* 更慢的呼吸动画 */
  opacity: 0.6; /* 更低的高光透明度 */
  mix-blend-mode: overlay; /* 添加混合模式增强效果 */
}

/* 大圆形特殊处理 */
.circle:nth-child(2),
.circle:nth-child(3),
.circle:nth-child(4),
.circle:nth-child(7) {
  opacity: 0.6; /* 更大的圆更低透明度 */
  backdrop-filter: blur(25px); /* 更大的模糊 */
}

/* 调整圆形位置和大小 */
.circle:nth-child(1) {
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
}

.circle:nth-child(2) {
  top: 70%;
  left: -15%;
  width: 750px;
  height: 750px;
}

.circle:nth-child(3) {
  top: -40%;
  right: 5%;
  width: 750px;
  height: 750px;
}

.circle:nth-child(4) {
  bottom: 70%;
  right: 70%;
  width: 1400px;
  height: 1400px;
  opacity: 0.5; /* 最大的圆最低透明度 */
}

.circle:nth-child(5) {
  top: 30%;
  left: 90%;
  transform: translateX(-50%);
  width: 90px;
  height: 90px;
}

.circle:nth-child(6) {
  bottom: 20%;
  left: 40%;
  width: 160px;
  height: 160px;
}

.circle:nth-child(7) {
  top: 40%;
  right: -20%;
  width: 600px;
  height: 600px;
}

.circle:nth-child(8) {
  top: 40%;
  left: 25%;
  width: 110px;
  height: 110px;
}

/* 更柔和的呼吸动画 */
@keyframes bubbleBreath {
  0%, 100% {
    transform: scale(0.9) rotate(40deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1) rotate(50deg);
    opacity: 0.7;
  }
}
</style>
