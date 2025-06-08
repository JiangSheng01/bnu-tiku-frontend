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
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor :text="correctionContent" />
        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div v-else-if="activeTab === 'answer'" style="margin-bottom: 14px">
        <b>答案内容：</b>
        <div class="divider"></div>
        <div v-katex>{{ question.question_answer }}</div>
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor :text="correctionContent" />
        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div v-else-if="activeTab === 'explanation'" style="margin-bottom: 14px">
        <b>解析内容：</b>
        <div class="divider"></div>
        <div v-katex>{{ question.question_explanation }}</div>
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor :text="correctionContent" />
        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div v-else-if="activeTab === 'tags'" style="margin-bottom: 14px">
        <b>标签：</b>
        <div class="divider"></div>
        <a-tag style="margin-bottom: 10px"
          >来源：{{ question.question_source }}</a-tag
        >
        <a-tag
          >年级：
          <span v-if="orginQuestion.grade == 'Grade7-FirstTerm'">七年级上</span>
          <span v-if="orginQuestion.grade == 'Grade7-SecondTerm'"
            >七年级下</span
          >
          <span v-if="orginQuestion.grade == 'Grade8-FirstTerm'">八年级上</span>
          <span v-if="orginQuestion.grade == 'Grade8-SecondTerm'"
            >八年级下</span
          >
          <span v-if="orginQuestion.grade == 'Grade9-FirstTerm'">九年级上</span>
          <span v-if="orginQuestion.grade == 'Grade9-SecondTerm'"
            >九年级下</span
          >
        </a-tag>
        <a-tag>知识点：{{ question.knowledge_point }}</a-tag>
        <a-tag
          >题目类型：
          <span v-if="orginQuestion.simple_question_type == 0">单选题</span>
          <span v-if="orginQuestion.simple_question_type == 1">多选题</span>
          <span v-if="orginQuestion.simple_question_type == 2">填空题</span>
          <span v-if="orginQuestion.simple_question_type == 3">简答题</span>
          <span v-if="orginQuestion.simple_question_type == 4"
            >判断题</span
          ></a-tag
        >
        <a-tag
          >难度：
          <span v-if="orginQuestion.difficulty < 0.45">困难</span>
          <span v-else-if="orginQuestion.difficulty < 0.6">较难</span>
          <span v-else-if="orginQuestion.difficulty < 0.8">适中</span>
          <span v-else-if="orginQuestion.difficulty < 0.9">较易</span>
          <span v-else-if="orginQuestion.difficulty < 1">容易</span></a-tag
        >
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="在下拉框中选择标签即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
          <div class="divider"></div>
          <span style="margin-right: 10px">
            <a-dropdown
              style="box-shadow: none; height: 40px; border-color: #d8d8d8"
            >
              <template #overlay>
                <a-menu
                  v-model:selectedKeys="selectedGradeKeys"
                  @click="handleGradeMenuClick"
                >
                  <a-menu-item key="1"> 七年级上 </a-menu-item>
                  <a-menu-item key="2"> 七年级下 </a-menu-item>
                  <a-menu-item key="3"> 八年级上 </a-menu-item>
                  <a-menu-item key="4"> 八年级下 </a-menu-item>
                  <a-menu-item key="5"> 九年级上 </a-menu-item>
                  <a-menu-item key="6"> 九年级下 </a-menu-item>
                </a-menu>
              </template>
              <a-button
                style="box-shadow: none; height: 40px; border-color: #d8d8d8"
              >
                <span style="margin-left: 3px; margin-right: 12px">年级</span>

                <span v-if="question.grade == 'Grade7-FirstTerm'"
                  >七年级上</span
                >
                <span v-if="question.grade == 'Grade7-SecondTerm'"
                  >七年级下</span
                >
                <span v-if="question.grade == 'Grade8-FirstTerm'"
                  >八年级上</span
                >
                <span v-if="question.grade == 'Grade8-SecondTerm'"
                  >八年级下</span
                >
                <span v-if="question.grade == 'Grade9-FirstTerm'"
                  >九年级上</span
                >
                <span v-if="question.grade == 'Grade9-SecondTerm'"
                  >九年级下</span
                >
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </span>
          <span style="margin-right: 10px">
            <a-dropdown
              style="box-shadow: none; height: 40px; border-color: #d8d8d8"
            >
              <template #overlay>
                <a-menu
                  v-model:selectedKeys="selectedQuestionTypeKeys"
                  @click="handleQuestionTypeMenuClick"
                >
                  <a-menu-item key="0"> 单选题 </a-menu-item>
                  <a-menu-item key="1"> 多选题 </a-menu-item>
                  <a-menu-item key="2"> 填空题 </a-menu-item>
                  <a-menu-item key="3"> 简答题 </a-menu-item>
                  <a-menu-item key="4"> 判断题 </a-menu-item>
                </a-menu>
              </template>
              <a-button
                style="box-shadow: none; height: 40px; border-color: #d8d8d8"
              >
                <span style="margin-left: 3px; margin-right: 12px">题型</span>
                <span v-if="question.simple_question_type == 0">单选题</span>
                <span v-if="question.simple_question_type == 1">多选题</span>
                <span v-if="question.simple_question_type == 2">填空题</span>
                <span v-if="question.simple_question_type == 3">简答题</span>
                <span v-if="question.simple_question_type == 4">判断题</span>
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </span>
          <span style="margin-right: 10px">
            <a-dropdown
              style="box-shadow: none; height: 40px; border-color: #d8d8d8"
            >
              <template #overlay>
                <a-menu
                  v-model:selectedKeys="selectedDifficultyKeys"
                  @click="handleDifficultyMenuClick"
                >
                  <a-menu-item key="1"> 困难 </a-menu-item>
                  <a-menu-item key="2"> 较难 </a-menu-item>
                  <a-menu-item key="3"> 适中 </a-menu-item>
                  <a-menu-item key="4"> 较易 </a-menu-item>
                  <a-menu-item key="5"> 容易 </a-menu-item>
                </a-menu>
              </template>
              <a-button
                style="box-shadow: none; height: 40px; border-color: #d8d8d8"
              >
                <span style="margin-left: 3px; margin-right: 12px">难度</span>
                <span v-if="question.difficulty < 0.45">困难</span>
                <span v-else-if="question.difficulty < 0.6">较难</span>
                <span v-else-if="question.difficulty < 0.8">适中</span>
                <span v-else-if="question.difficulty < 0.9">较易</span>
                <span v-else-if="question.difficulty < 1">容易</span>
                <DownOutlined />
              </a-button> </a-dropdown
          ></span>
          <a-input
            v-model:value="correctionSource"
            style="
              box-shadow: none;
              height: 40px;
              border-color: #d8d8d8;
              margin-bottom: 10px;
              margin-top: 18px;
            "
          >
            <template #prefix
              ><span style="margin-right: 8px; margin-left: 8px"
                >来源</span
              ></template
            >
          </a-input>
          <div style="margin-top: 10px">
            <a-row>
              <a-col span="3">
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    border: 1px solid #d8d8d8;
                    border-right: none;
                    border-top-left-radius: 6px;
                    border-bottom-left-radius: 6px;
                  "
                >
                  知识点
                </div>
              </a-col>
              <a-col span="21">
                <a-cascader
                  v-model:value="cascaderValue"
                  size="large"
                  :options="kpOptions"
                  style="width: 100%"
                  :show-search="{ filter }"
                  :popupClassName="'cascader'"
              /></a-col>
            </a-row>
          </div>
        </div>

        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineModel, ref, watchEffect, watch, toRaw } from "vue";
import { InfoCircleOutlined, DownOutlined } from "@ant-design/icons-vue";
import RichEditor from "@/components/RichEditor.vue";
import { kpOptions, Option } from "@/Data/TreeDataOptons";
import { message } from "ant-design-vue";
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
    difficulty: 1,
  },
});
const orginQuestion = toRaw(question.value);
const cascaderValue = ref("");
const activeTab = ref("stem");
const correctionContent = ref("");
const correctionSource = ref("");
const selectedGradeKeys = ref([]);
const selectedDifficultyKeys = ref([]);
const selectedQuestionTypeKeys = ref("");
const filter = (inputValue: string, path: Option[]) => {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};
watchEffect(() => {
  // alert(oldValue);
  if (question.value == null) {
    return;
  }
  if (activeTab.value === "stem") {
    correctionContent.value = question.value.stem;
  } else if (activeTab.value === "answer") {
    correctionContent.value = question.value.question_answer;
  } else if (activeTab.value === "explanation") {
    correctionContent.value = question.value.question_explanation;
  } else if (activeTab.value === "tags") {
    correctionSource.value = question.value.question_source;
    cascaderValue.value = question.value.knowledge_point;
  }
  // alert(correctionContent.value);
});
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
  message.success("修改已提交");
}

watchEffect(() => {
  if (visible.value == false) {
    activeTab.value = "stem";
  }
});

function handleGradeMenuClick(info: any) {
  if (info.key == "1") {
    question.value.grade = "Grade7-FirstTerm";
  }

  if (info.key == "2") {
    question.value.grade = "Grade7-SecondTerm";
  }

  if (info.key == "3") {
    question.value.grade = "Grade8-FirstTerm";
  }

  if (info.key == "4") {
    question.value.grade = "Grade8-SecondTerm";
  }
  if (info.key == "5") {
    question.value.grade = "Grade9-FirstTerm";
  }
  if (info.key == "6") {
    question.value.grade = "Grade9-SecondTerm";
  }
}

function handleQuestionTypeMenuClick(info: any) {
  question.value.simple_question_type = info.key;
}

function handleDifficultyMenuClick(info: any) {
  if (info.key == "1") {
    question.value.difficulty = 0.1;
  }

  if (info.key == "2") {
    question.value.difficulty = 0.5;
  }

  if (info.key == "3") {
    question.value.difficulty = 0.7;
  }

  if (info.key == "4") {
    question.value.difficulty = 0.85;
  }
  if (info.key == "5") {
    question.value.difficulty = 0.95;
  }
}
</script>

<style scoped>
.divider {
  border-bottom: 1px solid #ededed;
  margin: 12px 0 16px 0;
  width: 100%;
}
.kp-wrap .ant-cascader-menu-item-content {
  white-space: normal; /* 允许自动换行  */
  word-break: break-word; /* 单词太长也强制断行 */
  line-height: 22px; /* 行高调小一点更紧凑（可选） */
  font-size: 1px;
}
</style>

<style>
.cascader {
  box-shadow: none;
  outline: none;
}
.cascader .ant-cascader-menu-item-content {
  white-space: normal; /* 允许自动换行  */
  word-break: break-word; /* 单词太长也强制断行 */
  line-height: 22px; /* 行高调小一点更紧凑（可选） */
}
/* 选项太宽时别把菜单撑到超大 */
.cascader .ant-cascader-menu {
  width: 180px; /* 你想要的最大宽度 */
}
:where(.css-dev-only-do-not-override-1p3hq3p).ant-select-single.ant-select-lg
  .ant-select-selector {
  font-size: 14px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
  box-shadow: none;
  outline: none;
}
:where(.css-dev-only-do-not-override-1p3hq3p).ant-select-single.ant-select-lg
  .ant-select-selector:hover {
  box-shadow: none;
  outline: none;
  border: 1px solid #cacaca;
}
:where(.css-dev-only-do-not-override-1p3hq3p).ant-select:not(
    .ant-select-disabled
  ):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover
  .ant-select-selector {
  border-color: #cacaca;
  box-shadow: none;
  border-left: 0;
}
.ant-select-focused:where(.css-dev-only-do-not-override-1p3hq3p).ant-select:not(
    .ant-select-disabled
  ):not(.ant-select-customize-input):not(.ant-pagination-size-changer)
  .ant-select-selector {
  border-color: #cacaca;
  box-shadow: none;
  outline: 0;
}
</style>
