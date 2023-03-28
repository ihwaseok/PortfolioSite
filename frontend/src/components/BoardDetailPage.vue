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
</div>
</template>


<script setup lang="ts">
import Axios, {type AxiosResponse, type AxiosError} from 'axios';
import { ref, type Ref } from 'vue';
import Router from '@/router';
import { useRoute } from 'vue-router';

const router = useRoute();
let title: Ref<string> = ref('');
let content: Ref<string> = ref('');

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

function cancel() {
    Router.go(-1);
}

getData();

</script>