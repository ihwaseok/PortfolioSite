<template>
<div class="container-fluid">

    <!-- content -->
    <main role="main">

        <!-- page -->
        <div class="content-box">
            <div>
                <RouterLink role="button" id="btnWrite" to="/board/write" class="btn btn-primary" style="margin-bottom: 1rem;">글쓰기</RouterLink>
            </div>
            <div class="input-group mb-3" style="width: 20%;">
                <input type="text" id="searchText" v-model="searchText" class="form-control" placeholder="제목 검색">
                <button id="btnSearch" v-bind:onClick="search" class="btn btn-outline-secondary" type="button">검색</button>
            </div>

            <Table v-bind:header="indexHeader" v-bind:headerMatcher="indexHeaderMatcher" v-bind:dataList="indexDataList" v-bind:rowFunction="goDetailPage" />
        </div>
        
    </main>

</div>
</template>


<script setup lang="ts">
import Axios, { AxiosError, type AxiosResponse } from 'axios';
import { ref, type Ref } from 'vue';
import type { ADMIN_BOARD } from '@/custom/customType';
import Table from './Table.vue';
import Router from '@/router';


const indexHeader: string[] = ['분류', 'BOARD_ID', '제목', '내용', 'CREATED_BY', 'CREATED_AT', 'DELETE_YN'];
const indexHeaderMatcher: string[] = ['CATEGORY', 'BOARD_ID', 'TITLE', 'CONTENT', 'CREATED_BY', 'CREATED_AT', 'DELETE_YN'];
let indexDataList: Ref<ADMIN_BOARD[]> = ref([]);
let searchText: string = "";

// 상세 페이지 이동
const goDetailPage: Function = function(line: string[]) {
    Router.push({ path : `/board/detail/${line[1]}` });
};

// 게시판 데이터 리스트 가져오기
function getBoardList (path: string): void {
    Axios.get('/board/boardList/r', {params: {pagePath: path}})
        .then((res: AxiosResponse) => {                
            const dataList: ADMIN_BOARD[] = res.data;
            indexDataList.value = dataList;
        })
        .catch((error: AxiosError) => {
            console.log(error);
            alert('에러 발생');
        });       
}

// 검색
function search (): void {
    Axios.get('/board/boardList/search', {params: {searchText: searchText}})
        .then((res: AxiosResponse) => {                
            const dataList: ADMIN_BOARD[] = res.data;
            indexDataList.value = dataList;
        })
        .catch((error: AxiosError) => {
            console.log(error);
            alert('에러 발생');
        });
}

getBoardList('all');
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