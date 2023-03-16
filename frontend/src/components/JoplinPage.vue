<template>
<div class="container-fluid">

    <!-- content -->
    <main role="main">

        <!-- page -->
        <div class="content-box" v-html="htmlText"></div>

        <!-- index 그리드 -->
        <div class="content-box" v-if="isIndex">
            <h1>{{ indexTableTitle }}</h1>
            <Table v-bind:header="indexHeader" v-bind:headerMatcher="indexHeader" v-bind:dataList="indexDataList" />
        </div>

    </main>

</div>
</template>


<script setup lang="ts">
import Axios, { AxiosError, type AxiosResponse } from 'axios';
import { ref, type Ref } from 'vue';
import MarkDownIt from 'markdown-it';
//import Mermaid from 'mermaid';
import Hljs from 'highlight.js';
import type { ADMIN_MENU } from '@/custom/customType';
import Table from './Table.vue';
import '../assets/panda-syntax-light.min.css';


const indexTableTitle: string = 'Joplin Menu 데이터';
const indexHeader: string[] = ['MENU_ID', 'MENU_NM', 'PARENT_ID', 'CATEGORY', 'PATH', 'IS_DIR', 'SORT_NO', 'CREATED_AT'];
let indexDataList: Ref<ADMIN_MENU[]> = ref([]);
let isIndex: Ref<boolean> = ref(true);

// md 파일을 html으로 변환하기 위한 객체
const md: MarkDownIt = new MarkDownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    highlight: function (str: string, lang: string): string {
        if (lang && Hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs" code="' + lang + '"><code>' + Hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
            } catch (__) {}
        }

        return '<pre class="hljs" code="' + lang + '"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
let htmlText: Ref<string> = ref('');

// 메뉴 path에 있는 md 파일의 내용을 가져오기
function getHtmlText (path: string): void {
    if (path != null && path != undefined) {
        Axios.get('/joplin/page/r', {params: {pagePath: path}})
            .then((res: AxiosResponse) => {
                let html: string = md.render(res.data);
                htmlText.value = renderMermaid(html);
                getGridData();
            })
            .catch((error: AxiosError) => {
                alert('에러 발생');
            });
    }
    
    if (path == '/index.md') {
        isIndex.value = true;
    }
    else {
        isIndex.value = false;
    }
}

// mermaid를 렌더링 하는 메소드
// 기존 코드를 렌더링된 svg로 대체한다
function renderMermaid (html: string): string {
    // <pre class="hljs" code="mermaid"><code> ~ </code></pre> 사이의 데이터 가져오기 위한 정규 표현식
    const reg: RegExp = /(?<=\<pre class="hljs" code="mermaid"\>\<code\>)(.*?)(?=\<\/code\>\<\/pre\>)/gs;
    const mermaidList: RegExpMatchArray | null = html.match(reg);
    
    if (mermaidList != null) {
        for (let item of mermaidList) {
            const beforeHtml: string = item.replace(/&gt;/gs, '>');
            //const svg: string = Mermaid.render('mermaid', beforeHtml);
            //html = html.replace(item, svg);
        }
    }

    return html;
} 

// 초기 화면 그리드 데이터 가져오기
function getGridData (): void {
    Axios.get('/joplin/menuGrid/r')
        .then((res: AxiosResponse) => {                
            const dataList: ADMIN_MENU[] = res.data;
            indexDataList.value = dataList;
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
        
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