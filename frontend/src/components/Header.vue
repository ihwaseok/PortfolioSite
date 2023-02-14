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
            <li class="nav-item"><a href="#" class="nav-link"><font-awesome-icon icon="phone"/></a></li>
        </ul>
    </header>
</div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'


const menuList = [{id: '1', name: '공부 기록'}, {id: '2', name: '테스트'}]
let selectedId: Ref<string> = ref('1');

function menuSelect (menuId: string): void {
    selectedId.value = menuId;
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
    margin-right: 4rem;
}
</style>