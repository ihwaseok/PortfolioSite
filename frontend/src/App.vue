<template>
  <div id="app">
    <Header v-bind:onGetTopMenu="getTopMenu"/>
    <div>
      <div class="d-flex" v-if="selectedMenu == '1'">
        <JoplinMenu v-bind:onGetMenuPath="getMenuPath"/>
        <JoplinPage ref="joplinPageRef"/>
      </div>

      <div class="d-flex" v-if="selectedMenu == '2'">
        <CommonMenu/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import Header from './components/Header.vue';
import JoplinMenu from './components/JoplinMenu.vue';
import JoplinPage from './components/JoplinPage.vue';
import CommonMenu from './components/CommonMenu.vue';


let joplinPageRef: Ref<typeof JoplinPage> = ref(JoplinPage);
let selectedMenu: Ref<string> = ref('2');

// JoplinMenu로 부터 메뉴 Path 가져오기 (Emit-Receive)
// 받아온 메뉴 Path로 JoplinPage의 메소드 호출
function getMenuPath (menuPath: string): void {
  joplinPageRef.value!.getHtmlText(menuPath);
}

// Header로 부터 상단 메뉴 Id 가져오기 (Emit-Receive)
// 받아온 메뉴 Id로 컴포넌트 구성 변경
function getTopMenu (topMenu: string): void {
  selectedMenu.value = topMenu;
}

</script>


<style scoped>
</style>