<template>
  <div class="all-content">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>知识点选题</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="knowledge-content">
      <a-row :gutter="[12, 12]" justify="center" style="flex-wrap: nowrap">
        <a-col style="width: 300px">
          <KnowledgePointTree @send="receiveData" />
        </a-col>
        <a-col style="padding-left: 32px; width: 1000px">
          <a-row
            ><a-col flex="120px">
              共计 <span style="color: #2877ff">{{ total }}</span> 道试题
            </a-col>
            <a-col flex="1" />
            <a-col flex="1">
              <div style="text-align: right" v-if="selectedKp != 'beforeMount'">
                正在搜索的知识点：<span style="color: #2877ff">{{
                  selectedKp
                }}</span>
              </div>
              <div style="text-align: right" v-else>
                正在搜索的知识点：<span style="color: #2877ff"> 全部 </span>
              </div></a-col
            >
          </a-row>
          <a-row>
            <QuestionFilter @update-filter="receiveLabel" />
          </a-row>
          <a-row :gutter="[12, 12]">
            <QuestionCard
              :all-questions="allQuestions"
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
  </div>
</template>
<script setup lang="ts">
import KnowledgePointTree from "@/components/KnowledgePointTree.vue";
import { onMounted, ref } from "vue";

import axios from "axios";
import QuestionCard from "@/components/QuestionCard.vue";
import {
  getQuestionByCombination,
  getQuestionsByKp,
  QueryParams,
} from "@/api/question";
import QuestionFilter from "@/components/QuestionFilter.vue";
import BasketButton from "@/components/BasketButton.vue";
import { message } from "ant-design-vue";
const allQuestions = ref([]);
const currentPageNumber = ref<number>(1);
const currentPageSize = ref<number>(10);
const selectedKp = ref("beforeMount");
const combinationLabel = ref<QueryParams>({
  knowledgePointName: "",
  keyword: "",
  difficulty: "all",
  gradeId: -1,
  simpleQuestionType: -1,
  pageNumber: 1,
  pageSize: 10,
});
const total = ref(0);
const loading = ref(true);

// 模拟“加入试题篮”操作

onMounted(() => {
  const res = getQuestionByCombination(combinationLabel.value)
    .then((res) => {
      allQuestions.value = res.data.questions;
      total.value = res.data.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
});

const receiveData = (data: any) => {
  if (data.resultData != null && data.selectedKey != null) {
    allQuestions.value = data.resultData.questions;
    selectedKp.value = data.selectedKey;
    total.value = data.resultData.totalCount;
  }
  loading.value = data.loading;
};

const receiveLabel = async (data: any) => {
  loading.value = true;
  combinationLabel.value.knowledgePointName = selectedKp.value;
  combinationLabel.value.gradeId = data.selected.grade;
  combinationLabel.value.difficulty = data.selected.difficulty;
  combinationLabel.value.simpleQuestionType = data.selected.type;
  combinationLabel.value.pageNumber = currentPageNumber.value;
  combinationLabel.value.pageSize = currentPageSize.value;
  console.log(combinationLabel.value);

  const res = await getQuestionByCombination(combinationLabel.value);

  allQuestions.value = res.data.questions;
  total.value = res.data.totalCount;
  loading.value = false;
  // alert(combinationLabel.value.grade);
  // message.success("**********");
};

// const onChange = async (pageNumber: number) => {
//   loading.value = true;
//   const res = await getQuestionsByKp(
//     selectedKp.value,
//     pageNumber.toString(),
//     currentPageSize.value.toString()
//   );
//   allQuestions.value = res.data.questions;
//   total.value = res.data.totalCount;
//   loading.value = false;
//   console.log(allQuestions.value);
// };

const onChange = async (pageNumber: number) => {
  loading.value = true;
  combinationLabel.value.pageNumber = pageNumber;
  combinationLabel.value.pageSize = currentPageSize.value;
  const res = await getQuestionByCombination(combinationLabel.value);
  allQuestions.value = res.data.questions;
  total.value = res.data.totalCount;
  loading.value = false;
  console.log(allQuestions.value);
};
</script>

<style scoped>
.knowledge-content {
  display: flex;
  justify-content: center;
}
</style>
