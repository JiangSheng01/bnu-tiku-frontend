import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: null as null | {
      id: number;
      userName: string;
      userAccount: string;
      userRole: string;
      avatarUrl: string;
    },
    showLogin: false,
    selectedKey: "login",
    email: "",
    conversationIds: ["0"],
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    setUserInfo(info: any) {
      this.userInfo = info;
    },

    logout() {
      this.token = "";
      this.userInfo = null;
      localStorage.removeItem("token");
    },
  },
});
