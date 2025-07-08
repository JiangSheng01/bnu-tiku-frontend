import axios from "axios";
import { useUserStore } from "@/stores/user"; // 用于错误提示（如果你用的是 antd）

const instance = axios.create({
  // baseURL: "http://localhost:8080/api", // 所有接口都会拼接这个前缀
  baseURL: "http://117.50.218.218:8080/api",
  timeout: 50000,
});

// 请求拦截器：附加 token
instance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  const token = userStore.token;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default instance;
