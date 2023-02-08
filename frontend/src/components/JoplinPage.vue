<template>
    <div class="wrap">
        <div class="sideMenu">
            <li><button v-on:click="test1">test1</button></li>
            <li><button v-on:click="test2">test2</button></li>
        </div>
        <Content v-bind:page="page"/>
    </div>
</template>

<script setup lang="ts">
import Content from './Content.vue';

let page = 'test.html';

const test1 = function():void {
    console.log('test1');
}

const test2 = function():void {
    console.log('test2');
}

</script>

<style scoped>
.wrap {
  display: flex;
}

.sideMenu {
    flex: 1;
}
</style>