<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Header from './components/HeaderBar.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  display: none;
}
</style>
