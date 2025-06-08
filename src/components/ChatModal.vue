<template>
  <a-modal
    v-model:open="visible"
    title=""
    :footer="null"
    :width="1600"
    centered
    :maskClosable="false"
    wrapClassName="ai-chat-modal"
    style="border-radius: 32px"
  >
    <div :style="styles.layout">
      <div :style="styles.menu">
        <!-- 🌟 Logo -->
        <div :style="styles.logo">
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable="false"
            alt="logo"
            :style="styles['logo-img']"
          />
          <span :style="styles['logo-span']">BNU TIKU NEO</span>
        </div>

        <!-- 🌟 添加会话 -->
        <a-button type="link" :style="styles.addBtn" @click="onAddConversation">
          <PlusOutlined />
          New Conversation
        </a-button>

        <!-- 🌟 会话管理 -->
        <Conversations
          :items="conversationsItems"
          :style="styles.conversations"
          :menu="menuConfig"
          :active-key="activeKey"
          @active-change="onConversationClick"
        />

        <div
          style="
            text-align: center;
            border: 1px solid #e4e4e4;
            margin-bottom: 10px;
          "
        />

        <a-button
          type="text"
          style="
            font-size: 15px;
            text-align: left;
            height: 40px;
            width: 92%;
            margin-left: 10px;
          "
        >
          <DeleteOutlined />
          Clear Conversations
        </a-button>

        <a-button
          type="text"
          style="
            font-size: 15px;
            margin-bottom: 24px;
            text-align: left;
            height: 40px;
            margin-left: 10px;
            width: 92%;
          "
        >
          <FireOutlined />
          Light Mode
        </a-button>
      </div>
      <div :style="styles.chat">
        <!-- 🌟 消息列表 -->
        <!--        <div-->
        <!--          style="-->
        <!--            flex: 1;-->
        <!--            width: 1200px;-->
        <!--            overflow-y: auto;-->
        <!--            display: flex;-->
        <!--            flex-direction: column;-->
        <!--            align-items: center;-->
        <!--          "-->
        <!--        >-->
        <!--          <Bubble.List-->
        <!--            :items="items"-->
        <!--            :roles="roles"-->
        <!--            :style="styles.holderNode"-->
        <!--            v-if="messages.length === 0"-->
        <!--          />-->
        <!--          <Bubble.List-->
        <!--            :items="items"-->
        <!--            :roles="roles"-->
        <!--            :style="styles.messages"-->
        <!--            v-else-->
        <!--          />-->
        <!--        </div>-->
        <div style="flex: 1; width: 100%">
          <a-row>
            <a-col span="5">
              <span
                style="
                  display: flex;
                  justify-content: left;
                  align-items: flex-start;
                  width: 250px;
                "
              >
                <a-cascader
                  :options="options"
                  v-model:value="selected"
                  placeholder="请选择模型"
                  @change="onChange"
                  style="width: 50%"
                  :bordered="false"
                  size="large"
                  :display-render="displayRender"
                >
                  <template #suffixIcon>
                    <DownOutlined />
                  </template>
                </a-cascader>
              </span>
            </a-col>

            <a-col span="19" style="margin-top: 18px">
              <div
                style="
                  height: 80vh;
                  overflow-y: auto;
                  overflow-x: hidden;
                  display: flex;
                  flex-direction: column;
                  align-items: stretch;
                  width: 100%;
                  margin-left: 3px;
                "
              >
                <div
                  style="
                    width: 100%;
                    margin: 0 auto 0 10px;
                    flex: 1;
                    /* 可选：加padding-bottom防止被Sender遮住 */
                  "
                >
                  <Bubble.List
                    :items="items"
                    :roles="roles"
                    :style="styles.holderNode"
                    v-if="messages.length === 0"
                  />
                  <Bubble.List
                    :items="items"
                    :roles="roles"
                    :style="styles.messages"
                    v-else
                  />
                  <!--              <template #content="{ item }">-->
                  <!--                <div-->
                  <!--                  class="markdown-body"-->
                  <!--                  v-html="renderMarkdown(item.content)"-->
                  <!--                /> </template-->
                  <!--            ></Bubble.List>-->
                </div>
                <div class="sender-wrapper">
                  <Prompts
                    :items="senderPromptsItems"
                    @item-click="onPromptsItemClick"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      width: 700px;
                      margin-bottom: 10px;
                    "
                  />

                  <!-- 🌟 输入框 -->
                  <Sender
                    :value="content"
                    :style="styles.sender"
                    :loading="agentRequestLoading"
                    @submit="onSubmit"
                    @change="(value:string) => (content = value)"
                  >
                    <template #prefix>
                      <Badge :dot="attachedFiles.length > 0 && !headerOpen">
                        <Button
                          type="text"
                          @click="() => (headerOpen = !headerOpen)"
                        >
                          <template #icon>
                            <PaperClipOutlined />
                          </template>
                        </Button>
                      </Badge>
                    </template>

                    <template #header>
                      <Sender.Header
                        title="Attachments"
                        :open="headerOpen"
                        :styles="{ content: { padding: 0 } }"
                        @open-change="(open:string) => (headerOpen = open)"
                      >
                        <Attachments
                          :before-upload="() => false"
                          :items="attachedFiles"
                          @change="handleFileChange"
                        >
                          <template #placeholder="type">
                            <Flex
                              v-if="type && type.type === 'inline'"
                              align="center"
                              justify="center"
                              vertical
                              gap="2"
                            >
                              <Typography.Text
                                style="font-size: 30px; line-height: 1"
                              >
                                <CloudUploadOutlined />
                              </Typography.Text>
                              <Typography.Title
                                :level="5"
                                style="
                                  margin: 0;
                                  font-size: 14px;
                                  line-height: 1.5;
                                "
                              >
                                Upload files
                              </Typography.Title>
                              <Typography.Text type="secondary">
                                Click or drag files to this area to upload
                              </Typography.Text>
                            </Flex>
                            <Typography.Text
                              v-if="type && type.type === 'drop'"
                            >
                              Drop file here
                            </Typography.Text>
                          </template>
                        </Attachments>
                      </Sender.Header>
                    </template>
                    <template
                      #actions="{
                        info: {
                          components: { SendButton, LoadingButton },
                        },
                      }"
                    >
                      <Tooltip
                        v-if="agentRequestLoading"
                        title="Click to cancel"
                      >
                        <component :is="LoadingButton" />
                      </Tooltip>
                      <Tooltip
                        v-else
                        :title="value ? 'Send \u21B5' : 'Please type something'"
                      >
                        <component
                          :is="SendButton"
                          type="text"
                          shape="default"
                          :icon="h(SendOutlined)"
                          :style="{ color: token.colorPrimary }"
                        />
                      </Tooltip>
                    </template>
                  </Sender>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 🌟 提示词 -->
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import type {
  AttachmentsProps,
  BubbleListProps,
  ConversationsProps,
  PromptsProps,
} from "ant-design-x-vue";
import { defineModel, reactive, VNode, watchEffect } from "vue";
import { defineOptions, nextTick } from "vue";
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
  DownOutlined,
  SyncOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import {
  Badge,
  Button,
  Flex,
  Space,
  Typography,
  theme,
  message,
  Tooltip,
} from "ant-design-vue";
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
} from "ant-design-x-vue";
import { computed, h, ref, watch } from "vue";
import markdownIt from "markdown-it";
import { katex } from "@mdit/plugin-katex";
import "katex/dist/katex.min.css";
import MarkdownIt from "markdown-it";
// 级联数据结构
const options = [
  {
    value: "openai",
    label: "OpenAI",
    children: [
      { value: "gpt-3.5", label: "GPT-3.5" },
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4", label: "GPT-4" },
    ],
  },
  {
    value: "anthropic",
    label: "Anthropic",
    children: [
      { value: "claude-2", label: "Claude 2" },
      { value: "claude-3", label: "Claude 3" },
    ],
  },
  {
    value: "deepseek",
    label: "Deepseek",
    children: [{ value: "deepseek-v3", label: "Deepseek-v3" }],
  },
  {
    value: "dashScope",
    label: "DashScope",
    children: [
      { value: "qwen-plus", label: "Qwen-plus" },
      { value: "qwen-max", label: "Qwen-max" },
    ],
  },
  {
    value: "bnu",
    label: "BNU 自研",
    children: [{ value: "neo", label: "Neo" }],
  },
];

const selected = ref(["DashScope", "Qwen-plus"]); // 比如 ['openai', 'gpt-4o']

// 选中时回调
function onChange(value: any, selectedOptions: any) {
  // value: ['openai', 'gpt-4o']
  // selectedOptions: [{...}, {...}]
  // 这里可以做业务处理，比如存后端或切换全局配置
  // console.log(value, selectedOptions)
}

// 展示文字
// const displaySelected = computed(() => {
//   if (!selected.value || selected.value.length === 0) return "未选择";
//   let pointer: any = options;
//   // return "selected";
//   return selected.value
//     .map((val) => {
//       const found = pointer.find((opt: any) => opt.value === val);
//       pointer = found?.children || [];
//       return found?.label || val;
//     })
//     .join(" / ");
// });

const md = new MarkdownIt({ linkify: true, typographer: true }).use(katex);

function renderMarkdown(text: string) {
  return md.render(text || "");
}

const [messageApi] = message.useMessage();

const { token } = theme.useToken();

const styles = computed(() => {
  return {
    layout: {
      width: "100%",
      "min-width": "1200px",
      height: "850px",
      "border-radius": `${token.value.borderRadius}px`,
      display: "flex",
      background: `${token.value.colorBgContainer}`,
      "font-family": `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    menu: {
      background: "white",
      width: "320px",
      height: "100%",
      display: "flex",
      "flex-direction": "column",
      borderRight: "2px solid #e4e4e4",
    },
    conversations: {
      padding: "0 12px",
      flex: 1,
      "overflow-y": "auto",
      backgroundColor: "white",
    },
    chat: {
      height: "87vh",
      width: "100%",
      margin: "0 auto",
      "box-sizing": "border-box",
      display: "flex",
      "flex-direction": "column",
      justifyContent: "center",
      alignItems: "center",
      padding: `${token.value.paddingLG}px`,
      gap: "16px",
    },
    holderNode: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "700px",
      flex: 1,
      "overflow-y": "hidden",
    },
    messages: {
      display: "flex",
      width: "700px",
      "overflow-y": "hidden",
    },
    placeholder: {
      "padding-top": "32px",
      "text-align": "left",
      flex: 1,
    },
    sender: {
      width: "700px",
      "box-shadow": token.value.boxShadow,
    },
    logo: {
      display: "flex",
      height: "72px",
      "align-items": "center",
      "justify-content": "start",
      padding: "0 24px",
      "box-sizing": "border-box",
    },
    "logo-img": {
      width: "24px",
      height: "24px",
      display: "inline-block",
    },
    "logo-span": {
      width: "100%",
      display: "inline-block",
      margin: "0 8px",
      "font-weight": "bold",
      color: token.value.colorText,
      textAlign: "left",
      "font-size": "16px",
    },
    addBtn: {
      background: "black",
      borderRadius: "8px",
      width: "calc(100% - 24px)",
      height: "36px",
      color: "white",
      margin: "0 12px 12px 12px",
    },
  } as const;
});

defineOptions({ name: "PlaygroundIndependentSetup" });

function renderTitle(icon: VNode, title: string) {
  return h(Space, { align: "start" }, [icon, h("span", title)]);
}

const defaultConversationsItems = [
  {
    key: "0",
    label: "What is Ant Design X?",
    icon: h(MessageOutlined),
  },
];

const placeholderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    label: renderTitle(
      h(FireOutlined, { style: { color: "#FF4D4F" } }),
      "Hot Topics"
    ),
    description: "What are you interested in?",
    children: [
      {
        key: "1-1",
        description: `What's new in X?`,
      },
      {
        key: "1-2",
        description: `What's AGI?`,
      },
      {
        key: "1-3",
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: "2",
    label: renderTitle(
      h(ReadOutlined, { style: { color: "#1890FF" } }),
      "Design Guide"
    ),
    description: "How to design a good product?",
    children: [
      {
        key: "2-1",
        icon: h(HeartOutlined),
        description: `Know the well`,
      },
      {
        key: "2-2",
        icon: h(SmileOutlined),
        description: `Set the AI role`,
      },
      {
        key: "2-3",
        icon: h(CommentOutlined),
        description: `Express the feeling`,
      },
    ],
  },
];

const senderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    description: "Hot Topics",
    icon: h(FireOutlined, { style: { color: "#FF4D4F" } }),
  },
  {
    key: "2",
    description: "Design Guide",
    icon: h(ReadOutlined, { style: { color: "#1890FF" } }),
  },
];

const roles: BubbleListProps["roles"] = {
  ai: {
    placement: "start",
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: "16px",
        backgroundColor: "white",
      },
    },
  },
  local: {
    placement: "end",
    styles: {
      content: {
        borderRadius: "18px",
        backgroundColor: "#ededed",
        minHeight: "0px",
        padding: "7px 18px",
      },
    },
  },
};

// ==================== State ====================
const headerOpen = ref(false);
const content = ref("");
const conversationsItems = ref(defaultConversationsItems);
const activeKey = ref(defaultConversationsItems[0].key);
const attachedFiles = ref<AttachmentsProps["items"]>([]);
const agentRequestLoading = ref(false);
const scrollArea = ref<HTMLDivElement | null>(null);
const displayRender = (labels: any, selectedOptions: any) => {
  console.log(labels.labels);
  console.log(labels[1]);
  return labels.labels[labels.labels.length - 1];
};
// const eventSource = new EventSource(
//   `http://localhost:8080/api/chat/stream-chat?message=${encodeURIComponent(
//     content.value
//   )}`
// );
//
// eventSource.onmessage = (event) => {
//   console.log("接收到片段:", event.data);
//   // 可以追加到页面的聊天记录中
// };
// ==================== Runtime ====================
// const [agent] = useXAgent({
//   request: async ({ message }, { onUpdate, onSuccess }) => {
//     let fullContent = "";
//     loading.value = true;
//     agentRequestLoading.value = true;
//     // 1. 发起 SSE 连接
//     onUpdate(" ");
//     if (message) {
//       const es = new EventSource(
//         `http://localhost:8080/api/chat/stream-chat?message=${encodeURIComponent(
//           message
//         )}`
//       );
//       es.onmessage = (event) => {
//         if (event.data === "[END]") {
//           agentRequestLoading.value = false;
//           es.close();
//           return;
//         }
//         loading.value = false;
//         // 2. 每收到一个片段，拼接并onUpdate
//         fullContent += event.data;
//         onUpdate(fullContent);
//         console.log(fullContent);
//       };
//       es.onerror = (e) => {
//         es.close();
//         onSuccess(fullContent); // 断线也收尾
//       };
//     }
//   },
// });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const [agent] = useXAgent({
  request: async ({ message }, { onSuccess, onUpdate }) => {
    agentRequestLoading.value = true;
    loading.value = true;
    onUpdate(" ");
    await sleep();
    const stream = [
      "欧拉公式是数学中一个非常著名且重要的公式，它将复数、指数函数和三角函数紧密联系在一起。欧拉公式的形式为：\n" +
        "\n" +
        "$$\n" +
        "e^{i\\theta} = \\cos\\theta +i\\sin\\theta\n" +
        "$$\n" +
        "\n" +
        "其中：\n" +
        "- $e$ 是自然对数的底（约等于 2.71828），\n" +
        "- $i$ 是虚数单位，满足 $i^2 =-1$，\n" +
        "- $\\theta$是任意实数，通常表示角度（以弧度为单位）。\n" +
        "\n" +
        "### 欧拉公式的推导\n" +
        "欧拉公式的推导基于泰勒级数展开。我们知道以下三个函数的泰勒展开式：\n" +
        "1.指数函数：$ e^x = 1+ x + \\frac{x^2}{2!}+ \\frac{x^3}{3!} + \\cdots $\n" +
        "2. 正弦函数：$\\sinx = x -\\frac{x^3}{3!} + \\frac{x^5}{5!} -\\cdots$\n" +
        "3. 余弦函数：$\\cos x = 1 - \\frac{x^2}{2!} +\\frac{x^4}{4!} - \\cdots$\n" +
        "\n" +
        "将 $e^{ix}$展开为泰勒级数：\n" +
        "$$\n" +
        "e^{ix} =1 + ix+ \\frac{(ix)^2}{2!} +\\frac{(ix)^3}{3!} + \\frac{(ix)^4}{4!} + \\cdots\n" +
        "$$\n" +
        "\n" +
        "注意到 $(ix)^n$ 的性质：\n" +
        "- 当 $n$ 是偶数时，$(ix)^n =(-1)^{n/2}x^n$（实数部分）。\n" +
        "- 当 $n$ 是奇数时，$(ix)^n =(-1)^{(n-1)/2}ix^n$（虚数部分）。\n" +
        "\n" +
        "因此可以将 $e^{ix}$ 分成实部和虚部：\n" +
        "$$\n" +
        "e^{ix} = (1- \\frac{x^2}{2!} + \\frac{x^4}{4!}- \\cdots) + i(x- \\frac{x^3}{3!} + \\frac{x^5}{5!}- \\cdots)\n" +
        "$$\n" +
        "\n" +
        "观察发现，实部正好是 $\\cosx$ 的泰勒展开式，虚部正好是$\\sin x$的泰勒展开式。因此我们得到：\n" +
        "$$\n" +
        "e^{ix}= \\cos x+ i\\sinx\n" +
        "$$\n" +
        "\n" +
        "### 欧拉公式的应用\n" +
        "1. **复数的极坐标表示**  \n" +
        "  复数$z = a+ bi$可以写成极坐标形式：$z = re^{i\\theta}$，其中 $r = |z|$ 是模长，$\\theta =\\arg(z)$是辐角。\n" +
        "\n" +
        "2. **三角函数的关系**  \n" +
        "  利用欧拉公式，可以推导出三角函数的恒等式。例如：\n" +
        "  $$\n" +
        "  \\cos\\theta = \\frac{e^{i\\theta} +e^{-i\\theta}}{2}, \\quad \\sin\\theta =\\frac{e^{i\\theta} - e^{-i\\theta}}{2i}\n" +
        "  $$\n" +
        "\n" +
        "3. **特殊值**  \n" +
        "  当$\\theta = \\pi$ 时，欧拉公式变为著名的 **欧拉恒等式**：\n" +
        "  $$\n" +
        "  e^{i\\pi}+ 1 =0\n" +
        " $$\n" +
        " 这个公式被认为是数学中最美丽的公式之一，因为它将五个重要的数学常数 $e,i, \\pi, 1,0$联系在了一起。\n" +
        "\n" +
        "4. **信号处理与傅里叶变换**  \n" +
        " 欧拉公式在信号处理、傅里叶分析等领域有广泛应用。它使得正弦和余弦波可以用复指数形式表示，从而简化了计算。\n" +
        "\n" +
        "总结来说，欧拉公式不仅是数学中的瑰宝，还在物理、工程、计算机科学等领域有着深远的影响。",
    ];
    // 假设你通过 fetch/EventSource 拿到流式片段
    // const s =
    //   "万有引力公式是由艾萨克·牛顿提出的，用来描述任意两个具有质量的物体之间的引力作用。这个公式是经典力学的重要组成部分，广泛应用于天文学、物理学和工程学等领域。\n" +
    //   "\n" +
    //   "### 公式表达\n" +
    //   "万有引力公式可以表示为：\n" +
    //   "$$\n" +
    //   "F = G\\cdot \\frac{m_1\\cdot m_2}{r^2}\n" +
    //   "$$\n" +
    //   "\n" +
    //   "其中：\n" +
    //   "- $F$ 是两个物体之间的引力大小（单位：牛顿，N）。\n" +
    //   "- $ G$ 是万有引力常数，其值约为 $6.674 \\times10^{-11} \\, \\text{N} \\cdot\\text{m}^2 /\\text{kg}^2 $。\n" +
    //   "- $ m_1 $ 和$ m_2$ 分别是两个物体的质量（单位：千克，kg）。\n" +
    //   "-$ r $ 是两个物体质心之间的距离（单位：米，m）。\n" +
    //   "\n" +
    //   "---\n" +
    //   "\n" +
    //   "###物理意义\n" +
    //   "1. **引力与质量成正比**：两个物体的质量越大，它们之间的引力越大。\n" +
    //   "2.**引力与距离平方成反比**：当两个物体之间的距离增大时，引力会迅速减小。具体来说，如果距离增加到原来的两倍，引力将减少到原来的四分之一。\n" +
    //   "3. **普遍适用性**：这个公式适用于任何两个具有质量的物体，无论它们是天体（如行星、恒星）还是日常物品（如苹果和地球）。\n" +
    //   "\n" +
    //   "---\n" +
    //   "\n" +
    //   "### 应用举例\n" +
    //   "1. **计算天体间的引力**：例如，地球对月球的引力可以通过该公式计算。\n" +
    //   "  -地球质量$ m_1= 5.97 \\times10^{24} \\, \\text{kg} $\n" +
    //   " - 月球质量 $ m_2 = 7.35 \\times 10^{22}\\, \\text{kg} $\n" +
    //   "  - 地球与月球的平均距离 $r = 3.84 \\times 10^8 \\,\\text{m} $\n" +
    //   "\n" +
    //   " 将这些值代入公式，可以计算出地球对月球的引力。\n" +
    //   "\n" +
    //   "2. **自由落体运动**：地面上的物体受到的重力也可以看作是地球对该物体的万有引力。在这种情况下，公式可以简化为 $ F =m \\cdot g$，其中 $g $ 是重力加速度。\n" +
    //   "\n" +
    //   "---\n" +
    //   "\n" +
    //   "### 注意事项\n" +
    //   "- 公式中的 $ r$ 是指两个物体的质心之间的距离。对于不规则形状的物体，需要考虑其质量分布。\n" +
    //   "- 在微观尺度下（如原子或亚原子粒子），万有引力的作用非常微弱，通常可以忽略不计，而电磁力或其他基本力起主导作用。\n" +
    //   "- 在极端条件下（如黑洞附近），牛顿的万有引力公式不再适用，需要用爱因斯坦的广义相对论来描述引力现象。\n" +
    //   "\n" +
    //   "希望这个介绍对你有所帮助！如果还有其他问题，请随时提问。";
    // const stream = [
    //   "余元公式是与**伽马函数**（Gamma 函数）相关的一个重要性质。伽马函数是阶乘的推广，定义为：\n" +
    //     "\n" +
    //     "$$\n" +
    //     "\\Gamma(z) =\\int_0^\\infty t^{z-1} e^{-t} \\, dt, \\quad \\text{其中 }\\Re(z)> 0.\n" +
    //     "$$\n" +
    //     "\n" +
    //     "伽马函数的一个非常重要的性质就是**余元公式**（Reflection Formula），也称为欧拉反射公式（Euler's Reflection Formula）。它的表达式为：\n" +
    //     "\n" +
    //     "$$\n" +
    //     "\\Gamma(z) \\Gamma(1-z) = \\frac{\\pi}{\\sin(\\pi z)}, \\quad z\\notin \\mathbb{Z}.\n" +
    //     "$$\n" +
    //     "\n" +
    //     "###公式的解释\n" +
    //     "1. **适用范围**：该公式对所有非整数复数$z$都成立。\n" +
    //     "2. **意义**：它将伽马函数在 $z$ 和 $1-z$处的值联系起来，揭示了伽马函数的对称性。\n" +
    //     "3. **特殊值**：当$z = \\frac{1}{2}$ 时，代入公式可以得到：\n" +
    //     "$$\n" +
    //     "\\Gamma\\left(\\frac{1}{2}\\right)\\Gamma\\left(1 - \\frac{1}{2}\\right)= \\Gamma\\left(\\frac{1}{2}\\right)^2 =\\frac{\\pi}{\\sin\\left(\\frac{\\pi}{2}\\right)} = \\pi.\n" +
    //     "$$\n" +
    //     "  因此，$\\Gamma\\left(\\frac{1}{2}\\right) =\\sqrt{\\pi}$。\n" +
    //     "\n" +
    //     "###推导思路\n" +
    //     "余元公式的推导需要用到复分析中的知识，尤其是**贝塔函数**（BetaFunction）和伽马函数的关系。以下是简要的推导过程：\n" +
    //     "\n" +
    //     "1. **贝塔函数的定义**：\n" +
    //     " 贝塔函数定义为：\n" +
    //     "  $$\n" +
    //     "  B(x, y)= \\int_0^1 t^{x-1} (1-t)^{y-1} \\,dt, \\quad\\text{其中} \\Re(x), \\Re(y) > 0.\n" +
    //     "  $$\n" +
    //     "\n" +
    //     "2. **贝塔函数与伽马函数的关系**：\n" +
    //     " 贝塔函数可以用伽马函数表示为：\n" +
    //     "  $$\n" +
    //     "  B(x, y) =\\frac{\\Gamma(x) \\Gamma(y)}{\\Gamma(x+y)}.\n" +
    //     "  $$\n" +
    //     "\n" +
    //     "3. **引入正弦函数**：\n" +
    //     "  利用复平面上的积分技巧（例如，考虑单位圆上的积分），可以证明：\n" +
    //     "  $$\n" +
    //     "  B(x, 1-x) = \\int_0^1t^{x-1} (1-t)^{-x} \\, dt= \\frac{\\pi}{\\sin(\\pi x)}.\n" +
    //     "  $$\n" +
    //     "\n" +
    //     "4. **结合伽马函数关系**：\n" +
    //     " 将贝塔函数与伽马函数的关系代入上式，得到：\n" +
    //     "  $$\n" +
    //     " \\frac{\\Gamma(x) \\Gamma(1-x)}{\\Gamma(1)} = \\frac{\\pi}{\\sin(\\pi x)}.\n" +
    //     "  $$\n" +
    //     "\n" +
    //     "  由于$\\Gamma(1) = 1$，最终得到余元公式：\n" +
    //     "  $$\n" +
    //     " \\Gamma(x)\\Gamma(1-x) = \\frac{\\pi}{\\sin(\\pix)}.\n" +
    //     " $$\n" +
    //     "\n" +
    //     "###应用\n" +
    //     "余元公式在数学和物理学中有广泛的应用，例如：\n" +
    //     "1. 计算特定值的伽马函数（如 $\\Gamma\\left(\\frac{1}{2}\\right)$）。\n" +
    //     "2. 在概率论中处理 Beta分布和 Gamma分布时的计算。\n" +
    //     "3.在解析数论中研究 Riemann Zeta函数的性质。\n" +
    //     "4. 在量子场论和弦理论中用于正则化技术。\n" +
    //     "\n" +
    //     "希望这个介绍对你有所帮助！如果有任何问题或需要更详细的推导，请随时提问！",
    // ];
    // const stream = [
    //   "<em>Streaming<em/>",
    //   "$123$",
    //   "$123123$",
    //   "instead ",
    //   "$123123$ ",
    //   "typing effect.",
    //   " ",
    //   "You typed: ",
    //   "<em>Streaming<em/>",
    //   "output ",
    //   "instead ",
    //   "of Bubble ",
    //   "typing effect.",
    //   " ",
    //   "You typed: ",
    //   "<em>Streaming<em/>",
    //   "output ",
    //   "\\[3323123123\\]",
    //   "instead ",
    //   "of Bubble ",
    //   "typing effect.",
    //   " ",
    //   "You typed: ",
    //   "<em>Streaming<em/>",
    //   "output ",
    //   "instead ",
    //   "of Bubble ",
    //   "typing effect.",
    //   " ",
    //   "You typed: ",
    //   message,
    // ];
    let currentContent = "";

    for (let chunk of stream) {
      loading.value = false;
      await new Promise((r) => setTimeout(r, 120)); // 模拟每块到达的延迟
      currentContent += chunk;
      onUpdate(currentContent); // 每次追加新内容
      console.log(currentContent);
    }
    agentRequestLoading.value = false;
    onSuccess(currentContent); // 最终回调
  },
});
const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
});

watch(
  activeKey,
  () => {
    if (activeKey.value !== undefined) {
      setMessages([]);
    }
  },
  { immediate: true }
);

// ==================== Event ====================

function fixMarkdown(mdStr: string) {
  // 标题 # 和内容之间补空格
  mdStr = mdStr.replace(/^(#+)([^\s#])/gm, "$1 $2");
  // #**内容 => # **内容
  mdStr = mdStr.replace(/^(#+)\*\*/gm, "$1 **");
  // 标题行尾多余#清理
  mdStr = mdStr.replace(/^(#+ .+?)#+\s*$/gm, "$1");
  // 也可以加别的fix规则

  // LaTeX公式格式修正
  mdStr = mdStr.replace(
    /\\\((.+?)\\\)/gs,
    (_, equation) => `$$${equation.trim()}$$`
  ); // 行内
  mdStr = mdStr.replace(
    /\\\[(.+?)\\\]/gs,
    (_, equation) => `$${equation.trim()}$`
  ); // 块级

  mdStr = mdStr.replace(
    /(?<!\$)\$\s*([^$\s][^$]*?)\s*\$(?!\$)/g,
    (_, equation) => `$${equation.trim()}$`
  );

  mdStr = mdStr.replace(
    /\\(sin|cos|tan|log|ln|exp|arcsin|arccos|arctan|sec|csc|cot|cdot|partial)([a-zA-Z0-9])/g,
    "\\$1 $2"
  );
  // mdStr = mdStr.replace(
  //   /\$\$\s*(.+?)\s*\$\$/g,
  //   (_, equation) => `$$${equation.trim()}$$`
  // );
  return mdStr;
}

function onSubmit(nextContent: string) {
  if (!nextContent) return;
  onRequest(nextContent);
  content.value = "";
}

const onPromptsItemClick: PromptsProps["onItemClick"] = (info) => {
  onRequest(info.data.description as string);
};

function onAddConversation() {
  conversationsItems.value = [
    ...conversationsItems.value,
    {
      key: `${conversationsItems.value.length}`,
      label: `New Conversation ${conversationsItems.value.length}`,
      icon: h(MessageOutlined),
    },
  ];
  activeKey.value = `${conversationsItems.value.length}`;
}

const onConversationClick: ConversationsProps["onActiveChange"] = (key) => {
  activeKey.value = key;
};

const handleFileChange: AttachmentsProps["onChange"] = (info) =>
  (attachedFiles.value = info.fileList);

// ==================== Nodes ====================
const placeholderNode = computed(() =>
  h(
    Space,
    { direction: "vertical", size: 16, style: styles.value.placeholder },
    [
      h(Welcome, {
        variant: "borderless",
        icon: "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
        title: "Hello, I'm Neo",
        description: h(
          "div",
          {
            style: {
              lineHeight: "1.6", // 行高拉高
              marginBottom: "16px", // 底部留白
              color: "#555", // 更柔和的灰色
            },
          },
          [
            h("div", {}, "An education QA Agent"),
            h("div", {}, "Powered by BNU's Self-Developed AI Model"),
            h(
              "div",
              {
                style: { fontWeight: "bold", marginTop: "8px", color: "#222" },
              },
              "Awakening starts with a single question."
            ),
          ]
        ),
        extra: h(Space, {}, [
          h(Button, { icon: h(ShareAltOutlined) }),
          h(Button, { icon: h(EllipsisOutlined) }),
        ]),
      }),
      h(Prompts, {
        title: "Do you want?",
        items: placeholderPromptsItems,
        styles: {
          list: {
            width: "100%",
            gap: "64px",
          },
          item: {
            flex: 1,
          },
        },
        onItemClick: onPromptsItemClick,
      }),
    ]
  )
);
const loading = ref(false);
const copyStatus = reactive<Record<any, boolean>>({});
const items = computed<BubbleListProps["items"]>(() => {
  if (messages.value.length === 0) {
    return [{ content: placeholderNode, variant: "borderless" }];
  }
  return messages.value.map(({ id, message: content, status }) => {
    copyStatus[id] = false;
    if (status.toString() != "local") {
      return {
        key: id,
        loading:
          loading.value &&
          status.toString() != "local" &&
          id == "msg_" + (messages.value.length - 1).toString(),
        role: status.toString() === "local" ? "local" : "ai",
        content: h("div", {
          class: "markdown-body",
          innerHTML: renderMarkdown(fixMarkdown(content)),
        }),
        footer: () =>
          h(Space, {}, [
            h(
              Button,
              {
                type: "text",
                size: "small",
                icon: h(copyStatus[id] ? CheckOutlined : CopyOutlined),
                onClick: () => {
                  navigator.clipboard.writeText(content);
                  // alert(copyStatus[id]);
                  copyStatus[id] = true;
                  // alert(copyStatus[id]);
                  setTimeout(() => (copyStatus[id] = false), 1500);
                },
              },
              "复制"
            ),
            h(
              Button,
              {
                type: "text",
                size: "small",
                icon: h(copyStatus[id] ? CheckOutlined : CopyOutlined),
                onClick: () => {
                  return;
                },
              },
              "复制"
            ),
          ]),
      };
    }
    return {
      key: id,
      loading: false,
      role: "local",
      content: h("div", {
        class: "markdown-body",
        innerHTML: content,
      }),
      footer: () =>
        h(Space, {}, [
          h(
            Button,
            {
              type: "text",
              size: "small",
              icon: h(copyStatus[id] ? CheckOutlined : CopyOutlined),
              onClick: () => {
                navigator.clipboard.writeText(content);
                // alert(copyStatus[id]);
                copyStatus[id] = true;
                // alert(copyStatus[id]);
                setTimeout(() => (copyStatus[id] = false), 1500);
              },
            },
            "复制"
          ),
          h(
            Button,
            {
              type: "text",
              size: "small",
              icon: h(EditOutlined),
              onClick: () => {
                // 编辑操作逻辑
              },
            },
            "编辑"
          ),
        ]),
    };
  });
  // return messages.value.map(({ id, message, status }) => ({
  //   key: id,
  //   loading:
  //     loading.value &&
  //     status.toString() != "local" &&
  //     id == "msg_" + (messages.value.length - 1).toString(),
  //   role: status.toString() === "local" ? "local" : "ai",
  //   content: h("div", {
  //     class: "markdown-body",
  //     innerHTML: renderMarkdown(fixMarkdown(message)),
  //   }),
  // }));
});

const visible = defineModel<boolean>("visible", { default: false });

const menuConfig: ConversationsProps["menu"] = (conversation) => ({
  items: [
    {
      label: "Operation 1",
      key: "operation1",
      icon: h(EditOutlined),
    },
    {
      label: "Operation 2",
      key: "operation2",
      icon: h(StopOutlined),
      disabled: true,
    },
    {
      label: "Operation 3",
      key: "operation3",
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: (menuInfo) => {
    messageApi.info(`Click ${conversation.key} - ${menuInfo.key}`);
  },
});

watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
    }
  }
);
</script>

<style>
.ai-chat-modal .ant-modal-content {
  padding: 0 !important;
  border-radius: 16px !important;
  overflow: hidden; /* 🔥 防止子元素溢出破坏圆角 */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3); /* 可选：让它更柔和 */
}

/* 让 modal-body 也不留白，并支持内容填满 */
.ai-chat-modal .ant-modal-body {
  padding: 0;
  height: 100%;
}

.ai-chat-modal .ant-modal {
  background-color: transparent !important;
  box-shadow: none !important;
}

.markdown-body p {
  display: inline-block;
  /* 或 display: inline; */
  width: auto;
  margin-bottom: 0;
  margin-top: 0;
  font-size: 16px;
}

.ant-select-selector:hover {
  background-color: #f5f5f5 !important; /* 或你喜欢的灰色 */
  transition: background 0.2s;
}

.ant-cascader-menu-item-content {
  display: flex;
  align-items: center;
  font-size: 1px;
  height: 40px;
}

.ant-cascader-menus .ant-cascader-menu {
  /* 你的样式 */
  border-radius: 8px;
  overflow: hidden;
  height: 260px;
}

.sender-wrapper {
  position: sticky;
  bottom: 0;
  background-color: #fff; /* 根据需要设置背景色 */
  padding: 10px;
}
</style>
