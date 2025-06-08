<script setup lang="ts"></script>

<template>
  <div class="home-view">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>首页</a-breadcrumb-item> </a-breadcrumb
    ><br />
  </div>
  <div class="home-content">
    <!--    <img-->
    <!--      src="../assets/front-page-img.png"-->
    <!--      alt=""-->
    <!--      width="1500px"-->
    <!--      height="850px"-->
    <!--      style="border-radius: 14px"-->
    <!--      draggable="false"-->
    <!--    />-->
    欢迎进入智慧题库
  </div>
</template>

<style scoped>
.home-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 25px;
}
</style>
