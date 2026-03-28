<script setup>
import Login from './com/login.vue'
import WordRain from "./com/wordRain.vue";
import Circular from "./com/circular.vue";
import DraggableGood from "./com/draggableGood.vue";


</script>

<template>
  <Circular></Circular>
  <WordRain></WordRain>
  <section class="login-section">
    <div class="color color-1"></div>
    <div class="color color-2"></div>
    <div class="color color-3"></div>
    <Login></Login>

  </section>
    <DraggableGood></DraggableGood>

</template>



<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  user-select: none;
}

.login-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f1f4f9, #dff1ff);
  overflow: hidden;
}

.color {
  position: absolute;
  filter: blur(150px);
  opacity: 0.5;
  z-index: 0;
}

.color-1 {
  top: -1200px;
  width: 2100px;
  height: 1800px;
  background: #ff359b;
  animation: colorAnimation1 15s infinite alternate;
}

.color-2 {
  bottom: -120px;
  left: -100px;
  width: 1000px;
  height: 1000px;
  background: #fffd87;
  animation: colorAnimation2 12s infinite alternate;
}

.color-3 {
  bottom: -150px;
  right: -100px;
  width: 1100px;
  height: 900px;
  background: #00d2ff;
  animation: colorAnimation3 18s infinite alternate;
}

@keyframes colorAnimation1 {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(50px) rotate(5deg); }
}

@keyframes colorAnimation2 {
  0% { transform: translateX(0) rotate(0deg); }
  100% { transform: translateX(30px) rotate(-3deg); }
}

@keyframes colorAnimation3 {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-20px, 20px) rotate(2deg); }
}


</style>
