<template>
<div class="sticky-top header-bg-white">
    <header class="d-flex flex-wrap justify-content-center py-3">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
        <span class="fs-4">Simple header</span>
        </a>

        <ul class="nav nav-pills">
        <li class="nav-item"><a href="#" class="nav-link active" aria-current="page">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Pricing</a></li>
        <li class="nav-item"><a href="#" class="nav-link">FAQs</a></li>
        <li class="nav-item"><a href="#" class="nav-link">About</a></li>
        </ul>
    </header>
</div>
</template>


<script setup lang="ts">
</script>


<style scoped>
.header-bg-white {
    background-color: #9bc3fe;
}
</style>