<template>
  <div class="upload-view">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>关键词搜题</a-breadcrumb-item> </a-breadcrumb
    ><br />
  </div>
  <div class="knowledge-content">
    <a-row :gutter="[12, 12]" justify="center" style="flex-wrap: nowrap">
      <a-col style="padding-left: 32px; width: 1000px">
        <a-row
          ><div>
            共计 <span style="color: #2877ff">{{ total }}</span> 道试题
          </div></a-row
        >
        <a-row>
          <QuestionFilter @update-filter="receiveLabel" />
        </a-row>
        <a-row :gutter="[12, 12]">
          <QuestionCard
            v-model:all-questions="allQuestions"
            :loading="loading"
            :show-add-to-basket="true"
            :page-type="'keyword'"
          />
        </a-row>
        <a-col
          style="
            display: flex;
            justify-content: center;
            width: 1000px;
            margin-top: 20px;
          "
        >
          <a-pagination
            show-quick-jumper
            v-model:current="currentPageNumber"
            :total="total"
            v-model:page-size="currentPageSize"
            @change="onChange"
            style="margin-bottom: 30px"
        /></a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import QuestionCard from "@/components/QuestionCard.vue";

import { useRoute } from "vue-router";

import { watch } from "vue";

import { ref } from "vue";

import { getQuestionByCombination, QueryParams } from "@/api/question";

import QuestionFilter from "@/components/QuestionFilter.vue";
import { useAllQuestionsStore } from "@/stores/AllQuestions";
import { storeToRefs } from "pinia";
import { useFilterStore } from "@/stores/filter";

const route = useRoute();
const keyword = ref(route.query.kw || "");
const allQuestionsStore = useAllQuestionsStore();
const { allQuestions } = storeToRefs(allQuestionsStore);
const total = ref(0);
let currentPageNumber = ref(1);
let currentPageSize = ref(10);

const combinationLabel = ref<QueryParams>({
  knowledgePointName: "",
  keyword: "",
  difficulty: "all",
  gradeId: -1,
  simpleQuestionType: -1,
  pageNumber: 1,
  pageSize: 10,
});

const searchQuestionsByKeyword = async () => {
  const searchParam = String(keyword.value);
  try {
    combinationLabel.value.keyword = searchParam;
    combinationLabel.value.pageNumber = currentPageNumber.value;
    combinationLabel.value.pageSize = currentPageSize.value;

    const res = await getQuestionByCombination(combinationLabel.value);
    allQuestions.value = res.data.data.questions;
    total.value = res.data.data.totalCount;

    console.log(`📘 查询关键词「${searchParam}」返回结果:`, res.data.data);
  } catch (err) {
    console.error("❌ 查询失败:", err);
  }
};

searchQuestionsByKeyword();

const onChange = async () => {
  await searchQuestionsByKeyword();
};

// 或者监听路由变化
watch(
  () => route.query.kw,
  (newVal: any) => {
    keyword.value = newVal;

    searchQuestionsByKeyword();
  }
);
const filterStore = useFilterStore();
const { selected, label } = storeToRefs(filterStore);
const receiveLabel = async (data: any) => {
  combinationLabel.value.keyword = keyword.value.toString().trim();
  combinationLabel.value.gradeId = data.selected.grade;
  combinationLabel.value.difficulty = data.selected.difficulty;
  combinationLabel.value.simpleQuestionType = data.selected.type;
  label.value.grade = data.selected.grade;
  label.value.difficulty = data.selected.difficulty;
  label.value.type = data.selected.type;
  currentPageSize.value = 10;
  currentPageNumber.value = 1;
  combinationLabel.value.pageNumber = currentPageNumber.value;
  combinationLabel.value.pageSize = currentPageSize.value;

  console.log(combinationLabel.value);

  const res = await getQuestionByCombination(combinationLabel.value);
  allQuestions.value = res.data.data.questions;
  allQuestions.value.map((q) => {
    q.stem = q.stem.replace(/\n/g, "<br>");
    q.question_answer = q.question_answer.replace(/\n/g, "<br>");
    q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
  });
  total.value = res.data.data.totalCount;
  // alert(combinationLabel.value.grade);
  // message.success("**********");
};
</script>

<style scoped>
.upload-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 810px;
  font-size: 25px;
}
</style>
