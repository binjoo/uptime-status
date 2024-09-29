import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'

import defaultConfig from '/default.config.js';
import appConfig from '/app.config.js';

import './assets/style.scss'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.provide('$config', {
  ...defaultConfig,
  ...appConfig,
})
document.title = appConfig.title || defaultConfig.title
app.mount('#app')