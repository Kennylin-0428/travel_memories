import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import City from '../pages/City.vue';
import Upload from '../pages/Upload.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/city/:name', component: City },
  { path: '/upload/:city', component: Upload }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
