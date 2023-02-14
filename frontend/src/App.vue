<template>
  <div id="app">
    <Header/>
    <div class="d-flex">
      <JoplinMenu v-bind:onGetMenuPath="getMenuPath"/>
      <JoplinPage ref="joplinPageRef"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import Header from './components/Header.vue';
import JoplinMenu from './components/JoplinMenu.vue';
import JoplinPage from './components/JoplinPage.vue';


let joplinPageRef: Ref<typeof JoplinPage | null | undefined> = ref();

// JoplinMenu로 부터 메뉴 Path 가져오기 (Emit-Receive)
// 받아온 메뉴 Path로 JoplinPage의 메소드 호출
function getMenuPath (menuPath: string): void {
  joplinPageRef.value!.getHtmlText(menuPath);
}

</script>


<style scoped>
</style>