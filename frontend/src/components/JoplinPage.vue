<template>
<div class="container-fluid">

    <!-- content -->
    <main role="main">

        <!-- page -->
        <div class="content-box" v-html="htmlText"></div>

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

// Init
const index: string = 'C:\\Users\\Seok\\Documents\\GitHub\\PortpolioSite\\backend\\dist\\public\\joplin\\index.html';
getHtmlText(index);

// App 에서 getHtmlText를 호출할 수 있도록 설정
defineExpose({ getHtmlText });

</script>


<style scoped>
.content-div {
    margin-top: 5rem;
}
.content-box {
  padding: 1.25rem;
  border-radius: 0.25rem;
}
</style>