<template>
  <a-modal
    v-model:visible="visible"
    title="试题纠错"
    @ok="handleSubmit"
    :footer="null"
    width="700px"
  >
    <div class="divider"></div>
    <div :key="question.question_id">
      <a-radio-group v-model:value="activeTab" style="margin-bottom: 18px">
        <a-radio-button value="stem">题干</a-radio-button>
        <a-radio-button value="answer">答案</a-radio-button>
        <a-radio-button value="explanation">解析</a-radio-button>
        <a-radio-button value="tags">标签</a-radio-button>
      </a-radio-group>
      <div v-if="activeTab === 'stem'" style="margin-bottom: 14px">
        <b>题干内容：</b>
        <div class="divider"></div>
        <div v-katex>{{ question.stem }}</div>
      </div>
      <div v-else-if="activeTab === 'answer'" style="margin-bottom: 14px">
        <b>答案内容：</b>
        <div class="divider"></div>
        <div v-katex>{{ question.question_answer }}</div>
      </div>
      <div v-else-if="activeTab === 'explanation'" style="margin-bottom: 14px">
        <b>解析内容：</b>
        <div class="divider"></div>
        <div v-katex>{{ question.question_explanation }}</div>
      </div>
      <div v-else-if="activeTab === 'tags'" style="margin-bottom: 14px">
        <b>标签：</b>
        <div class="divider"></div>
        <a-tag>来源：{{ question.question_source }}</a-tag>
        <a-tag>年级：{{ question.grade }}</a-tag>
        <a-tag>知识点：{{ question.knowledge_point }}</a-tag>
        <a-tag>题目类型：{{ question.simple_question_type }}</a-tag>
        <a-tag>难度：{{ question.difficulty }}</a-tag>
      </div>
      <a-textarea
        v-model:value="correctionContent"
        placeholder="请输入纠错内容"
        :rows="5"
        style="margin-top: 18px"
      />
      <div style="text-align: right; margin-top: 18px">
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineModel, ref, watchEffect, watch } from "vue";
const visible = defineModel<boolean>("visible", { default: false }); // 由父组件控制显示
const question = defineModel("question", {
  default: {
    stem: "这里是题干内容...",
    question_answer: "这里是答案内容...",
    question_explanation: "这里是解析内容...",
    question_source: "这是来源",
    grade: "这是年级",
    knowledge_point: "这是知识点",
    simple_question_type: "这是题型",
    difficulty: "这是难度",
  },
});
const activeTab = ref("stem");
const correctionContent = ref("");
function handleSubmit() {
  // 这里收集到纠错内容和纠错类型
  const data = {
    type: activeTab.value,
    correction: correctionContent.value,
    questionId: question.value, // 假如你有id
  };
  // 发送接口
  // await api.submitCorrection(data)
  visible.value = false;
  correctionContent.value = "";
}

watchEffect(() => {
  if (visible.value == false) {
    activeTab.value = "stem";
  }
});
</script>

<style scoped>
.divider {
  border-bottom: 1px solid #ededed;
  margin: 12px 0 16px 0;
  width: 100%;
}
</style>
