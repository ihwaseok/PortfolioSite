import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';

library.add(fas);

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');