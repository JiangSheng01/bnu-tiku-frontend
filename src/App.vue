<template>
  <div class="scroll-wrapper">
    <div class="main-content">
      <a-layout class="layout">
        <a-layout-header class="header">
          <HeaderNavigation />
        </a-layout-header>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
        <!--        <a-layout-footer v-if="route.name == 'Home'">-->
        <!--          BNU Tiku Frontend ©2025 Created by ht-->
        <!--          &lt;!&ndash;      <a href="https://github.com/Colentine/bnu-tiku-frontend"&ndash;&gt;-->
        <!--          &lt;!&ndash;        ><GithubOutlined&ndash;&gt;-->
        <!--          &lt;!&ndash;      /></a>&ndash;&gt;-->
        <!--        </a-layout-footer>-->
        <!--        <a-layout-footer v-else class="footer">-->
        <!--          BNU Tiku Frontend ©2025 Created by ht-->
        <!--          &lt;!&ndash;      <a href="https://github.com/Colentine/bnu-tiku-frontend"&ndash;&gt;-->
        <!--          &lt;!&ndash;        ><GithubOutlined&ndash;&gt;-->
        <!--          &lt;!&ndash;      /></a>&ndash;&gt;-->
        <!--        </a-layout-footer>-->
      </a-layout>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderNavigation from "@/components/HeaderNavigation.vue";
import { GithubOutlined } from "@ant-design/icons-vue";
import { syncUserFromServer } from "@/api/user";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
// const route = useRoute();
// alert(typeof route.name);
</script>
<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background-color: white;
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
}
.content {
  margin-top: 60px;
  flex: 1; /* 让内容区自动撑开，把footer推到页面底部 */
  background-color: #e6e6e6;
}
.absolute-footer {
  text-align: center;
  background-color: #e6e6e6;
  color: black;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.footer {
  text-align: center;
  background-color: #e6e6e6;
  color: black;
}
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: auto; /* 关键：出现横向滚动条 */
  overflow-y: auto; /* 纵向由内部布局自己滚 */
}
</style>
