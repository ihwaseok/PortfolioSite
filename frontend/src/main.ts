import { createApp, type App } from 'vue';
import Axios from 'axios';
import VueAxios from 'vue-axios';

import AppComponent from './App.vue';
import Router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';


const app: App<Element> = createApp(AppComponent);

app.use(Router);
app.use(VueAxios, Axios);

app.mount('#app');