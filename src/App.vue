<template>
  <a-layout>
    <a-layout-header class="header">
      <HeaderNavigation />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
    <a-layout-footer
      style="text-align: center; background-color: #e6e6e6; color: black"
    >
      BNU Tiku Frontend ©2025 Created by ht
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import HeaderNavigation from "@/components/HeaderNavigation.vue";
</script>
<style scoped>
.header {
  background-color: white;
}
.content {
  max-height: 4000px;
  background-color: #e6e6e6;
}
</style>
