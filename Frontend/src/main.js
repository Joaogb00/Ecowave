import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// cria instância do Pinia
const pinia = createPinia();

// registra Pinia e Router na app
app.use(pinia);
app.use(router);

app.mount('#app');