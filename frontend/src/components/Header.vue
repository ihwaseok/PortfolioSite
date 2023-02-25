<template>
<div class="sticky-top header-bg-white">
    <header class="d-flex flex-wrap justify-content-center py-1">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none header-logo">
        <span class="fs-4">LSH Portpolio Site</span>
        </a>

        <ul class="nav nav-pills header-nav">
            <li class="nav-item" v-for="(item) of menuList">
                <a href="#" class="nav-link" v-bind:id="item.id" v-bind:class="{active: (selectedId == item.id)}" v-on:click="menuSelect(item.id)">
                    {{ item.name }}
                </a>
            </li>

            <div class="vr mg-l-1"></div>

            <li>
                <a href="https://github.com/ihwaseok/PortpolioSite" class="nav-link pd-r">
                    <GithubIcon/>
                    Github
                </a>
            </li>
            <li>
                <a href="#" class="nav-link" v-on:click="syncJoplin">
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
        .then((res) => {
            isSpinning.value = false;
            window.location.reload();
        });
}

</script>


<style scoped>
.header-bg-white {
    background-color: #9bc3fe;
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
</style>