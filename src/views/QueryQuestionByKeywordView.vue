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
import {
  getQuestionByCombination,
  getQuestionsByKeyword,
  QueryParams,
} from "@/api/question";
import QuestionFilter from "@/components/QuestionFilter.vue";
const route = useRoute();
const keyword = ref(route.query.kw || "");
const allQuestions = ref([]);
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
  const searchParam = keyword.value.toString().trim();
  try {
    combinationLabel.value.keyword = searchParam;
    combinationLabel.value.pageNumber = currentPageNumber.value;
    combinationLabel.value.pageSize = currentPageSize.value;
    const res = await getQuestionByCombination(combinationLabel.value);
    allQuestions.value = res.data.questions;
    total.value = res.data.totalCount;
    console.log(`📘 查询关键词「${searchParam}」返回结果:`, res.data);
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
const receiveLabel = async (data: any) => {
  combinationLabel.value.keyword = keyword.value.toString().trim();
  combinationLabel.value.gradeId = data.selected.grade;
  combinationLabel.value.difficulty = data.selected.difficulty;
  combinationLabel.value.simpleQuestionType = data.selected.type;
  combinationLabel.value.pageNumber = currentPageNumber.value;
  combinationLabel.value.pageSize = currentPageSize.value;
  console.log(combinationLabel.value);

  const res = await getQuestionByCombination(combinationLabel.value);

  allQuestions.value = res.data.questions;
  total.value = res.data.totalCount;
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
