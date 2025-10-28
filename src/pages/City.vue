<template>
  <div class="city-page">
    <h2 class="city-title">{{ cityName }} 的回憶</h2>

    <div class="memory-list">
      <div v-if="memories.length === 0" class="no-memory">
        <p>還沒有任何回憶，趕快 <router-link :to="`/upload/${cityName}`">新增一筆吧！</router-link></p>
      </div>

      <div v-else class="photo-grid">
        <div v-for="(m, index) in memories" :key="index" class="photo-card">
          <img :src="m.imageUrl" alt="memory photo" />
          <p>{{ m.caption }}</p>
        </div>
      </div>
    </div>

    <router-link :to="`/upload/${cityName}`" class="upload-btn">+ 新增回憶</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const cityName = route.params.name;
const memories = ref([]);

// 模擬從後端取得回憶資料（可以之後改成真實 API）
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/memories?city=${cityName}`);
    memories.value = res.data || [];
  } catch (e) {
    console.warn('取得回憶失敗：使用假資料');
    // 假資料示範
    memories.value = [
      { imageUrl: 'https://picsum.photos/300/200?random=1', caption: '第一次到訪這座城市！' },
      { imageUrl: 'https://picsum.photos/300/200?random=2', caption: '這裡的夜景超級漂亮 🌃' }
    ];
  }
});
</script>

<style scoped>
.city-page {
  padding: 20px;
  text-align: center;
}

.city-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.photo-card {
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  overflow: hidden;
  background-color: white;
}

.photo-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-card p {
  margin: 10px;
  font-size: 14px;
  color: #333;
}

.no-memory {
  margin-top: 30px;
  color: #666;
}

.upload-btn {
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
.upload-btn:hover {
  background-color: #45a049;
}
</style>
