import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../../backend/static/joplin/pluginAssets/highlight.js/atom-one-light.css'

import App from './App.vue';
import router from './router';


const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

app.mount('#app');