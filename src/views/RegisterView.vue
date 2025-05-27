<script setup lang="ts">
import { ref } from "vue";
</script>

<template>
  <div class="register-view">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>注册</a-breadcrumb-item> </a-breadcrumb
    ><br />
  </div>
  <div class="register-content">注册页</div>
</template>

<style scoped>
.register-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  font-size: 25px;
}
</style>
