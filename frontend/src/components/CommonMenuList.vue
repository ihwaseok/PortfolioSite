<template>
<li v-for="(item) in menuList" v-bind:key="item.ID">
    <a href="#" class="menu-item" v-bind:class="{active : (selectedId == item.ID)}">
        {{ item.NAME }}
    </a>
</li>
</template>


<script setup lang="ts">
import Axios, { type AxiosResponse, AxiosError } from 'axios';
import { ref, type Ref } from 'vue';
import type { MenuData } from '../custom/customType';

let selectedId: Ref<string> = ref('');
let menuList: Ref<Partial<MenuData>[]> = ref([]);

// 메뉴 데이터 리스트 초기화
Axios.get('/public/menu/r', {params: {id: 'all'}})
    .then((res: AxiosResponse) => {
        menuList.value = res.data;
    })
    .catch((error: AxiosError) => {
        alert('에러 발생');
    });
</script>


<style scoped>
.menu-title {
    display: block;
    font-size: 18px;
    text-align: center;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid black;
    background-color: #40BFFF;
    min-height: 2rem;
}
.menu-item {
    display: block;
    color:black;
    padding: 0 0.625rem 0 0.8rem;
    margin: 0;
    font-weight: 500;
    text-decoration: none;
    line-height: 1.875rem;
    border-bottom: 1px solid black;
}
.menu-item:hover {
    color: blue;
}

.active {
    background-color: #ACCEE5;
}
</style>