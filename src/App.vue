<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view style="margin-top: 70px"></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar";
export default {
  name: 'App',
  components: {NavBar}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
