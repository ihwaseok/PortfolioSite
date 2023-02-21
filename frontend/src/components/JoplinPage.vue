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
import axios, { type AxiosResponse } from 'axios';
import { ref } from 'vue';
import type { Ref } from 'vue';
import MarkDownIt from 'markdown-it'
import mermaid from 'mermaid'
import hljs from 'highlight.js'


// md 파일을 html으로 변환하기 위한 객체
const md: MarkDownIt = new MarkDownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs" code="' + lang + '"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
            } catch (__) {}
        }

        return '<pre class="hljs" code="' + lang + '"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
let htmlText: Ref<string> = ref('');

// 메뉴 path에 있는 md 파일의 내용을 가져오기
function getHtmlText (path: string) {
    if (path != null && path != undefined) {
        axios.get('/joplin/page/r', {params: {pagePath: path}})
            .then((res: AxiosResponse) => {                
                let html: string = md.render(res.data);
                htmlText.value = renderMermaid(html);
            });
    }
}

// mermaid를 렌더링 하는 메소드
// 기존 코드를 렌더링된 svg로 대체한다
function renderMermaid (html: string): string {
    // <pre class="hljs" code="mermaid"><code> ~ </code></pre> 사이의 데이터 가져오기 위한 정규 표현식
    const reg: RegExp = /(?<=\<pre class="hljs" code="mermaid"\>\<code\>)(.*?)(?=\<\/code\>\<\/pre\>)/gs;
    const mermaidList = html.match(reg);
    
    if (mermaidList != null) {
        for (let item of mermaidList) {
            const beforeHtml = item.replace(/&gt;/gs, '>');
            const svg: string = mermaid.render('mermaid', beforeHtml);
            html = html.replace(item, svg);
        }
    }

    return html;
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