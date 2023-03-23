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
    <button type="button" class="btn btn-primary" v-on:click="save()">저장</button>
    <button type="button" class="btn btn-secondary" style="margin-left: 0.8rem;" v-on:click="cancel()">취소</button>
</div>
</template>


<script setup lang="ts">
import Axios, {type AxiosResponse, type AxiosError} from 'axios';
import Router from '@/router';

let title = '';
let content = '';

function save() {
    let formData = {title: "", content: ""};
    formData.title = title;
    formData.content = content;

    Axios.post('/board/boardList/c', {params: formData})
        .then((res: AxiosResponse) => {
            alert("등록 성공");
            Router.push("/board");
        })
        .catch((error: AxiosError) => {
            alert('에러 발생');
        });
}

function cancel() {
    Router.go(-1);
}

</script>