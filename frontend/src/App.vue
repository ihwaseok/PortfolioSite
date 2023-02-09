<template>
  <div id="app">
    <Header/>
    <div>
      <JoplinMenu/>
      <JoplinPage class="content" v-bind:page="page"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios, { type AxiosResponse } from 'axios';

import Header from './components/Header.vue';
import JoplinMenu from './components/JoplinMenu.vue';
import JoplinPage from './components/JoplinPage.vue';


let menuList: object[] = [];
let page = 'test.html';


axios.get('/joplin/menu/r', {params: {id: 'all'}})
  .then((res: AxiosResponse) => {
      menuList = res.data;
      console.log(menuList);
  });
</script>

<style scoped>
</style>