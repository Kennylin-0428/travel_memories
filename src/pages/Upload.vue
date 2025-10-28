<template>
  <div class="upload-page">
    <h2>在 {{ cityName }} 新增一筆回憶</h2>

    <form @submit.prevent="uploadMemory" class="upload-form">
      <div class="form-item">
        <label>選擇圖片：</label>
        <input type="file" @change="handleFile" accept="image/*" />
      </div>

      <div class="form-item">
        <label>說明文字：</label>
        <textarea v-model="caption" placeholder="輸入這張照片的描述..."></textarea>
      </div>

      <button type="submit">上傳回憶</button>
    </form>

    <router-link :to="`/city/${cityName}`" class="back-link">← 返回 {{ cityName }} 回憶牆</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const cityName = route.params.city;

const file = ref(null);
const caption = ref('');

function handleFile(e) {
  file.value = e.target.files[0];
}

async function uploadMemory() {
  if (!file.value) {
    alert('請先選擇一張圖片');
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('caption', caption.value);
  formData.append('city', cityName);

  try {
    await axios.post('http://localhost:8000/api/memories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('上傳成功！');
    router.push(`/city/${cityName}`);
  } catch (err) {
    console.error(err);
    alert('上傳失敗，請稍後再試');
  }
}
</script>

<style scoped>
.upload-page {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  text-align: left;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  padding: 10px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #007bff;
}
</style>
