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
        <div class="question-content">
          <rich-editor :text="question.stem" :readonly="true" />
        </div>
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor
          ref="richEditorRef"
          :key="editorKey"
          :text="correctionContent"
          @send-corrections="recieveCorrection"
        />
        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div v-else-if="activeTab === 'answer'" style="margin-bottom: 14px">
        <b>答案内容：</b>
        <div class="divider"></div>
        <div class="question-content">
          <rich-editor :text="question.question_answer" :readonly="true" />
        </div>
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor
          ref="richEditorRef"
          :key="editorKey"
          :text="correctionContent"
          @send-corrections="recieveCorrection"
        />
        <div style="text-align: right; margin-top: 18px">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div v-else-if="activeTab === 'explanation'" style="margin-bottom: 14px">
        <b>解析内容：</b>
        <div class="divider"></div>
        <div class="question-content">
          <rich-editor :text="question.question_explanation" :readonly="true" />
        </div>
        <div style="margin: 12px 0 16px 0">
          <div class="divider"></div>
          <a-tooltip title="直接修改下方文本即可"
            ><info-circle-outlined /></a-tooltip
          ><b> 对比修改：</b>
        </div>
        <rich-editor
          ref="richEditorRef"
          :key="editorKey"
          :text="correctionContent"
          @send-corrections="recieveCorrection"
        />
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
          <span v-if="question.grade == 'Grade7-FirstTerm'">七年级上</span>
          <span v-if="question.grade == 'Grade7-SecondTerm'">七年级下</span>
          <span v-if="question.grade == 'Grade8-FirstTerm'">八年级上</span>
          <span v-if="question.grade == 'Grade8-SecondTerm'">八年级下</span>
          <span v-if="question.grade == 'Grade9-FirstTerm'">九年级上</span>
          <span v-if="question.grade == 'Grade9-SecondTerm'">九年级下</span>
        </a-tag>
        <a-tag>知识点：{{ question.knowledge_point }}</a-tag>
        <a-tag
          >题目类型：
          <span v-if="question.simple_question_type == 0">单选题</span>
          <span v-if="question.simple_question_type == 1">多选题</span>
          <span v-if="question.simple_question_type == 2">填空题</span>
          <span v-if="question.simple_question_type == 3">简答题</span>
          <span v-if="question.simple_question_type == 4">判断题</span></a-tag
        >
        <a-tag
          >难度：
          <span v-if="question.difficulty < 0.45">困难</span>
          <span v-else-if="question.difficulty < 0.6">较难</span>
          <span v-else-if="question.difficulty < 0.8">适中</span>
          <span v-else-if="question.difficulty < 0.9">较易</span>
          <span v-else-if="question.difficulty < 1">容易</span></a-tag
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

                <span v-if="correctionGrade == 'Grade7-FirstTerm'"
                  >七年级上</span
                >
                <span v-if="correctionGrade == 'Grade7-SecondTerm'"
                  >七年级下</span
                >
                <span v-if="correctionGrade == 'Grade8-FirstTerm'"
                  >八年级上</span
                >
                <span v-if="correctionGrade == 'Grade8-SecondTerm'"
                  >八年级下</span
                >
                <span v-if="correctionGrade == 'Grade9-FirstTerm'"
                  >九年级上</span
                >
                <span v-if="correctionGrade == 'Grade9-SecondTerm'"
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
                <span v-if="correctionQuestionType == 0">单选题</span>
                <span v-if="correctionQuestionType == 1">多选题</span>
                <span v-if="correctionQuestionType == 2">填空题</span>
                <span v-if="correctionQuestionType == 3">简答题</span>
                <span v-if="correctionQuestionType == 4">判断题</span>
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
                <span v-if="correctionDifficulty < 0.45">困难</span>
                <span v-else-if="correctionDifficulty < 0.6">较难</span>
                <span v-else-if="correctionDifficulty < 0.8">适中</span>
                <span v-else-if="correctionDifficulty < 0.9">较易</span>
                <span v-else-if="correctionDifficulty < 1">容易</span>
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
import { CorrectParams, correctQuestionById } from "@/api/question";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { syncUserFromServer } from "@/api/user";
const visible = defineModel<boolean>("visible", { default: false }); // 由父组件控制显示
const question = defineModel("question", {
  default: {
    question_id: 1,
    stem: "这里是题干内容...",
    question_answer: "这里是答案内容...",
    question_explanation: "这里是解析内容...",
    question_source: "这是来源",
    grade: "这是年级",
    knowledge_point: "这是知识点",
    simple_question_type: 1,
    difficulty: 1,
  },
});
const cascaderValue = ref("");
const activeTab = ref("stem");
const correctionContent = ref("");
const correctionSource = ref("");
const correctionDifficulty = ref();
const correctionGrade = ref("");
const correctionQuestionType = ref();
const selectedGradeKeys = ref([]);
const selectedDifficultyKeys = ref([]);
const selectedQuestionTypeKeys = ref("");
const lastKnowledgePoint = ref("");
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
console.log("question correct is ", userInfo.value);
const filter = (inputValue: string, path: Option[]) => {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};
const editorKey = ref(0);
const richEditorRef = ref();

function areAllValuesEmpty(obj: any): boolean {
  // Object.values(obj).every((value) => alert(value));
  return Object.values(obj).every((value) => value === null);
}

watchEffect(() => {
  // 只有在弹窗打开且题目数据有效时才初始化
  if (question.value == null || !visible.value) {
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
    correctionDifficulty.value = question.value.difficulty;
    correctionGrade.value = question.value.grade;
    correctionQuestionType.value = question.value.simple_question_type;
    cascaderValue.value = question.value.knowledge_point;
  }
});

// 在 watch visible 中更新 key
watch(visible, (value, oldValue) => {
  if (value == true) {
    // 弹窗打开时，重置所有编辑内容为原始值
    activeTab.value = "stem";
    correctionContent.value = question.value.stem;

    // 重置标签编辑内容为原始值
    correctionSource.value = question.value.question_source;
    correctionDifficulty.value = question.value.difficulty;
    correctionGrade.value = question.value.grade;
    correctionQuestionType.value = question.value.simple_question_type;
    cascaderValue.value = question.value.knowledge_point;

    // 强制重新渲染编辑器
    editorKey.value++;
  } else if (value == false) {
    // 弹窗关闭时，先关闭 MathType 弹窗
    closeMathTypeModal();

    // 清空所有编辑内容
    correctionContent.value = "";
    correctionSource.value = "";
    correctionDifficulty.value = null;
    correctionGrade.value = "";
    correctionQuestionType.value = null;
    cascaderValue.value = "";
    lastKnowledgePoint.value = "";

    // 重置选中的下拉菜单项
    selectedGradeKeys.value = [];
    selectedDifficultyKeys.value = [];
    selectedQuestionTypeKeys.value = "";
  }
});

function closeMathTypeModal() {
  try {
    // 步骤 1: 查找主编辑器的“取消”按钮
    // 这个按钮是关闭流程的入口
    const cancelBtn = document.querySelector(
      '[data-testid="mtcteditor-cancel-button"], [id^="wrs_modal_button_cancel"]'
    );

    // 如果找到了“取消”按钮，说明 MathType 编辑器是打开的
    if (cancelBtn) {
      (cancelBtn as HTMLElement).click();

      // 步骤 2: 轮询查找并点击二次确认弹窗的“关闭”按钮
      // 使用轮询（而不是固定延时）来应对不同情况下的弹窗延迟
      let attempts = 0;
      const maxAttempts = 20; // 最多尝试 20 次 (总共 1 秒)
      const interval = setInterval(() => {
        attempts++;
        // 这个是二次确认弹窗中，表示“放弃修改并关闭”的按钮
        const confirmCloseButton = document.querySelector(
          '#wrs_popup_accept_button, [data-testid="mtcteditor-cd-close-button"]'
        );

        if (confirmCloseButton) {
          // 找到了就点击它，并停止轮询
          try {
            (confirmCloseButton as HTMLElement).click();
          } catch {
            /* 静默处理 */
          }
          clearInterval(interval);
          // 成功关闭后，执行最终的清理
          cleanupRemainingMathTypeModals();
        } else if (attempts >= maxAttempts) {
          // 如果超时了还没找到，说明可能没有二次确认弹窗，或者弹窗结构变了
          clearInterval(interval);
          // 同样执行最终的清理
          cleanupRemainingMathTypeModals();
        }
      }, 50); // 每 50 毫秒检查一次
    } else {
      // 如果一开始就没找到 MathType 编辑器，也执行一次清理以防万一
      cleanupRemainingMathTypeModals();
    }
  } catch (error) {
    console.warn("关闭 MathType 弹窗时发生初始错误:", error);
    // 即使最开始就出错，也要尝试清理
    cleanupRemainingMathTypeModals();
  }
}

// 独立的最终清理函数，确保所有残留的 MathType 元素都被移除
function cleanupRemainingMathTypeModals() {
  // 延迟一小段时间，确保所有点击事件和关闭动画完成
  setTimeout(() => {
    // 查找所有可能由 MathType 创建的顶层元素，包括离线弹窗
    document
      .querySelectorAll(
        '#wrs_modal_offline, .wrs_modal, .wrs_modal_dialogContainer, .wrs_modal_offline, .wrs_modal_content_offline, .wrs_modal_offline_close, [class*="wrs_popup"], [data-title="MathType"], [data-title="ChemType"]'
      )
      .forEach((el) => {
        try {
          // 从 DOM 中安全地移除
          el.remove();
        } catch {
          /* 静默处理 */
        }
      });
  }, 150);
}

watchEffect(() => {
  // 只有在弹窗打开且知识点有值时才处理
  if (!visible.value || !cascaderValue.value) {
    return;
  }

  const knowledgePoints = cascaderValue.value.toString();
  const knowledgeArray = knowledgePoints.split(",");
  lastKnowledgePoint.value = knowledgeArray[knowledgeArray.length - 1];
});

// 内容标准化函数
function normalizeContent(content: string): string {
  if (!content) return "";

  // 1. 先统一处理换行符，将 <br> 和 <br/> 转换为空格
  content = content.replace(/<br\s*\/?>/gi, " ");

  // 2. 去掉 LaTeX 注释
  content = content.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, "");

  // 3. 创建临时 div 来处理 HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // 4. 移除所有 HTML 标签，只保留纯文本
  let normalized = tempDiv.innerText || tempDiv.textContent || "";

  // 5. 统一处理空白字符：
  // - 将连续的空白字符（包括空格、换行符、制表符等）合并为单个空格
  // - 移除首尾空白
  normalized = normalized.replace(/\s+/g, " ").trim();

  // 6. 移除HTML实体
  normalized = normalized
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 7. 再次清理可能产生的多余空格
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

// 检查内容变化的函数
function checkContentChanges(
  original: string,
  modified: string | null
): boolean {
  if (!modified) return false;

  // 标准化内容进行比较
  const normalizedOriginal = normalizeContent(original);
  const normalizedModified = normalizeContent(modified);

  // 如果纯文本内容不同，说明有变化
  if (normalizedOriginal !== normalizedModified) {
    return true;
  }

  // 如果纯文本相同，再检查公式变化
  return checkFormulaChanges(original, modified);
}

// 修改 handleSubmit 函数
async function handleSubmit() {
  const correctQuestParams: CorrectParams = {
    userId: 1,
    correctType: activeTab.value,
    correction: activeTab.value != "tags" ? correctionContent.value : null,
    questionId: question.value.question_id,
    correctTags:
      activeTab.value == "tags"
        ? {
            difficulty:
              question.value.difficulty != correctionDifficulty.value
                ? correctionDifficulty.value
                : null,
            grade:
              question.value.grade != correctionGrade.value
                ? correctionGrade.value
                : null,
            simpleQuestionType:
              question.value.simple_question_type !=
              correctionQuestionType.value
                ? correctionQuestionType.value
                : null,
            source:
              question.value.question_source != correctionSource.value
                ? correctionSource.value
                : null,
            knowledgePointName:
              question.value.knowledge_point != lastKnowledgePoint.value
                ? lastKnowledgePoint.value
                : null,
          }
        : null,
  };

  // 检查是否有内容变化的逻辑
  if (correctQuestParams.correctType != "tags") {
    const originalContent = getOriginalContent();
    const hasContentChanges = checkContentChanges(
      originalContent,
      correctQuestParams.correction
    );

    // 如果没有任何变化，则不允许提交
    if (!hasContentChanges) {
      message.error("请修改后再提交");
      return;
    }
  } else {
    console.log(correctQuestParams.correctTags);

    const b = areAllValuesEmpty(correctQuestParams.correctTags);
    if (b) {
      message.error("请修改后再提交");
      return;
    }
  }
  // if (correctQuestParams.correctType != "tags") {
  //   const originalContent = getOriginalContent();
  //   const modifiedContent = correctQuestParams.correction;

  //   // 打印原始内容和修改内容
  //   console.log("原始内容:", originalContent);
  //   console.log("修改内容:", modifiedContent);

  //   // 打印标准化内容
  //   console.log("标准化原始内容:", normalizeContent(originalContent));
  //   console.log("标准化修改内容:", normalizeContent(modifiedContent));

  //   // 打印公式数组
  //   console.log("原始公式:", extractMathFormulas(originalContent));
  //   console.log("修改公式:", extractMathFormulas(modifiedContent));

  //   const hasContentChanges = checkContentChanges(
  //     originalContent,
  //     modifiedContent
  //   );

  //   // 如果没有任何变化，则不允许提交
  //   if (!hasContentChanges) {
  //     message.error("请修改后再提交");
  //     return;
  //   }
  // }
  // 发送接口
  const res = await correctQuestionById(correctQuestParams);
  visible.value = false;

  if (res.data.code == "SUCCESS") {
    message.success("修改已提交");
  } else {
    message.error("修改失败");
  }
}

// 获取原始内容的辅助函数
function getOriginalContent(): string {
  if (activeTab.value === "stem") {
    return question.value.stem;
  } else if (activeTab.value === "answer") {
    return question.value.question_answer;
  } else if (activeTab.value === "explanation") {
    return question.value.question_explanation;
  }
  return "";
}

// 检查公式变化的函数
function checkFormulaChanges(
  original: string,
  modified: string | null
): boolean {
  if (!modified) return false;

  // 提取原始内容中的数学公式
  const originalFormulas = extractMathFormulas(original);
  const modifiedFormulas = extractMathFormulas(modified);

  // 比较公式数量
  if (originalFormulas.length !== modifiedFormulas.length) {
    return true;
  }

  // 比较每个公式的内容
  for (let i = 0; i < originalFormulas.length; i++) {
    if (originalFormulas[i] !== modifiedFormulas[i]) {
      return true;
    }
  }

  return false;
}

// 提取数学公式的函数
function extractMathFormulas(content: string): string[] {
  const formulas: string[] = [];

  // 提取 MathML 标签
  const mathmlRegex = /<math[^>]*>[\s\S]*?<\/math>/gi;
  const mathmlMatches = content.match(mathmlRegex);
  if (mathmlMatches) {
    formulas.push(...mathmlMatches);
  }

  // 提取 MathType 图片 (data-mathml 属性)
  const imgRegex =
    /<img[^>]*class="Wirisformula"[^>]*data-mathml="([^"]*)"[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    // 解码 data-mathml 属性中的公式
    const decodedMathml = match[1].replace(/«/g, "<").replace(/»/g, ">");
    formulas.push(decodedMathml);
  }

  return formulas;
}

function handleGradeMenuClick(info: any) {
  if (info.key == "1") {
    correctionGrade.value = "Grade7-FirstTerm";
  }
  if (info.key == "2") {
    correctionGrade.value = "Grade7-SecondTerm";
  }
  if (info.key == "3") {
    correctionGrade.value = "Grade8-FirstTerm";
  }
  if (info.key == "4") {
    correctionGrade.value = "Grade8-SecondTerm";
  }
  if (info.key == "5") {
    correctionGrade.value = "Grade9-FirstTerm";
  }
  if (info.key == "6") {
    correctionGrade.value = "Grade9-SecondTerm";
  }
}

function handleQuestionTypeMenuClick(info: any) {
  correctionQuestionType.value = info.key;
}

function handleDifficultyMenuClick(info: any) {
  if (info.key == "1") {
    correctionDifficulty.value = 0.1;
  }
  if (info.key == "2") {
    correctionDifficulty.value = 0.5;
  }
  if (info.key == "3") {
    correctionDifficulty.value = 0.7;
  }
  if (info.key == "4") {
    correctionDifficulty.value = 0.85;
  }
  if (info.key == "5") {
    correctionDifficulty.value = 0.95;
  }
}

function recieveCorrection(res: any) {
  correctionContent.value = res.correction;
  // alert(correctionContent.value);
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

.question-content {
  overflow: auto;
  max-height: 250px;
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

.ant-select-single.ant-select-lg .ant-select-selector {
  font-size: 14px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
  box-shadow: none;
  outline: none;
}

.ant-select-single.ant-select-lg .ant-select-selector:hover {
  box-shadow: none;
  outline: none;
  border: 1px solid #cacaca;
}

.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(
    .ant-pagination-size-changer
  ):hover
  .ant-select-selector {
  border-color: #cacaca;
  box-shadow: none;
  border-left: 0;
}

.ant-select.ant-select-focused:not(.ant-select-disabled):not(
    .ant-select-customize-input
  ):not(.ant-pagination-size-changer)
  > .ant-select-selector {
  border-color: #cacaca;
  box-shadow: none;
  outline: 0;
}
</style>
