<template>
  <!-- Banner 根容器，整块横向居中 -->
  <section class="banner-wrapper">
    <!-- 玻璃拟态盒子：居中展示 logo 与搜索框 -->
    <div class="glass-box">
      <!-- Logo + 品牌名 -->
      <div class="logo-block">
        <!-- 建议把 /logo.png 换成实际校徽或系统 logo -->
        <img src="../assets/hsaBNU.png" alt="Neo Logo" class="logo-img" />
        <span class="logo-text">智慧题库</span>
      </div>

      <!-- 大号关键词搜索 -->
      <a-input-search
        v-model:value="query"
        placeholder="请输入关键词搜题"
        size="large"
        enter-button="搜索"
        class="search-input"
        @search="onSearch"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 搜索框绑定值
const query = ref("");

// 提交搜索
function onSearch(value: string) {
  // TODO: 在此处调用接口或路由跳转
  console.log("搜索关键词 =>", value);
}
</script>

<style scoped>
/* 整体 Banner 背景（可根据主题改颜色 / 图片）*/
.banner-wrapper {
  width: 100%;
  padding: 5rem 1rem; /* 上下留白 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3e348f 0%, #7453d3 100%);
}

/* 玻璃拟态盒子 */
.glass-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem; /* logo 与搜索框间距 */

  width: 100%;
  max-width: 960px;
  padding: 3.5rem 2.75rem;

  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
}

/* Logo 区 */
.logo-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.logo-img {
  height: 48px;
  width: auto;
}
.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.03em;
}

/* 搜索框微调：加大字号、更好看 */
.search-input .ant-input {
  height: 56px;
  font-size: 1.15rem;
}
.search-input .ant-input-group-addon .ant-btn {
  height: 56px;
  font-size: 1.15rem;
  padding: 0 2rem;
}
</style>
