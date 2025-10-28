<template>
  <form @submit.prevent="uploadMemory">
    <input type="file" @change="handleFile" />
    <textarea v-model="caption" placeholder="說點什麼..." />
    <button type="submit">上傳</button>
  </form>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
const file = ref(null);
const caption = ref('');

function handleFile(e) {
  file.value = e.target.files[0];
}

async function uploadMemory() {
  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('caption', caption.value);
  await axios.post('http://localhost:8000/api/memories/upload', formData);
  alert('上傳成功！');
}
</script>
