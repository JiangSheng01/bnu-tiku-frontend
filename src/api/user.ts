import request from "./index";
import { loginParam, registerParam } from "@/types/user";

export function login(data: loginParam) {
  return request.post("/user/login", data);
}

export function register(data: registerParam) {
  return request.post("/user/register", data);
}

export function getCurrentUser() {
  return request.get("/user/me");
}
