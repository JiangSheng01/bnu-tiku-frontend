<template>
  <div class="question-bucket">
    <QuestionCard
      v-if="allQuestions.length > 0"
      :all-questions="allQuestions"
      :loading="false"
      :show-add-to-basket="false"
    />
    <div class="basket-content" v-else>试题篮为空，快去挑选试题吧</div>
  </div>
  <div class="basket-footer">
    <div class="basket-info">
      已选 {{ allQuestions.length }} / {{ maxCount }} 道题
    </div>
    <div class="basket-actions">
      <a-button class="clear-button" type="primary" ghost @click="clearAll"
        >清空</a-button
      >
      <a-button
        class="download-word-button"
        type="primary"
        @click="$emit('export', 'word')"
        >导出为 Word</a-button
      >
      <a-button
        class="download-pdf-button"
        type="primary"
        @click="$emit('export', 'pdf')"
        >导出为 PDF</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionCard from "@/components/QuestionCard.vue";
import { computed, ref, toRefs } from "vue";
import { useQuestionBasketStore } from "@/stores/questionBasket";
import { message } from "ant-design-vue";
const maxCount = ref(20);
const { questionBasket } = toRefs(useQuestionBasketStore());
defineEmits(["export"]);
const allQuestions = ref(Array.from(questionBasket.value.values()));
const clearAll = () => {
  questionBasket.value.clear();
  allQuestions.value = [];
  message.success("试题篮已清空");
};
</script>

<style scoped>
.question-bucket {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.basket-footer {
  position: fixed;
  bottom: 0;
  left: 25%;
  right: 25%;
  width: 50%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fafafa;
  border-top: 1px solid #eee;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  border-radius: 10px 10px 0 0;
}

.basket-info {
  font-size: 17px;
  color: #666;
}
.basket-actions a-button + a-button {
  margin-left: 12px;
}
.clear-button {
  margin-right: 20px;
  font-size: 17px;
  height: 40px;
  background-color: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
  box-shadow: none;
}
.clear-button:hover {
  color: #0e0a0a;
}

.download-pdf-button {
  font-size: 17px;
  height: 40px;
  color: #1677ff;
  border-color: #1677ff;
  background-color: white;
  box-shadow: none;
}
.download-pdf-button:hover {
  color: #ffffff;
}

.download-word-button {
  margin-right: 20px;
  font-size: 17px;
  height: 40px;
  box-shadow: none;
}

.download-word-button:hover {
  color: #ffffff;
}
.basket-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 810px;
  font-size: 25px;
}
</style>
