<script setup lang="ts">
import {useHomeStore} from '@/stores'
import {ref, watch} from 'vue'
import {SIDEBAR_MENU_ITEMS} from "@/constant/SystemRouterConfig";
import {useRouter} from 'vue-router';

const router = useRouter();
const homeStore = useHomeStore()

interface CardItem {
  name: string;
  desc: string;
  routePath: string;
  icon: any;
  color: string;
}

const cards = ref<CardItem[]>(SIDEBAR_MENU_ITEMS.slice(1))

const navigateTo = (path: string) => {
  router.push(path);
  homeStore.activeMenuItem = path;
};


// 监听天气变化
watch(() => homeStore.weatherType, (newVal) => {
  homeStore.weatherType = newVal;
  // 根据天气类型调整温度
  if (newVal === 'sunny') {
    homeStore.temperature = '28°C';
  } else if (newVal === 'cloudy') {
    homeStore.temperature = '22°C';
  } else {
    homeStore.temperature = '18°C';
  }
});

</script>

<template>
  <div style="width: 100%;height: 100%;overflow-x: auto">
    <div class="start-container">
      <!-- 欢迎卡片 -->
      <div class="welcome-card">
        <h1>欢迎来到医知库</h1>
        <p class="subtitle">一个集智能检索、知识图谱、临床决策、用药指导和AI辅助于一体的医药智能问答平台</p>
        <!-- 功能特点 -->
        <div class="features-container">
          <h2>系统功能</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="(feature, index) in [
          {icon: '📚', title: '单词学习', desc: '提供四级、六级和通用单词库，支持多种学习模式'},
          {icon: '📝', title: '智能测试', desc: '自动生成试卷，包含选择题、填空题和阅读理解题'},
          {icon: '🔍', title: '错题管理', desc: '记录错题，提供针对性练习，帮助巩固薄弱环节'},
          {icon: '🤖', title: 'AI助手', desc: '基于PDF的AI问答系统，提供个性化学习建议'}
        ]" :key="index">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 快速访问 -->
        <div class="quick-start">
          <h2>快速访问</h2>
          <div class="card-container">
            <div v-for="(item, index) in cards">
              <el-card

                  :key="index"
                  class="access-card"
                  :style="{ '--card-color': item.color }"
                  shadow="hover"
                  @click="navigateTo(item.routePath)"
              >
                <div class="card-content">
                  <div class="card-icon">
                    <el-icon :size="36" :color="item.color">
                      <component :is="item.icon"/>
                    </el-icon>
                  </div>
                  <div class="card-text">
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  user-select: none;
}

.start-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  color: #333;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.welcome-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.welcome-card h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 20px;
  line-height: 1.6;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.7);
  padding: 15px 25px;
  border-radius: 50px;
  width: fit-content;
  margin: 20px auto 0;
}

.weather-icon {
  font-size: 3rem;
  color: #f39c12;
}

.weather-details {
  text-align: left;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.location {
  color: #7f8c8d;
  font-size: 1rem;
  margin-top: 5px;
}

.features-container {
  margin-bottom: 40px;
}

.features-container h2,
.quick-start h2,
.about-section h2,
.project-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  position: relative;
}

.features-container h2::after,
.quick-start h2::after,
.about-section h2::after,
.project-section h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3498db, #9b59b6);
  margin: 10px auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.feature-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: default;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(52, 152, 219, 0.3);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #3498db;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.5;
}

.quick-start {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 40px;
  margin-bottom: 40px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.access-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  /*noinspection CssUnresolvedCustomProperty*/
  border-left: 4px solid var(--card-color);
}

.access-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 15px 0;
}

.card-icon {
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.access-card:hover .card-icon {
  transform: scale(1.1);
}

.card-text h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 6px;
}

.card-text p {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

.about-section {
  margin: 40px 0;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.project-section {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.project-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.project-link:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .start-container {
    padding: 20px;
  }

  .welcome-card {
    padding: 30px 20px;
  }

  .welcome-card h1 {
    font-size: 2rem;
  }

  .features-grid,
  .card-container {
    grid-template-columns: 1fr;
  }

  .project-links {
    flex-direction: column;
    gap: 15px;
  }

  .weather-info {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .weather-details {
    text-align: center;
  }
}
</style>
