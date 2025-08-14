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
              style="margin-bottom: 30px"
          /></a-col>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import KnowledgePointTree from "@/components/KnowledgePointTree.vue";
import { onMounted, ref } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { getQuestionByCombination, QueryParams } from "@/api/question";
import QuestionFilter from "@/components/QuestionFilter.vue";
import { useAllQuestionsStore } from "@/stores/AllQuestions";
import { storeToRefs } from "pinia";
import { useFilterStore } from "@/stores/filter";
const allQuestionsStore = useAllQuestionsStore();
const { allQuestions } = storeToRefs(allQuestionsStore);
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
const filterStore = useFilterStore();
const { selected, label } = storeToRefs(filterStore);
onMounted(() => {
  combinationLabel.value.gradeId = label.value.grade;
  combinationLabel.value.difficulty = label.value.difficulty;
  combinationLabel.value.simpleQuestionType = label.value.type;
  getQuestionByCombination(combinationLabel.value)
    .then((res) => {
      allQuestions.value = res.data.questions;
      allQuestions.value.map((q) => {
        q.stem = q.stem.replace(/\n/g, "<br>");
        q.question_answer = q.question_answer.replace(/\n/g, "<br>");
        q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
      });
      total.value = res.data.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
});

const receiveData = (data: any) => {
  if (data.resultData != null && data.selectedKey != null) {
    allQuestions.value = data.resultData.questions;
    allQuestions.value.map((q) => {
      q.stem = q.stem.replace(/\n/g, "<br>");
      q.question_answer = q.question_answer.replace(/\n/g, "<br>");
      q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
    });
    selectedKp.value = data.selectedKey;
    total.value = data.resultData.totalCount;
  }
  currentPageNumber.value = 1;
  currentPageSize.value = 10;
  loading.value = data.loading;
};
const receiveLabel = async (data: any) => {
  loading.value = true;
  combinationLabel.value.knowledgePointName = selectedKp.value;
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

  allQuestions.value = res.data.questions;
  allQuestions.value.map((q) => {
    q.stem = q.stem.replace(/\n/g, "<br>");
    q.question_answer = q.question_answer.replace(/\n/g, "<br>");
    q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
  });
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
  combinationLabel.value.knowledgePointName = selectedKp.value;
  combinationLabel.value.pageNumber = pageNumber;
  combinationLabel.value.pageSize = currentPageSize.value;

  const res = await getQuestionByCombination(combinationLabel.value);

  allQuestions.value = res.data.questions;
  allQuestions.value.map((q) => {
    q.stem = q.stem.replace(/\n/g, "<br>");
    q.question_answer = q.question_answer.replace(/\n/g, "<br>");
    q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
  });
  total.value = res.data.totalCount;
  loading.value = false;
  console.log(allQuestions.value);
};

// ---------------- 以下代码是添加固定题目的代码，方便修改题目内容以进行调试调试
// const createFixedQuestion = (sampleQuestion: any) => {
//   return {
//     ...sampleQuestion, // 复制样本题目的所有字段
//     question_id: "0",
//     stem: 'Find the surface area<math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><msqrt><mi>a</mi></msqrt><annotation encoding="application/vnd.wiris.mtweb-params+json">{"language":"zh","fontFamily":"Arial, sans-serif","fontSize":"16px"}</annotation></semantics></math> of the sphere in terms of <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mi>π</mi><annotation encoding="application/vnd.wiris.mtweb-params+json">{"language":"zh","fontFamily":"Arial, sans-serif","fontSize":"16px"}</annotation><annotation encoding="LaTeX">\\pi</annotation></semantics></math>.<br><img alt="" data="https://taltools-cdn.speiyou.com/ggb/paper/data/ggb_graphing_/aea570dd-7979-4e71-8b64-b1b6b3b60c10.ggb" height="163" src="https://taltools-cdn.speiyou.com/ggb/paper/img/ggb_graphing_/aea570dd-7979-4e71-8b64-b1b6b3b60c10.svg" style="float:right" width="157">',
//     question_answer: "4πa",
//     question_explanation: "The surface area s the radius.",
//     difficulty: "medium",
//   };
// };

// // 修改添加固定题目的函数
// const addFixedQuestion = (questions: any[]) => {
//   if (questions.length > 0) {
//     // console.log("Creating fixed question from sample:", questions[0]);
//     const fixedQuestion = createFixedQuestion(questions[0]);
//     // console.log("Creating fixed question:", fixedQuestion);
//     return [fixedQuestion, ...questions];
//   }
//   return questions;
// };
// onMounted(() => {
//   combinationLabel.value.gradeId = label.value.grade;
//   combinationLabel.value.difficulty = label.value.difficulty;
//   combinationLabel.value.simpleQuestionType = label.value.type;
//   getQuestionByCombination(combinationLabel.value)
//     .then((res) => {
//       const questions = res.data.questions;
//       questions.map((q) => {
//         q.stem = q.stem.replace(/\n/g, "<br>");
//         q.question_answer = q.question_answer.replace(/\n/g, "<br>");
//         q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
//       });

//       // 添加固定题目到列表开头
//       allQuestions.value = addFixedQuestion(questions);
//       total.value = res.data.totalCount + 1; // 总数加1
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// });

// const receiveData = (data: any) => {
//   if (data.resultData != null && data.selectedKey != null) {
//     const questions = data.resultData.questions;
//     questions.map((q) => {
//       q.stem = q.stem.replace(/\n/g, "<br>");
//       q.question_answer = q.question_answer.replace(/\n/g, "<br>");
//       q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
//     });
//     // 添加固定题目到列表开头
//     allQuestions.value = addFixedQuestion(questions);
//     selectedKp.value = data.selectedKey;
//     total.value = data.resultData.totalCount + 1; // 总数加1
//   }
//   currentPageNumber.value = 1;
//   currentPageSize.value = 10;
//   loading.value = data.loading;
// };

// const receiveLabel = async (data: any) => {
//   loading.value = true;
//   combinationLabel.value.knowledgePointName = selectedKp.value;
//   combinationLabel.value.gradeId = data.selected.grade;
//   combinationLabel.value.difficulty = data.selected.difficulty;
//   combinationLabel.value.simpleQuestionType = data.selected.type;
//   label.value.grade = data.selected.grade;
//   label.value.difficulty = data.selected.difficulty;
//   label.value.type = data.selected.type;
//   currentPageSize.value = 10;
//   currentPageNumber.value = 1;
//   combinationLabel.value.pageNumber = currentPageNumber.value;
//   combinationLabel.value.pageSize = currentPageSize.value;
//   console.log(combinationLabel.value);

//   const res = await getQuestionByCombination(combinationLabel.value);

//   const questions = res.data.questions;

//   questions.map((q) => {
//     q.stem = q.stem.replace(/\n/g, "<br>");
//     q.question_answer = q.question_answer.replace(/\n/g, "<br>");
//     q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
//   });

//   // 添加固定题目到列表开头
//   allQuestions.value = addFixedQuestion(questions);
//   total.value = res.data.totalCount + 1; // 总数加1
//   loading.value = false;
// };

// const onChange = async (pageNumber: number) => {
//   loading.value = true;
//   combinationLabel.value.knowledgePointName = selectedKp.value;
//   combinationLabel.value.pageNumber = pageNumber;
//   combinationLabel.value.pageSize = currentPageSize.value;

//   const res = await getQuestionByCombination(combinationLabel.value);

//   const questions = res.data.questions;
//   questions.map((q) => {
//     q.stem = q.stem.replace(/\n/g, "<br>");
//     q.question_answer = q.question_answer.replace(/\n/g, "<br>");
//     q.question_explanation = q.question_explanation.replace(/\n/g, "<br>");
//   });

//   // 只在第一页显示固定题目
//   if (pageNumber === 1) {
//     allQuestions.value = addFixedQuestion(questions);
//   } else {
//     allQuestions.value = questions;
//   }

//   total.value = res.data.totalCount + (pageNumber === 1 ? 1 : 0);
//   loading.value = false;
//   console.log(allQuestions.value);
// };
</script>

<style scoped>
.knowledge-content {
  display: flex;
  justify-content: center;
}
</style>
