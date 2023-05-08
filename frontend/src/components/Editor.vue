<template>
<div>
    <ckeditor v-bind:editor="editor" v-model="editorData"></ckeditor>
</div>
</template>


<script lang="ts">
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Editor from '@ckeditor/ckeditor5-vue';

export default {
    components: {
        ckeditor: Editor.component
    },
    props: ['content'],
    data() {
        return {
            editor: ClassicEditor,
            editorData: 'a'
        }
    },
    computed: {
        editorData() {
            console.log(this.content);
            console.log(this.editorData);
        }
    }
}
</script>