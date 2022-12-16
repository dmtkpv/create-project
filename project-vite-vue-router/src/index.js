import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './index.vue'
import Home from './routes/home.vue'

const routes = [{ path: '/', component: Home }]
const history = createWebHashHistory();
const router = createRouter({ routes, history })
const app = createApp(App);

app.use(router);
app.mount('body')

