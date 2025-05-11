<template>
  <div class="login-view">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>BNU智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>登录</a-breadcrumb-item> </a-breadcrumb
    ><br />
  </div>
  <div class="login-content"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  font-size: 25px;
}
</style>
