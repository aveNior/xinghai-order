import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import 'vue3-carousel/dist/carousel.css'

const app = createApp(App)
app.use(router)
app.mount('#app')