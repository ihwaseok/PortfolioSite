<template>
<body>
    <nav class="wrap">
        <div class="sideMenu">
            <li><button v-on:click="test1">test1</button></li>
            <li><button v-on:click="test2">test2</button></li>
        </div>
        <div class="subMenu">
            <li><button v-on:click="test1">test3</button></li>
            <li><button v-on:click="test2">test4</button></li>
        </div>
        <Content class="content" v-bind:page="page"/>
    </nav>
</body>
</template>

<script setup lang="ts">
import axios, { type AxiosResponse } from 'axios';
import Content from './Content.vue';

let menuList: object[] = [];
let page = 'test.html';

const test1 = function():void {
    console.log('test1');
}

const test2 = function():void {
    console.log('test2');
}

axios.get('/joplin/menu/r', {params: {id: 'all'}})
    .then((res: AxiosResponse) => {
        menuList = res.data;
        console.log(menuList);
    });

</script>

<style scoped>
.wrap {
    display: flex;
}

.sideMenu {
    position: fixed;
    overflow: auto;
    background-color: aqua;
}

.subMenu {
    position: fixed;
    overflow: auto;
    margin-left: 10%;
    background-color: aquamarine;
}

.content {
    margin-left: 25%;
}
</style>