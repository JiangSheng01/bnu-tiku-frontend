import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import router from "@/router";
import { message } from "ant-design-vue";

let afterLoginCallback: null | (() => void) = null;

export const isLoggedIn = () => {
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);
  return !!token.value;
};

// 封装统一校验
export function requireLogin(doAfterLogin?: () => void) {
  const userStore = useUserStore();
  const { showLogin } = storeToRefs(userStore);
  // alert(isLoggedIn());
  if (isLoggedIn()) {
    doAfterLogin && doAfterLogin();
    return true;
  } else {
    message.error("请先登录~");
    showLogin.value = true;
    // 登录组件监听登录成功事件后调用 doAfterLogin
    if (doAfterLogin) afterLoginCallback = doAfterLogin;
    // 可选：支持 Promise
    return false;
  }
}

export function triggerAfterLogin() {
  if (afterLoginCallback) {
    afterLoginCallback();
    afterLoginCallback = null; // 清理，防止重复调用
  }
}
