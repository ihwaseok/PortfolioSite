<template>
    <div>
        <div>Content</div>
        <div v-html="compiledHtml"></div>
    </div>
</template>

<script>
export default {
    props: {
        page: String
    },
    data() {
        return {
            compiledHtml: ''
        }
    },
    created() {
        console.log(this.page);
        
        this.$http.get("/joplin/page/r", {params: {page: this.page}})
        .then((response) => {
            this.compiledHtml = response.data;
        });
    }
};
</script>

<style scoped>
div {
    flex: 3;
}
</style>