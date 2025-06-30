import { defineStore } from "pinia";

export const useHeaderViewStore = defineStore("headerView", {
  state: () => ({
    selectedKeys: ["1"],
  }),
});
