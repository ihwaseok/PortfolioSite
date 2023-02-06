<template>
    <div class="wrap">
        <div class="sideMenu">
            <li><button v-on:click="test1">test1</button></li>
            <li><button v-on:click="test2">test2</button></li>
        </div>
        <Content v-bind:page="page"/>
    </div>
</template>

<script>
import Content from './Content'

export default {
    components: {
        Content
    },
    data() {
        return {
            page: 'test.html'
        };
    },
    methods: {
        test1: function (event) {

        },
        test2: function (event) {

        }
    }
};
</script>

<style scoped>
.wrap {
  display: flex;
}

.sideMenu {
    flex: 1;
}
</style>