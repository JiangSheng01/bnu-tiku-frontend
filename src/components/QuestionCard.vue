<template>
  <div class="question-card">
    <a-col :span="24" v-for="(q, i) in allQuestions" :key="q.question_id">
      <a-card
        head-style="font-weight: normal; height: 22px"
        hoverable
        :loading="loading"
        style="margin-bottom: 10px"
      >
        <template #title>
          <div>
            <div class="question-title">
              {{ q.question_source }}
            </div>
            <div class="question-tags">
              <div class="question-tag">
                <div v-if="q.grade == 'Grade7-FirstTerm'">七年级上</div>
                <div v-if="q.grade == 'Grade7-SecondTerm'">七年级下</div>
                <div v-if="q.grade == 'Grade8-FirstTerm'">八年级上</div>
                <div v-if="q.grade == 'Grade8-SecondTerm'">八年级下</div>
                <div v-if="q.grade == 'Grade9-FirstTerm'">九年级上</div>
                <div v-if="q.grade == 'Grade9-SecondTerm'">九年级下</div>
              </div>
              <div class="vertical-line"></div>
              <div class="question-tag">
                <div v-if="q.simple_question_type == 0">单选题</div>
                <div v-if="q.simple_question_type == 1">多选题</div>
                <div v-if="q.simple_question_type == 2">填空题</div>
                <div v-if="q.simple_question_type == 3">简答题</div>
                <div v-if="q.simple_question_type == 4">判断题</div>
              </div>
              <div class="vertical-line"></div>
              <div class="question-tag">
                <div v-if="q.difficulty < 0.45">困难</div>
                <div v-else-if="q.difficulty < 0.6">较难</div>
                <div v-else-if="q.difficulty < 0.8">适中</div>
                <div v-else-if="q.difficulty < 0.9">较易</div>
                <div v-else-if="q.difficulty < 1">容易</div>
              </div>
              <div class="vertical-line"></div>
              <div class="question-tag">{{ q.knowledge_point }}</div>
            </div>
          </div>
        </template>
        <div class="question-content" @click="onCardClick(q.question_id)">
          <div v-if="q.question_type == 0">
            <div v-katex style="overflow: hidden">{{ q.stem }}</div>
            <div v-if="clickedQuestionIds.has(q.question_id)">
              <div
                style="
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: #ededed 1px dashed;
                "
              />
              <div>
                答案：
                <span v-katex>{{ q.question_answer }}</span>
              </div>
              <div v-katex>{{ q.question_explanation }}</div>
            </div>
          </div>
          <div v-else>
            <div class="stem-container" v-katex>
              {{ q.composite_question_stem }}
            </div>
            <div
              v-for="(sub_question, index) in JSON.parse(q.sub_questions)"
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
              />
              <div
                v-for="(sub_question, index) in JSON.parse(q.sub_questions)"
                :key="sub_question.question_id"
              >
                ({{ index + 1 }})
                <div v-katex>答案：{{ sub_question.question_answer }}</div>
                <span class="stem-container" v-katex>{{
                  sub_question.question_explanation
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="question-divider"></div>
        <div class="actions">
          <div class="action" @click="showCorrect(i)">纠错</div>
          <div class="action">详情</div>
          <!--          <div class="action">收藏</div>-->
          <a-button
            type="link"
            class="add-question-bucket"
            @click="toggleBasket(q)"
            v-show="showAddToBasket && !questionBasket.has(q.question_id)"
          >
            加入试题篮
          </a-button>
          <a-button
            type="link"
            class="has-added-question-bucket"
            @click="toggleBasket(q)"
            v-show="showAddToBasket && questionBasket.has(q.question_id)"
          >
            已加入试题篮
          </a-button>
        </div>
      </a-card>
      <!--      <QuestionCorrectView v-model:visible="correctShow" :question="q" />-->
    </a-col>
  </div>
  <!--  <BasketButton :count="basketCount" />-->
  <QuestionCorrectView
    v-model:visible="correctShow"
    v-model:question="clikedQuestion"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs, watchEffect, reactive, computed } from "vue";
import { useQuestionBasketStore } from "@/stores/questionBasket";
import QuestionCorrectView from "@/views/QuestionCorrectView.vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
const clickedQuestionIds = ref(new Set());
const questionBasketStore = useQuestionBasketStore();
const { questionBasket } = storeToRefs(questionBasketStore);
const correctShow = ref(false);
const clickedQuestionId = ref(0);
const clikedQuestion = ref(null);
const props = defineProps<{
  showAddToBasket: {
    type: boolean;
    default: true; // 默认显示按钮
  };
  allQuestions: any[];
  loading: boolean;
}>();

function toggleBasket(q: any) {
  if (questionBasket.value.has(q.question_id)) {
    questionBasket.value.delete(q.question_id); // O(1)
    message.success("试题篮：已移除");
  } else {
    questionBasket.value.set(q.question_id, q); // O(1)
    // console.log(questionBasket.value.get(q.question_id));
    message.success("试题篮：已添加");
  }
}

// watchEffect(() => {
//   console.log(Array.from(questionBasket.value.values()));
// });

// const addToBasket = (question: any) => {
//   if (questionBasket.value.has(question)) {
//     // alert(questionAdded.value.has(questionId));
//     questionBasket.value.delete(question);
//     // alert(questionAdded.value.has(questionId));
//     basketCount.value--;
//     return;
//   }
//   basketCount.value++;
//   questionBasket.value.add(question);
//   message.success("试题篮：已添加");
// };

let { allQuestions, loading } = toRefs(props);

const showCorrect = (questionId: any) => {
  correctShow.value = true;
  clickedQuestionId.value = questionId;
  if (allQuestions.value.length > 1) {
    clikedQuestion.value = allQuestions.value[clickedQuestionId.value];
  }
  // console.log(allQuestions.value[clickedQuestion.value]);
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
.question-card {
  width: 1000px;
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
  font-size: 13px;
  font-weight: 400;
  color: #4d90ff;
  margin-right: 15px;
}
.add-question-bucket {
  display: flex;
  align-items: center;
  font-size: 12px;
  background-color: #2c77ff;
  padding: 4px;
  color: white;
  height: 24px;
  border-radius: 3px;
  box-shadow: none;
}

.has-added-question-bucket {
  display: flex;
  align-items: center;
  font-size: 12px;
  background-color: #bfbfbf;
  padding: 4px;
  color: white;
  height: 24px;
  border-radius: 3px;
  box-shadow: none;
}

.has-added-question-bucket:hover {
  color: #8e8e8e;
}

.question-content {
  padding-bottom: 8px;
  overflow: hidden; /* 避免图片意外溢出 */
}
.question-content img,
.question-content [v-katex] {
  display: block;
  max-width: 100%;
  margin-bottom: 12px; /* 让图片、公式底下有空隙 */
}
.question-divider {
  border-bottom: 1px solid #ededed;
  margin: 0 0 16px 0;
  width: 100%;
}
.question-content > *:last-child {
  margin-bottom: 12px;
}
.action:hover {
  color: #005bff;
}
</style>
