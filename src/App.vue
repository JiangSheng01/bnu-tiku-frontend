<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <HeaderNavigation />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="footer">
      BNU Tiku Frontend ©2025 Created by ht
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import HeaderNavigation from "@/components/HeaderNavigation.vue";
</script>
<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background-color: white;
}
.content {
  flex: 1; /* 让内容区自动撑开，把footer推到页面底部 */
  background-color: #e6e6e6;
}
.footer {
  text-align: center;
  background-color: #e6e6e6;
  color: black;
}
</style>
