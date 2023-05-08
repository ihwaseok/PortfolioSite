<template>
<div class="content-box">
    <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" id="title" class="form-control" v-model="title">
    </div>
    <div class="mb-3">
        <label for="content" class="form-label">content</label>
        <textarea id="content" class="form-control" rows="3" v-model="content"></textarea>
    </div>
    <button type="button" class="btn btn-primary" v-on:click="update()">수정</button>
    <button type="button" class="btn btn-primary" style="margin-left: 0.8rem;" v-on:click="deleteBoard()">삭제</button>
    <button type="button" class="btn btn-secondary" style="margin-left: 0.8rem;" v-on:click="cancel()">취소</button>

    <Table style="margin-top: 1rem;" v-bind:header="indexHeader" v-bind:headerMatcher="indexHeader" v-bind:dataList="indexDataList" v-bind:rowFunction="rowFunction" />
    <div class="mb-3">
        <label for="comment" class="form-label">comment</label>
        <textarea id="comment" class="form-control" rows="3" v-model="comment"></textarea>
    </div>
    <button type="button" class="btn btn-primary" v-on:click="insertComment()">등록</button>
</div>
</template>


<script setup lang="ts">
import Axios, {type AxiosResponse, type AxiosError} from 'axios';
import { ref, type Ref } from 'vue';
import Router from '@/router';
import { useRoute } from 'vue-router';
import Table from './Table.vue'
import type { ADMIN_COMMENT } from '@/custom/customType';
import Editor from '@/components/Editor.vue';

const router = useRoute();
let title: Ref<string> = ref('');
let content: Ref<string> = ref('');
let comment: Ref<string> = ref('');

const indexHeader: string[] = ['COMMENT_ID', 'CATEGORY', 'BOARD_ID', 'CONTENT', 'CREATED_BY', 'CREATED_AT', 'DELETE_YN'];
let indexDataList: Ref<ADMIN_COMMENT[]> = ref([]);

// 해당 게시글 내용 가져오기
function getData(): void {
    let formData = {id : router.params.id};
    
    Axios.get('/board/detail/r', {params: formData})
        .then((res: AxiosResponse) => {
            title.value = res.data[0].TITLE;
            content.value = res.data[0].CONTENT;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            alert('에러 발생');
        });
}

// 해당 게시글의 댓글 가져오기
function getComment(): void {
    let formData = {id : router.params.id};
    
    Axios.get('/board/detail/comment/r', {params: formData})
        .then((res: AxiosResponse) => {
            indexDataList.value = res.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            alert('에러 발생');
        });
}

// 게시글 수정
function update(): void {
    let formData = {title: '', content: '', id: ''};
    formData.title = title.value;
    formData.content = content.value;
    formData.id = router.params.id.toString();

    Axios.post('/board/detail/u', {params: formData})
        .then((res: AxiosResponse) => {
            alert("수정 성공");
            Router.push("/board");
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
}

// 게시글 삭제
function deleteBoard(): void {
    let formData = {id: ''};
    formData.id = router.params.id.toString();

    Axios.post('/board/detail/d', {params: formData})
        .then((res: AxiosResponse) => {
            alert("삭제 성공");
            Router.push("/board");
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
}

// 취소 이벤트
function cancel() {
    Router.go(-1);
}

// 댓글 삭제
function rowFunction(line: string[]) {
    if (confirm('삭제 하시겠습니까?')) {
        const commentId = line[0];
        let formData = {id: ''};
        formData.id = commentId;

        Axios.post('/board/detail/comment/d', {params: formData})
            .then((res: AxiosResponse) => {
                alert("수정 성공");
                Router.go(0);
            })
            .catch((error: AxiosError) => {
                alert('에러 발생');
            });
    }
}

// 댓글 등록
function insertComment() {
    let formData = {id: '', content: ''};
    formData.id = router.params.id.toString();
    formData.content = comment.value;

    Axios.post('/board/detail/comment/c', {params: formData})
        .then((res: AxiosResponse) => {
            alert("등록 성공");
            Router.go(0);
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
}

getData();
getComment();

</script>