<template>
  <a-row type="flex" align="middle" style="flex-wrap: nowrap">
    <a-col
      flex="240px"
      style="font-size: 18px; display: flex; align-items: center"
    >
      <router-link to="/"
        ><img src="../assets/hsaBNU.png" width="40px" draggable="false" />
        北京师大附中智慧题库</router-link
      >
      <!--      <router-link to="/"-->
      <!--        ><img src="../assets/bnu.png" width="40px" style="margin-right: 5px" />-->
      <!--        北师大智慧题库</router-link-->
      <!--      >-->
    </a-col>

    <a-col flex="100px" style="display: flex; align-items: center">
      <a-menu
        mode="horizontal"
        v-model:selectedKeys="selectedLeftKeys"
        @click="onLeftMenuClick"
        :style="{ lineHeight: '63px', marginLeft: '10px' }"
      >
        <a-menu-item key="1" class="custom-menu-item">
          <!--          <template #icon>-->
          <!--            <HomeTwoTone style="font-size: 16px; margin-right: 1px" />-->
          <!--          </template>-->
          <span class="custom-text"
            ><router-link to="/">首页</router-link></span
          >
        </a-menu-item>
        <a-menu-item key="2" class="custom-menu-item">
          <!--          <template #icon>-->
          <!--            <ContainerTwoTone style="font-size: 16px; margin-right: 1px" />-->
          <!--          </template>-->
          <span class="custom-text"
            ><router-link to="/search/question/by/kp"
              >知识点选题</router-link
            ></span
          >
        </a-menu-item>
        <!--        <a-menu-item key="3" class="custom-menu-item">-->
        <!--          <template #icon>-->
        <!--            <CloudTwoTone style="font-size: 16px; margin-right: 1px" />-->
        <!--          </template>-->
        <!--          <span class="custom-text"-->
        <!--            ><router-link to="/upload/question">上传习题</router-link></span-->
        <!--          >-->
        <!--        </a-menu-item>-->
      </a-menu>
    </a-col>

    <a-col
      flex="1 1 auto"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1px;
      "
    >
      <a-input-search
        v-model:value="keyword"
        placeholder="输入关键词搜题"
        @search="onSearchQuestion"
        size="large"
        style="width: 35%; min-width: 260px"
      >
        <template #enterButton>搜索</template>
      </a-input-search>
    </a-col>

    <a-col flex="0 0 160px">
      <a-row>
        <a-col style="width: 60%">
          <div style="width: 100%" class="custom-text">
            <a @click="chatShow" style="margin-right: 12px">✨ AI搜题</a>
            <!--            <a style="margin-right: 12px">✨ AI搜题</a>-->
          </div>
          <ChatModal v-model:visible="showChat" />
        </a-col>
        <a-col style="width: 40%">
          <div style="width: 100%" class="custom-text">
            <!--            <shopping-two-tone style="margin-right: 6px" />-->
            <router-link to="/question/bucket">试题篮</router-link>
          </div>
        </a-col>
        <!--        <a-col style="width: 80px" v-if="token.length == 0">-->
        <!--          <div style="width: 100%" class="custom-text">-->
        <!--            <SmileTwoTone />-->
        <!--            <a @click="loginShow" style="margin-left: 6px">登录</a>-->
        <!--          </div>-->
        <!--          <UserModal v-model:visible="showLogin" />-->
        <!--        </a-col>-->
        <a-col
          v-if="token.length != 0"
          style="
            display: flex;
            align-items: center;
            justify-content: right;
            width: 80px;
          "
        >
          <a-dropdown placement="bottomCenter">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="profile">个人简介</a-menu-item>
                <a-menu-item key="settings">设置</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
            <a-avatar
              style="cursor: pointer; background-color: #87d068"
              icon="user"
              @click="showUserInfo"
            />
          </a-dropdown>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import {
  CloudTwoTone,
  ContainerTwoTone,
  HomeTwoTone,
  ShoppingTwoTone,
  SmileTwoTone,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import UserModal from "@/components/UserModal.vue";
import ChatModal from "@/components/ChatModal.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { token, userInfo } = storeToRefs(userStore);
const showLogin = ref(false);
const showChat = ref(false);
const router = useRouter();
const keyword = ref("");
const loginShow = () => {
  showLogin.value = true;
};

const chatShow = () => {
  showChat.value = true;
};

const showUserInfo = () => {
  console.log(token.value);
  if (userInfo.value != null) {
    console.log(userInfo.value);
  }
};

function onSearchQuestion() {
  // alert(keyword.value.trim());
  router.push({
    path: "/search/question/by/keyword",
    query: { kw: keyword.value.trim() },
  });
  keyword.value = "";
}
const logout = () => {
  userStore.logout();
};
</script>

<style scoped>
.custom-menu-item {
  font-size: 16px;
}
.custom-text {
  text-align: right;
  font-size: 16px;
}
</style>

<style>
.ant-menu-light.ant-menu-horizontal > .ant-menu-item:hover::after,
.ant-menu-light.ant-menu-horizontal > .ant-menu-submenu:hover::after,
.ant-menu-light.ant-menu-horizontal > .ant-menu-item-active::after,
.ant-menu-light.ant-menu-horizontal > .ant-menu-submenu-active::after,
.ant-menu-light.ant-menu-horizontal > .ant-menu-item-open::after,
.ant-menu-light.ant-menu-horizontal > .ant-menu-submenu-open::after {
  border-bottom-width: 2px;
  border-bottom-color: #1677ff;
}
</style>
