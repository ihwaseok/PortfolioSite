<template>
  <div id="app">
    <Header/>
    <div class="wrap">
      <SideMenu/>
      
    </div>
  </div>
</template>

<script>
import Header from './components/Header';
import SideMenu from './components/SideMenu';

export default {
    name: "App",
    components: {
      Header,
      SideMenu
    }
}
</script>

<style scoped>
</style>
