<template>
  <div id="app">
    <Header/>
    <div>
      <JoplinPage/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header';
import JoplinPage from './components/JoplinPage';

export default {
    name: "App",
    components: {
      Header,
      JoplinPage
    }
}
</script>

<style scoped>
</style>
