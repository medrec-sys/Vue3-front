<script setup lang="ts">
import {onMounted, watch} from "vue";
import {animate, stagger} from "animejs";

const initAnimation = () => {
  animate(".square", {
    y: {from: 100},
    top: {from: 150},
    left: {from: 150},
    scale: {from: 0},
    duration: 1800,
    delay: stagger(100, {start: 0}),
    autoplay: true,
    easing: "inOutQuad",
    onComplete: () => moveAnimation()
  });

  const moveAnimation = () => {
    animate(".square", {
      y: [
        {to: stagger([20, 50])},
        {to: 0}
      ],
      duration: stagger(317, {start: 2400}),
      delay: stagger(100, {start: 0}),
      loop: true,
      autoplay: true,
      easing: "inOutQuad",
    });
  };
};

const props = defineProps<{
  isLogin: boolean
}>();

watch(() => props.isLogin, () => {
  animate('.square', {
    scale: 0,
    rotate: 360,
    alternate: true,
    loop: 1,
    duration: 1000,
    ease: "inOutQuart"
  })
})
onMounted(() => {
  initAnimation()
});
</script>

<template>
  <div class="square" v-for="i in 5" :key="i" :style="`--i:${i-1};`"></div>
</template>

<style scoped>
.square {
  position: absolute;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}


.square:nth-child(1) {
  top: -50px;
  right: -60px;
  width: 100px;
  height: 100px;
  animation-delay: 0s;
}

.square:nth-child(2) {
  top: 150px;
  left: -100px;
  width: 120px;
  height: 120px;
  z-index: 2;
  animation-delay: -1s;
}

.square:nth-child(3) {
  bottom: 50px;
  right: -60px;
  width: 80px;
  height: 80px;
  z-index: 2;
  animation-delay: -2s;
}

.square:nth-child(4) {
  bottom: -80px;
  left: 100px;
  width: 50px;
  height: 50px;
  animation-delay: -3s;
}

.square:nth-child(5) {
  top: -90px;
  left: 140px;
  width: 60px;
  height: 60px;
  animation-delay: -4s;
}
</style>
