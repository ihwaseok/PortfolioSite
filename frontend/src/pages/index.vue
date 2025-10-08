<template>
  <v-layout>

    <!-- 상단 메뉴바 -->
    <v-app-bar color="#211F22" height="50" title="LSH Portpolio Site">
      <!-- 바로가기 버튼 -->
      <div class="flex flex-row">
        <v-btn href="https://mylsh-redmine.duckdns.org">
          <v-icon style="font-size:24px;padding-right:5px;">mdi-alpha-r-box</v-icon>
          <span>일감관리 사이트</span>
        </v-btn>

        <v-btn href="https://mylsh-zabbix.duckdns.org">
          <v-icon style="font-size:24px;padding-right:5px;">mdi-monitor-eye</v-icon>
          <span>모니터링 사이트</span>
        </v-btn>

        <v-btn href="https://github.com/ihwaseok">
          <v-icon style="font-size:24px;">mdi-github</v-icon>
        </v-btn>
      </div>

      <!-- 기타 버튼 -->
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>

        <!-- 기타 목록 -->
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item link v-on:click="syncJoplin">
              <v-tooltip text=".md 정적파일 목록을 파싱하여 DB 정보 최신화">
                <template v-slot:activator="{ props }">
                  <v-list-item-title v-bind="props">Joplin Sync</v-list-item-title>
                </template>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

    </v-app-bar>

    <!-- 조플린 좌측메뉴 -->
    <JoplinMenu v-bind:onGetMenuPath="getMenuPath"/>

    <!-- 상세 페이지 -->
    <v-main style="min-height: 300px;">
      <JoplinPage ref="joplinPageRef" />
    </v-main>

    <!-- 로딩 이미지 -->
    <LoadingSpinner v-bind:isSpinning="isSpinning"/>

  </v-layout>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import Axios, { type AxiosResponse, type AxiosError } from 'axios';
import JoplinMenu from '@/components/JoplinMenu.vue';
import JoplinPage from '@/components/JoplinPage.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';


let joplinPageRef: Ref<typeof JoplinPage> = ref(JoplinPage);
let isSpinning: Ref<boolean> = ref(false);

// JoplinMenu로 부터 메뉴 Path 가져오기 (Emit-Receive)
// 받아온 메뉴 Path로 JoplinPage의 메소드 호출
function getMenuPath (menuPath: string): void {
  joplinPageRef.value!.getHtmlText(menuPath);
}

// Joplin Sync 클릭 이벤트
function syncJoplin(event: Event): void {
    isSpinning.value = true;
    
    Axios.get('/joplin/sync/r')
        .then((res: AxiosResponse) => {
            isSpinning.value = false;
            window.location.reload();
        })
        .catch((error: AxiosError) => {
            isSpinning.value = false;
            alert('에러 발생');
        });
}
</script>
