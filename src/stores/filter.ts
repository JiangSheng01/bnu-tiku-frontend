import { defineStore } from "pinia";
import { reactive } from "vue";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    selected: reactive<Record<string, any>>({
      grade: "全部",
      type: "全部",
      difficulty: "全部",
    }),
    label: reactive<Record<string, any>>({
      grade: -1,
      type: -1,
      difficulty: "all",
    }),
  }),
});
