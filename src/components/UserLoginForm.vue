<template>
  <a-input
    style="
      border-bottom: 0;
      box-shadow: none;
      height: 40px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-color: #d8d8d8;
    "
    v-model:value="userName"
    placeholder="请输入用户名"
  >
    <template #prefix
      ><span style="margin-right: 8px; margin-left: 8px">名称</span></template
    >
  </a-input>
  <a-input
    v-model:value="userPassword"
    :type="showPassword ? 'text' : 'password'"
    placeholder="请输入密码"
    style="
      box-shadow: none;
      height: 40px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-color: #d8d8d8;
    "
  >
    <template #prefix
      ><span style="margin-right: 8px; margin-left: 8px">密码</span></template
    >
    <template #suffix>
      <span @click="toggle" style="cursor: pointer; color: #1890ff">
        <EyeOutlined v-if="showPassword" />
        <EyeInvisibleOutlined v-else />
      </span>
      <span>忘记密码？</span>
    </template>
  </a-input>
  <a-row style="margin-top: 20px">
    <a-col style="width: 48%"
      ><a-button style="width: 100%; height: 40px" @click="toRegister"
        >去注册</a-button
      ></a-col
    >
    <a-col style="flex: 1"></a-col>
    <a-col style="width: 48%"
      ><a-button
        type="primary"
        @click="onLogin"
        x
        style="width: 100%; height: 40px"
        ><div v-if="!isLogin">登录</div>
        <div v-else><LoadingOutlined /></div> </a-button
    ></a-col>
  </a-row>
</template>

<script setup lang="ts">
import { LoadingOutlined } from "@ant-design/icons-vue";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { login } from "@/api/user";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user";
import { triggerAfterLogin } from "@/api/auth";
import { useRoute, useRouter } from "vue-router";
const showPassword = ref(false);
const toggle = () => (showPassword.value = !showPassword.value);
const userName = ref("");
const userPassword = ref("");
const userStore = useUserStore();
const isLogin = ref(false);
const emit = defineEmits(["sendVisible", "changeToRegister"]);
const router = useRouter();
const route = useRoute();
const toRegister = () => {
  emit("changeToRegister", { key: "register" });
};

async function onLogin() {
  isLogin.value = true;
  console.log("登录信息：", userName, userPassword);
  const res = await login({
    userName: userName.value,
    userPassword: userPassword.value,
  });

  if (!(res.data.code == "SUCCESS")) {
    message.error("登录失败！");
    isLogin.value = false;
    return;
  }

  isLogin.value = true;
  userStore.setUserInfo(res.data.data.userInfo);
  userStore.setToken(res.data.data.token);
  message.success("登录成功");
  console.log(userStore.userInfo);
  const redirect = (route.query.redirect as string) || "/";
  await router.replace(redirect);
  triggerAfterLogin();
  emit("sendVisible", { visible: false });
  // 在此处添加登录逻辑
}
</script>
