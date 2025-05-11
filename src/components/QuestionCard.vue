<template>
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
            <a-button class="add-question-bucket"> 加入试题篮 </a-button>
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
            <span class="stem-container" v-katex>{{ sub_question.stem }}</span>
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
          <div class="actions">
            <div class="action">纠错</div>
            <div class="action">详情</div>
            <div class="action">收藏</div>
            <a-button class="add-question-bucket"> 加入试题篮 </a-button>
          </div>
        </div>
      </div>
    </a-card>
  </a-col>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from "vue";
const clickedQuestionIds = ref(new Set());
const props = defineProps<{
  allQuestions: any[];
  loading: boolean;
}>();

let { allQuestions, loading } = toRefs(props);

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
