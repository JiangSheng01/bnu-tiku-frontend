<script setup lang="ts">
import {
  CloudTwoTone,
  ContainerTwoTone,
  CrownTwoTone,
  HomeTwoTone,
  ShoppingTwoTone,
  SmileTwoTone,
} from "@ant-design/icons-vue";
</script>

<template>
  <a-row type="flex" align="middle">
    <a-col
      flex="120px"
      style="font-size: 18px; display: flex; align-items: center"
    >
      <router-link to="/">BNU智慧题库</router-link>
    </a-col>

    <a-col flex="300px" style="display: flex; align-items: center">
      <a-menu
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
        :style="{ lineHeight: '63px', marginLeft: '10px' }"
      >
        <a-menu-item key="1" class="custom-menu-item">
          <template #icon>
            <HomeTwoTone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/">首页</router-link></span
          >
        </a-menu-item>
        <a-menu-item key="2" class="custom-menu-item">
          <template #icon>
            <ContainerTwoTone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/search/question/by/kp"
              >知识点选题</router-link
            ></span
          >
        </a-menu-item>
        <a-menu-item key="3" class="custom-menu-item">
          <template #icon>
            <CloudTwoTone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/upload/question">上传习题</router-link></span
          >
        </a-menu-item>
      </a-menu>
    </a-col>

    <a-col
      flex="auto"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1px;
      "
    >
      <a-input-search
        v-model:value="value"
        placeholder="输入关键词搜题"
        enter-button="搜索"
        @search="onSearch"
        size="large"
        style="width: 600px"
      />
    </a-col>

    <a-col
      flex="100px"
      style="display: flex; align-items: center; justify-content: flex-end"
    >
      <a-menu
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
        :style="{ lineHeight: '63px' }"
      >
        <a-menu-item key="1" class="custom-menu-item">
          <template #icon>
            <ShoppingTwoTone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/question/bucket">试题篮</router-link></span
          >
        </a-menu-item>
        <a-menu-item key="2" class="custom-menu-item">
          <template #icon>
            <SmileTwoTone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/login">登录</router-link></span
          >
        </a-menu-item>
        <a-menu-item key="3" class="custom-menu-item">
          <template #icon>
            <crown-two-tone style="font-size: 16px; margin-right: 1px" />
          </template>
          <span class="custom-text"
            ><router-link to="/register">注册</router-link></span
          >
        </a-menu-item>
      </a-menu>
    </a-col>
  </a-row>
</template>

<style scoped>
.custom-menu-item {
  font-size: 16px;
}
.custom-text {
  font-size: 16px;
}
</style>
