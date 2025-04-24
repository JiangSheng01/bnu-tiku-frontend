<script setup lang="ts"></script>

<template>
  <div class="question-bucket-view">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>BNU智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>试题篮</a-breadcrumb-item> </a-breadcrumb
    ><br />
  </div>
  <div class="question-bucket-content">试题篮页</div>
</template>

<style scoped>
.question-bucket-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 810px;
  font-size: 25px;
}
</style>
