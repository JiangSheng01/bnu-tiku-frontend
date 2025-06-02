import { defineStore } from "pinia";

export const useQuestionBasketStore = defineStore("questionBasket", {
  state: () => ({
    questionBasket: new Map<number, any>(),
  }),
});
