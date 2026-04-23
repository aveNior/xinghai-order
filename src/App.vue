<template>
  <div class="app-container">
    <div class="page-content">
      <router-view />
    </div>

    <div class="tab-bar">
      <div 
        class="tab-item" 
        @click="$router.push('/')"
        :class="{ active: $route.path === '/' }"
      >
        <span class="tab-icon"><img src="../src/assets/img/bar_img/cat.png" class="icon"></span>
        <span class="tab-text">主页</span>
      </div>
      <div 
        class="tab-item" 
        @click="$router.push('/my')"
        :class="{ active: $route.path === '/my' }"
      >
        <span class="tab-icon"><img src="../src/assets/img/bar_img/dog.png" class="icon"></span>
        <span class="tab-text">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.meta.title,
  (newTitle) => {
    if (newTitle) {
      document.title = newTitle
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* 烟灰白高级背景 */
.app-container {
  width: 100vw;
  min-height: 100vh;
  background: #f5f5f7;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 60px;
}

.page-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
}

.icon{
  width: 38px;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.tab-item.active {
  color: #ff753a;
}

.tab-icon {
  font-size: 20px;
  line-height: 1;
}

.tab-text {
  font-size: 12px;
  margin-top: 4px;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: #f5f5f7;
  overflow-x: hidden;
  overscroll-behavior-y: none;
}
</style>