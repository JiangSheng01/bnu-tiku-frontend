<script setup lang="ts">
import { Bubble } from "ant-design-x-vue";
import { Flex } from "ant-design-vue";
</script>

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
  height: 85vh;
  font-size: 25px;
}
</style>
