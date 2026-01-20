import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './styles/main.css';

// 创建 Vue 应用
const app = createApp(App);

// 创建 Pinia 状态管理
const pinia = createPinia();
app.use(pinia);

// 挂载应用
app.mount('#app');
