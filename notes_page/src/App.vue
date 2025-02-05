<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="app">
    <Header />
    <router-view />
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
