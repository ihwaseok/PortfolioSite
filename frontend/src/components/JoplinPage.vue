<template>
    <div class="container-fluid">

        <!-- content -->
        <main role="main">

            <!-- full box -->
            <div class="content-box mb-3 bg-white shadow-sm" v-html="htmlText">
            </div>

        </main>

    </div>
</template>


<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import type { Ref } from 'vue';


let htmlText: Ref<string> = ref('');

// 메뉴 path에 있는 html 파일의 내용을 가져오기
function getHtmlText (path: string) {
    axios.get('/joplin/page/r', {params: {pagePath: path}})
        .then((res) => {
            htmlText.value = res.data;
        });
}

// App 에서 getHtmlText를 호출할 수 있도록 설정
defineExpose({ getHtmlText });

</script>


<style scoped>

</style>