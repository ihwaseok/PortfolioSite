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
import '../assets/panda-syntax-light.min.css'
import '../assets/mermaid.min.js'
import '../assets/mermaid_render.js'
import axios, { type AxiosResponse } from 'axios';
import { ref } from 'vue';
import type { Ref } from 'vue';
import MarkDownIt from 'markdown-it'
import Mermaid from 'markdown-it-textual-uml'
import hljs from 'highlight.js'


const md: MarkDownIt = new MarkDownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                '</code></pre>';
        } catch (__) {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
md.use(Mermaid);
let htmlText: Ref<string> = ref('');

// 메뉴 path에 있는 html 파일의 내용을 가져오기
function getHtmlText (path: string) {
    if (path != null && path != undefined) {
        axios.get('/joplin/page/r', {params: {pagePath: path}})
            .then((res: AxiosResponse) => {
                htmlText.value = md.render(res.data);
            });
    }
}

// Init
const index: string = '/index.md';
getHtmlText(index);

// App 에서 getHtmlText를 호출할 수 있도록 설정
defineExpose({ getHtmlText });

</script>


<style>
.content-div {
    margin-top: 5rem;
}
.content-box {
  padding: 1.25rem;
  border-radius: 0.25rem;
}
table {
    border: solid 1px #DDEEEE;
    border-collapse: collapse;
    border-spacing: 0;
    font: normal 13px Arial, sans-serif;
}
thead th {
    background-color: #DDEFEF;
    border: solid 1px #DDEEEE;
    color: #336B6B;
    padding: 10px;
    text-align: left;
    text-shadow: 1px 1px 1px #fff;
}
tbody td {
    border: solid 1px #DDEEEE;
    color: #333;
    padding: 10px;
    text-shadow: 1px 1px 1px #fff;
}
</style>