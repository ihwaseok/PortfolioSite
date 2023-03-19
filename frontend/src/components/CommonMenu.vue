<template>
<div class="d-flex wrapper wrapper-navbar-used wrapper-navbar-fixed">
    
    <!-- Sub Menu -->
    <nav role="navigation" id="navigation" class="sidebar sidebar-rounded-top-right">

        <!-- sidebar -->
        <div class="sidebar-menu">

            <!-- menu fixed -->
            <div class="sidebar-menu-fixed sidebar-bg-blue">

                <!-- menu scrollbar -->
                <div class="scrollbar scrollbar-use-navbar sub-side">

                    <!-- menu -->
                    <ul class="list list-unstyled mb-0">

                        <CommonMenuList/>

                    </ul>

                </div>

            </div>

        </div>

    </nav>

</div>
</template>


<script setup lang="ts">
import CommonMenuList from './CommonMenuList.vue';

</script>


<style scoped>
.wrapper {
    min-height: 100vh;
}
.wrapper-navbar-used {
    min-height: calc(100vh - 3.5rem);
}
.wrapper-navbar-fixed {
    margin-top: 0rem;
}
.sidebar {
    margin-left: -14.375rem;
    transition: margin 0.15s ease-out;
}
@media (min-width: 768px) {
    .sidebar {
    margin-left: 0;
    }
}
.sidebar-rounded-top-right {
    border-top-right-radius: 0.25rem;
}
.sidebar-menu {
    width: 14.375rem;
}
.sidebar-menu-fixed {
    position: fixed;
}
.sidebar-bg-light {
    background-color: #f8f9fa;
}
.sidebar-bg-blue {
    background-color: #9bc3fe;
}
.scrollbar {
    width: 14.375rem;
    overflow: hidden;
    position: relative;
}
.scrollbar-use-navbar {
    height: calc(100vh - 3.5rem);
}
.list {
    width: 14.375rem;
    font-size: 0.875rem;
    margin-left: 0rem;
}
.recursive-side {
    background-color: #ACCEE5;
    border: 1px solid black;
}
.sub-side {
    background-color: #BFE4FF;
    border: 1px solid black
}
</style>