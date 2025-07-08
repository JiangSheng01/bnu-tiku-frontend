import { defineStore } from "pinia";

export const useHeaderViewStore = defineStore("headerView", {
  state: () => ({
    selectedKeys: new Array<string>(),
  }),
});
