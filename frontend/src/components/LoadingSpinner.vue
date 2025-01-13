<template>
    <div class="loading-spinner" v-if="props.isSpinning">
        <div class="spinner-border text-primary spinner" role="status">
            <v-progress-circular color="primary" indeterminate :size="61" :width="5"></v-progress-circular>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isSpinning: boolean;
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
    z-index: 2; 
}
.spinner {
    width: 200px;
    height: 200px;
    margin-top:20%; 
    margin-left:45%;
    display:flex;
    justify-content: center;
}
</style>