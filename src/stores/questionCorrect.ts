import { defineStore } from "pinia";

export const useQuestionCorrectStore = defineStore("questionCorrect", {
  state: () => ({
    correctShow: false,
    clickedQuestionId: 0,
    clickedQuestion: {
      question_id: 1,
      stem: "这里是题干内容...",
      question_answer: "这里是答案内容...",
      question_explanation: "这里是解析内容...",
      question_source: "这是来源",
      grade: "这是年级",
      knowledge_point: "这是知识点",
      simple_question_type: 1,
      difficulty: 1,
    },
  }),
});
