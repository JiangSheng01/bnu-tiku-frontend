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
    v-model:value="userRegisterName"
    placeholder="请输入用户名"
    loading
  >
    <template #prefix
      ><span style="margin-right: 8px; margin-left: 8px">名称</span></template
    >
    <template #suffix
      ><LoadingOutlined v-if="isNameTyping" style="color: #6fc6ed" />
      <CheckOutlined
        v-if="hasNameChecked && isNameValid"
        style="color: #6fc6ed" />
      <CloseOutlined v-if="hasNameChecked && !isNameValid" style="color: red"
    /></template>
  </a-input>
  <a-input
    style="
      border-bottom: 0;
      box-shadow: none;
      height: 40px;
      border-radius: 0;
      border-color: #d8d8d8;
    "
    v-model:value="email"
    placeholder="请输入邮箱"
  >
    <template #prefix
      ><span style="margin-right: 8px; margin-left: 8px">邮箱</span></template
    >
    <template #suffix
      ><LoadingOutlined v-if="isEmailTyping" style="color: #6fc6ed" />
      <CheckOutlined
        v-if="hasEmailChecked && isEmailValid"
        style="color: #6fc6ed" />
      <CloseOutlined v-if="hasEmailChecked && !isEmailValid" style="color: red"
    /></template>
  </a-input>
  <a-input
    v-model:value="userRegisterPassword"
    placeholder="请输入密码"
    type="password"
    style="
      box-shadow: none;
      height: 40px;
      border-color: #d8d8d8;
      border-radius: 0;
      border-bottom: none;
    "
  >
    <template #prefix
      ><span style="margin-right: 8px; margin-left: 8px">密码</span></template
    >
    <template #suffix
      ><LoadingOutlined v-if="isPasswordTyping" style="color: #6fc6ed" />
      <CheckOutlined
        v-if="hasPasswordChecked && isPasswordValid"
        style="color: #6fc6ed" />
      <CloseOutlined
        v-if="hasPasswordChecked && !isPasswordValid"
        style="color: red"
    /></template>
  </a-input>
  <a-input
    v-model:value="checkPassword"
    type="password"
    placeholder="请再次输入密码"
    style="
      box-shadow: none;
      height: 40px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-color: #d8d8d8;
      margin-bottom: 10px;
    "
  >
    <template #prefix
      ><span style="margin-left: 8px; margin-right: 8px">确认</span></template
    >
    <template #suffix
      ><LoadingOutlined v-if="isCheckPasswordTyping" style="color: #6fc6ed" />
      <CheckOutlined
        v-if="hasCheckPasswordChecked && isCheckPasswordValid"
        style="color: #6fc6ed" />
      <CloseOutlined
        v-if="hasCheckPasswordChecked && !isCheckPasswordValid"
        style="color: red"
    /></template>
  </a-input>
  <a-row>
    <div v-if="hasNameChecked && !isNameValid" style="color: #afafaf">
      昵称格式不合法，需为2~16位中英文/数字/下划线
    </div>
    <div v-else-if="hasEmailChecked && !isEmailValid" style="color: #afafaf">
      邮箱格式不正确
    </div>
    <div
      v-else-if="hasPasswordChecked && !isPasswordValid"
      style="color: #afafaf"
    >
      密码应为6-20位数字和字母组合
    </div>
    <div
      v-else-if="hasCheckPasswordChecked && !isCheckPasswordValid"
      style="color: #afafaf"
    >
      两次密码输入不一致
    </div>
  </a-row>
  <a-row style="margin-top: 10px">
    <a-col style="width: 48%"
      ><a-button @click="toLogin" style="width: 100%; height: 40px"
        >去登录</a-button
      ></a-col
    >
    <a-col style="flex: 1"></a-col>
    <a-col style="width: 48%"
      ><a-button
        type="primary"
        style="width: 100%; height: 40px"
        @click="onRegister"
        >注册</a-button
      ></a-col
    >
  </a-row>
</template>

<script setup lang="ts">
import {
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { ref, watch, computed } from "vue";
import { debounce } from "lodash";
import { message } from "ant-design-vue";
import { register } from "@/api/user";
const userRegisterName = ref<string>("");
const userRegisterPassword = ref("");
const email = ref("");
const checkPassword = ref("");

const isNameTyping = ref(false);
const isNameValid = ref(false);
const hasNameChecked = ref(false);

const isEmailTyping = ref(false);
const isEmailValid = ref(false);
const hasEmailChecked = ref(false);

const isPasswordTyping = ref(false);
const isPasswordValid = ref(false);
const hasPasswordChecked = ref(false);

const isCheckPasswordTyping = ref(false);
const isCheckPasswordValid = ref(false);
const hasCheckPasswordChecked = ref(false);

const isRegister = ref(false);
async function onRegister() {
  isRegister.value = true;
  if (!allValid.value) {
    message.error("存在错误的注册名称、密码、邮箱等，请检查");
    isRegister.value = false;
    return;
  }

  const res = await register({
    userName: userRegisterName.value,
    userPassword: userRegisterPassword.value,
    email: email.value,
    checkPassword: checkPassword.value,
  });

  if (!(res.data.code == "SUCCESS")) {
    message.error("注册失败！");
    isRegister.value = false;
    return;
  }
  message.success(res.data.message);
  isRegister.value = false;
  emit("changeToLogin", { key: "login" });
  // 在此处添加登录逻辑
}

const emit = defineEmits(["changeToLogin"]);

const toLogin = () => {
  emit("changeToLogin", { key: "login" });
};

const checkName = (name: string) => {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/;
  return reg.test(name);
};

const checkEmail = (email: string) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg.test(email);
};

const checkingPassword = (password: string) => {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
  return reg.test(password);
};

const checkingCheckPassword = (checkpasswod: string) => {
  return checkpasswod === userRegisterPassword.value && !!checkpasswod;
};

watch(userRegisterName, () => {
  isNameTyping.value = true;
  hasNameChecked.value = false;
  onNameInput();
});

watch(email, () => {
  isEmailTyping.value = true;
  hasEmailChecked.value = false;
  onEmailInput();
});

watch(userRegisterPassword, () => {
  isPasswordTyping.value = true;
  hasPasswordChecked.value = false;
  onPasswordInput();
});

watch(checkPassword, () => {
  isCheckPasswordTyping.value = true;
  hasCheckPasswordChecked.value = false;
  onCheckPasswordInput();
});

const onNameInput = debounce(() => {
  isNameValid.value = checkName(userRegisterName.value);
  isNameTyping.value = false;
  hasNameChecked.value = true;
}, 1200);

const onEmailInput = debounce(() => {
  isEmailValid.value = checkEmail(email.value);
  isEmailTyping.value = false;
  hasEmailChecked.value = true;
}, 1200);

const onPasswordInput = debounce(() => {
  isPasswordValid.value = checkingPassword(userRegisterPassword.value);
  isPasswordTyping.value = false;
  hasPasswordChecked.value = true;
}, 1200);

const onCheckPasswordInput = debounce(() => {
  isCheckPasswordValid.value = checkingCheckPassword(checkPassword.value);
  isCheckPasswordTyping.value = false;
  hasCheckPasswordChecked.value = true;
}, 1200);

const allValid = computed(() => {
  return (
    isNameValid.value &&
    isEmailValid.value &&
    isPasswordValid.value &&
    isPasswordValid.value
  );
});
</script>
