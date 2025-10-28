<template>
  <div class="home-container">
    <h1 class="title">旅行回憶地圖</h1>
    <p class="subtitle">點擊地圖上的城市，開始記錄你的旅程回憶！</p>
    <MapView />
  </div>
</template>

<script setup>
import MapView from '../components/MapView.vue';
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}
</style>
