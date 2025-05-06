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
            <a-col :span="24" v-for="q in allQuestions" :key="q.question_id">
              <a-card
                head-style="font-weight: normal; height: 22px"
                hoverable
                @click="onCardClick(q.question_id)"
                :loading="loading"
              >
                <template #title>
                  <div class="question-title">{{ q.question_source }}</div>
                  <div class="question-tags">
                    <div class="question-tag">
                      <div v-if="q.simple_question_type == 0">单选题</div>
                      <div v-if="q.simple_question_type == 1">多选题</div>
                      <div v-if="q.simple_question_type == 2">填空题</div>
                      <div v-if="q.simple_question_type == 3">简答题</div>
                      <div v-if="q.simple_question_type == 4">判断题</div>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="question-tag">
                      <div v-if="q.difficulty < 0.7">稍难</div>
                      <div v-else-if="q.difficulty < 0.8">正常</div>
                      <div v-else-if="q.difficulty < 0.9">较易</div>
                      <div v-else-if="q.difficulty < 0.95">简单</div>
                      <div v-else-if="q.difficulty < 1">很简单</div>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="question-tag">{{ q.knowledge_point }}</div>
                  </div>
                </template>
                <div
                  style="
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: #ededed 1px solid;
                  "
                >
                  <div v-if="q.question_type == 0">
                    <div v-katex>{{ q.stem }}</div>
                    <div v-if="clickedQuestionIds.has(q.question_id)">
                      <div
                        style="
                          margin-top: 20px;
                          padding-top: 20px;
                          border-top: #ededed 1px dashed;
                        "
                      >
                        <div>
                          答案：
                          <span v-katex>{{ q.question_answer }}</span>
                        </div>
                        <div v-katex>{{ q.question_explanation }}</div>
                      </div>
                    </div>
                    <div class="actions">
                      <div class="action">纠错</div>
                      <div class="action">详情</div>
                      <div class="action">收藏</div>
                      <a-button class="add-question-bucket">
                        加入试题篮
                      </a-button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="stem-container" v-katex>
                      {{ q.composite_question_stem }}
                    </div>
                    <div
                      v-for="(sub_question, index) in JSON.parse(
                        q.sub_questions
                      )"
                      :key="sub_question.question_id"
                    >
                      ({{ index + 1 }})
                      <span class="stem-container" v-katex>{{
                        sub_question.stem
                      }}</span>
                    </div>
                    <div v-if="clickedQuestionIds.has(q.question_id)">
                      <div
                        style="
                          margin-top: 20px;
                          padding-top: 20px;
                          border-top: #ededed 1px dashed;
                        "
                      >
                        <div
                          v-for="(sub_question, index) in JSON.parse(
                            q.sub_questions
                          )"
                          :key="sub_question.question_id"
                        >
                          ({{ index + 1 }})
                          <div v-katex>
                            答案：{{ sub_question.question_answer }}
                          </div>
                          <span class="stem-container" v-katex>{{
                            sub_question.question_explanation
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col
              style="display: flex; justify-content: center; width: 1000px"
            >
              <a-pagination
                show-quick-jumper
                v-model:current="currentPageNumber"
                :total="total"
                v-model:page-size="currentPageSize"
                @change="onChange"
            /></a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import KnowledgePointTree from "@/components/KnowledgePointTree.vue";
import katex from "katex/types/katex";
import { onMounted, ref } from "vue";
import { KatexVue } from "katex-vue";
import axios from "axios";
const allQuestions = ref([]);
const currentPageNumber = ref<number>(1);
const currentPageSize = ref<number>(10);
const selectedKp = ref("beforeMount");
const total = ref(0);
const clickedQuestionIds = ref(new Set());
const loading = ref(true);
onMounted(() => {
  const res = axios
    .get(
      `http://localhost:8080/question/search/kp/${encodeURIComponent(
        "beforeMount"
      )} / ${encodeURIComponent(
        currentPageNumber.value
      )} / ${encodeURIComponent(currentPageSize.value)}
    `
    )
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
  const res = await axios.get(
    `http://localhost:8080/question/search/kp/${encodeURIComponent(
      selectedKp.value
    )}/${encodeURIComponent(pageNumber)}/${encodeURIComponent(
      currentPageSize.value
    )}
    `
  );
  allQuestions.value = res.data.questions;
  total.value = res.data.totalCount;
  loading.value = false;
  console.log(allQuestions.value);
};

const onCardClick = (id: any) => {
  loading.value = true;
  if (clickedQuestionIds.value.has(id)) {
    clickedQuestionIds.value.delete(id);
  } else {
    clickedQuestionIds.value.add(id);
  }
  clickedQuestionIds.value = new Set(clickedQuestionIds.value);
  loading.value = false;
};
</script>

<style scoped>
.knowledge-content {
  display: flex;
  justify-content: center;
}
.vertical-line {
  height: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-right: #e3e3e3 solid 1px;
}
.question-title {
  display: flex;
  align-items: center;
  font-size: 11px;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #f0f8ff;
  border-radius: 4px 0 4px 0;
  height: 24px;
  color: #2877ff;
}
.question-tags {
  display: flex;
  align-items: center;
  margin-top: 22px;
  height: 10px;
}
.question-tag {
  font-size: 11px;
  font-weight: 400;
  color: #717171;
}

.actions {
  display: flex;
  align-items: center;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 25px;
}
.action {
  font-size: 11px;
  font-weight: 400;
  color: #2877ff;
  margin-right: 15px;
}
.add-question-bucket {
  display: flex;
  align-items: center;
  font-size: 12px;
  background-color: #2877ff;
  padding: 4px;
  color: white;
  height: 24px;
  border-radius: 3px;
}
.katex {
  font-family: inherit !important;
}
</style>
