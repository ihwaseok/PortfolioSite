<template>
<div class="sticky-top header-bg-blue">
    <header class="d-flex flex-wrap justify-content-center header py-1">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none header-logo">
            <span class="fs-4 text-white">LSH Portpolio Site</span>
        </a>

        <ul class="nav nav-pills header-nav">
            <li class="nav-list">
                <a href="#" class="btn text-white" v-for="(item) of menuList" v-bind:id="item.id" v-bind:class="{active : (selectedId == item.id)}" v-on:click="menuSelect(item.id)">
                    {{ item.name }}
                </a>
            </li>

            <div class="vr mg-l-1"></div>

            <li class="nav-list">
                <a href="https://github.com/ihwaseok/PortpolioSite" class="nav-link pd-r text-white">
                    <GithubIcon/>
                    Github
                </a>
            </li>
            <li class="nav-list">
                <a href="#" class="nav-link text-white" v-on:click="syncJoplin">
                    <JoplinIcon/>
                    Joplin Sync
                </a>
            </li>
        </ul>
    </header>

    <LoadingSpinner v-bind:isSpinning="isSpinning"/>
</div>
</template>


<script setup lang="ts">
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { ref } from 'vue'
import type { Ref } from 'vue'
import GithubIcon from '../assets/icon/github.vue'
import JoplinIcon from '../assets/icon/Joplin-icon.vue'
import LoadingSpinner from './LoadingSpinner.vue'


const menuList = [{id: '1', name: '공부 기록'}, {id: '2', name: '테스트'}];
let selectedId: Ref<string> = ref('1');
let isSpinning: Ref<boolean> = ref(false);

// 메뉴 선택 이벤트
function menuSelect (menuId: string): void {
    selectedId.value = menuId;
}

// Joplin Sync 클릭 이벤트
function syncJoplin (): void {
    isSpinning.value = true;

    axios.get('/joplin/sync/r')
        .then((res: AxiosResponse) => {
            isSpinning.value = false;
            window.location.reload();
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
}

</script>


<style scoped>
.header-bg-blue {
    background-color: #408FFF;
}
.header {
    height: 4rem;
}
.header-logo {
    padding-left: 0.65rem;
}
.header-nav {
    margin-right: 1rem;
}
.mg-l-1 {
    margin-left:1rem;
}
.pd-r {
    padding-right: 0.3rem;
}
.text-white {
    color: white;
}
.active {
    background-color: #0060E5;
    border-color: #0060E5;
}
.nav-list {
    margin-top: 0.5rem;
    margin-left: 0.8rem;
}
</style>