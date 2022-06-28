<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>
<template>
  <div class="wrapper">
    <nav class="routerNav">
      <RouterLink to="/">Option</RouterLink>
      <RouterLink to="/about">Option Template</RouterLink>
      <RouterLink to="/dev">Settings</RouterLink>
      <RouterLink to="/products">Customize Style</RouterLink>
      <RouterLink to="/products">Text Localization</RouterLink>
      <RouterLink to="/products">Plans</RouterLink>
      <RouterLink to="/products">FAQ</RouterLink>
      <RouterLink to="/products">Currency</RouterLink>
      <RouterLink to="/products">Instalation</RouterLink>
      <RouterLink to="/products">Changelog</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
    .routerNav {
        display: flex;
        flex-direction: column;
    }
    .router-link-active
     {
        color:#fff!important;
    }
</style>