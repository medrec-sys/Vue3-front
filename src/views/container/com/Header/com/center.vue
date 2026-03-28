<script setup lang="ts">

</script>

<template>
  <div class="center-box">
    <router-link to="/personal">个人中心</router-link>
  </div>

</template>

<style scoped>
.center-box {
  position: fixed;
  right: 20px;
  top: 15px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1px);
  padding: 10px 15px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.center-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.center-box a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 5px 0;
}

.center-box a:hover {
  color: #409eff;
}

@media (max-width: 768px) {
  .center-box {
    right: 10px;
    top: 10px;
    padding: 8px 12px;
  }
}
</style>
