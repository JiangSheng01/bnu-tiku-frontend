import request from "./index";
import { loginParam, registerParam } from "@/types/user";
import { useUserStore } from "@/stores/user";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";

export function login(data: loginParam) {
  return request.post("/user/login", data);
}

export function register(data: registerParam) {
  return request.post("/user/register", data);
}

export function getCurrentUser() {
  return request.get("/user/me");
}

export async function syncUserFromServer() {
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);

  if (token.value.length == 0) {
    return false;
  }

  try {
    const res = await request.get("/user/current");
    userStore.setUserInfo(res.data.data.userInfo);
    return true;
  } catch (error) {
    // token 无效或 Redis 过期
    message.error("登录状态已失效，请重新登录");
    userStore.logout();
    return false;
  }
}
