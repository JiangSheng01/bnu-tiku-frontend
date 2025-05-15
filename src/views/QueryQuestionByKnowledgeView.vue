<template>
  <div class="all-content">
    <a-breadcrumb :style="{ margin: '16px 0', marginLeft: '20px' }">
      <a-breadcrumb-item>BNU智慧题库</a-breadcrumb-item>
      <a-breadcrumb-item>知识点选题</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="knowledge-content">
      <a-row :gutter="[12, 12]" justify="center" style="flex-wrap: nowrap">
        <a-col style="width: 300px">
          <KnowledgePointTree @send="receiveData" />
        </a-col>
        <a-col style="padding-left: 32px; width: 1000px">
          <a-row :gutter="[12, 12]">
            <a-col :span="24"
              ><div>
                共计 <span style="color: #2877ff">{{ total }}</span> 条数据
              </div></a-col
            >
            <QuestionCard :all-questions="allQuestions" :loading="loading" />
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
import { getQuestionsByKp } from "@/api/question";
const allQuestions = ref([]);
const currentPageNumber = ref<number>(1);
const currentPageSize = ref<number>(10);
const selectedKp = ref("beforeMount");
const total = ref(0);
const loading = ref(true);
onMounted(() => {
  const res = getQuestionsByKp("beforeMount", "1", "10")
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

const onChange = async (pageNumber: number) => {
  loading.value = true;
  const res = await getQuestionsByKp(
    selectedKp.value,
    pageNumber.toString(),
    currentPageSize.value.toString()
  );
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
