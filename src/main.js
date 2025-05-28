/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import VueApexCharts from "vue3-apexcharts";

// Styles
import 'unfonts.css'

const app = createApp(App)

// Define a variável global `endpoint`
//app.config.globalProperties.endpoint = 'http://localhost:8000/api'
app.config.globalProperties.endpoint = 'https://grupo-colab.tech:8100/api'

// Plugins
app.use(VueApexCharts);
registerPlugins(app)

app.mount('#app')
