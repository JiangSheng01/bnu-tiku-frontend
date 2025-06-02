import request from "@/api/index";

export function getKp(keyword: string) {
  return request.get(`/kp/search/${encodeURIComponent(keyword)}`);
}
