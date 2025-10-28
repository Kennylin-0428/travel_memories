<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title" @click="goHome">🌍 Travel Memories</h1>
    </header>

    <!-- 路由切換區域 -->
    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>© 2025 Travel Memories — 記錄每一段旅程的美好</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function goHome() {
  router.push('/');
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  background-color: #fafafa;
  color: #333;
}

/* 頁首 */
.app-header {
  background-color: #4CAF50;
  color: white;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
}
.app-title {
  font-size: 24px;
  margin: 0;
}

/* 主內容 */
.app-content {
  flex: 1;
  padding: 20px;
}

/* 頁尾 */
.app-footer {
  background-color: #f2f2f2;
  text-align: center;
  font-size: 14px;
  padding: 10px 0;
  color: #666;
}
</style>
