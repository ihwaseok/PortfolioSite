<template>
    <div class="loading-spinner" v-if="props.isLoading">
        <div class="spinner-border text-primary spinner" role="status"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isLoading: boolean;
}>()

</script>

<style scoped>
.loading-spinner {
    position: fixed;
    width: 100%; 
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5); 
    z-index: 2; 
}
.spinner {
    width: 200px;
    height: 200px;
    margin-top:20%; 
    margin-left:45%;
}
</style>