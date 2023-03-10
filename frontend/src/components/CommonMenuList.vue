<template>
<li v-for="(item) in testData" v-bind:key="item.ID">
    <a href="#" class="menu-item" v-bind:class="{active : (selectedId == item.ID)}" v-bind="{menuPath: item.PATH}">
        {{ item.NAME }}
    </a>
</li>
</template>


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { MenuData } from '../custom/customType';

let selectedId: Ref<string> = ref('');
const testData: Partial<MenuData>[] = [{ID:'a', NAME:'a', PATH:'a'}];
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