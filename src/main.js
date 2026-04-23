import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 导入轮播图样式
import 'vue3-carousel/dist/carousel.css'

const app = createApp(App)
app.use(router)
app.mount('#app')