<template>
  <div class="rich-editor-container">
    <!-- MathType 工具栏 -->
    <div id="mathtype-toolbar" class="mathtype-toolbar" v-if="!readonly"></div>
    <!-- 编辑框 -->
    <div
      ref="editor"
      class="diff-edit-box"
      :class="{ readonly: readonly }"
      :contenteditable="!readonly"
      @input="onInput"
      @compositionstart="isComposing = true"
      @compositionend="onCompositionEnd"
      @keydown="onKeydown"
      @blur="computeFinalText"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  nextTick,
} from "vue";
import DiffMatchPatch from "diff-match-patch";

// 类型声明扩展
declare global {
  interface Window {
    WirisPlugin?: {
      GenericIntegration: new (properties: any) => any;
      Parser: {
        initParse: (html: string) => string;
        endParse: (html: string) => string;
      };
      currentInstance?: any;
    };
  }
}

// 动态导入 MathType
const loadMathType = async (): Promise<void> => {
  // 动态加载 MathType 脚本
  if (typeof window !== "undefined" && !window.WirisPlugin) {
    try {
      await import("@wiris/mathtype-generic/wirisplugin-generic");
    } catch (error) {
      console.error("Failed to load MathType:", error);
    }
  }
};

const props = defineProps<{
  text: string;
  readonly?: boolean;
}>();
let index = 0;
let { text } = toRefs(props);
// text.value = "1";
const history: string[] = [text.value];

const editor = ref<HTMLElement>();
const dmp = new DiffMatchPatch();
const isComposing = ref(false);
let mathTypeInstance: any = null;

// alert(originHtml);
// 纯文本（标签→占位或删除）
function html2text(html: string) {
  // 1) <br> → \n
  // 2) <img>、<video> 等 → 空字符 or 占位符 “[图片]”
  // 3) 其它标签去掉，只留 innerText
  const tmp = document.createElement("div");
  tmp.innerHTML = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<img[^>]*>/gi, "[图片]");
  return tmp.innerText;
}

onMounted(async () => {
  // 步骤 1: 确保 MathType 脚本已加载
  await loadMathType();

  // 步骤 2: 等待 DOM 渲染完成，确保 editor.value 可用
  await nextTick();

  if (!editor.value) {
    console.error("编辑器元素未找到，初始化失败。");
    return;
  }

  // MathML → 可视化的 <img> 公式。
  let finalHtmlToRender = text.value;
  if (window.WirisPlugin?.Parser) {
    try {
      finalHtmlToRender = window.WirisPlugin.Parser.initParse(text.value);
    } catch (e) {
      console.warn("MathType initParse 失败，将使用原始内容。", e);
    }
  }

  // 步骤 4: 将 initParse 完全处理后的 HTML 设置到编辑器中。
  // 此时 finalHtmlToRender 应该已经包含了 <img> 标签。
  editor.value.innerHTML = finalHtmlToRender;
  // 步骤 5: 初始化 MathType 实例，主要是为了加载工具栏。
  if (!props.readonly) {
    initMathType();
  }
  // initMathType();

  applyDiff();
});

// 在 onUnmounted 中添加清理
onUnmounted(() => {
  // 清理 MathType 实例
  if (mathTypeInstance) {
    try {
      if (
        mathTypeInstance.modalDialog &&
        typeof mathTypeInstance.modalDialog.close === "function"
      ) {
        mathTypeInstance.modalDialog.close();
      }
    } catch (error) {
      console.warn("清理 MathType 实例时出错:", error);
    }
  }

  // 清理所有 MathType 相关的 DOM 元素
  const mathTypeElements = document.querySelectorAll(
    ".wrs_modal, [data-title='MathType'], [data-title='ChemType']"
  );
  mathTypeElements.forEach((element) => {
    element.remove();
  });
});

// 添加一个暴露给父组件的方法来关闭 MathType 弹窗
const closeMathType = () => {
  if (mathTypeInstance && mathTypeInstance.modalDialog) {
    try {
      mathTypeInstance.modalDialog.close();
    } catch (error) {
      console.warn("关闭 MathType 弹窗失败:", error);
    }
  }
};

// 暴露方法给父组件
defineExpose({
  closeMathType,
});

// 初始化 MathType
const initMathType = () => {
  if (!window.WirisPlugin || !editor.value) return;

  try {
    const toolbarDiv = document.getElementById("mathtype-toolbar");
    if (toolbarDiv) {
      toolbarDiv.innerHTML = ""; // 清空，防止重复
    }
    // 使用 GenericIntegration
    const genericIntegrationProperties = {
      target: editor.value,
      toolbar: toolbarDiv,
      integrationParameters: {
        editorParameters: {
          language: "zh",
          // 确保公式样式与页面一致
          fontFamily: window.getComputedStyle(editor.value).fontFamily,
          fontSize: window.getComputedStyle(editor.value).fontSize,
        },
      },
    };
    mathTypeInstance = new window.WirisPlugin.GenericIntegration(
      genericIntegrationProperties
    );
    mathTypeInstance.init();
    mathTypeInstance.listeners.fire("onTargetReady", {});

    window.WirisPlugin.currentInstance = mathTypeInstance;

    console.log("MathType initialized successfully");
  } catch (error) {
    console.error("Failed to initialize MathType:", error);
  }
};

function diffHighlight(newText: string) {
  const diffs = dmp.diff_main(html2text(text.value), newText);
  // dmp.diff_cleanupSemantic(diffs); // 可选：让 diff 更干净

  return diffs
    .map(([op, data]) => {
      if (op === 1) return `<span style="color:red">${escapeHtml(data)}</span>`; // 新增
      if (op === 0) return escapeHtml(data); // 未改
      /* op === -1 代表删除，直接丢弃或改成删除线都行 */
      return "";
    })
    .join("");
}

/* 把 < > & 做 XML 实体转义，避免破坏 HTML */
function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function onCompositionEnd() {
  isComposing.value = false;
  applyDiff();
  pushHistory(editor.value!.innerHTML);
}

function applyDiff() {
  const el = editor.value!;
  const caret = saveCaret(el); // ① 保存光标
  const plain = html2text(el.innerHTML);
  const html = diffHighlight(plain);
  const merged = restoreTags(html, el.innerHTML);
  // alert(html);
  // alert(text.value);
  el.innerHTML = merged; // ② 更新高亮
  restoreCaret(el, caret); // ③ 还原光标
}

function onInput() {
  if (isComposing.value) return;
  const html = editor.value!.innerHTML;
  applyDiff();
  pushHistory(editor.value!.innerHTML);
}

function saveCaret(container: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;

  const range = sel.getRangeAt(0).cloneRange();
  const pre = range.cloneRange();
  pre.selectNodeContents(container);
  pre.setEnd(range.startContainer, range.startOffset);
  return pre.toString().length; // 光标在纯文本中的偏移
}

function restoreCaret(container: HTMLElement, pos: number) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let idx = 0,
    node: Node | null = null;

  while ((node = walker.nextNode())) {
    const next = idx + node.textContent!.length;
    if (pos <= next) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(node, pos - idx);
      range.collapse(true);
      sel!.removeAllRanges();
      sel!.addRange(range);
      return;
    }
    idx = next;
  }
}

function pushHistory(txt: string) {
  // 若回退后又输入新内容，要截掉 redo 段
  if (index < history.length - 1) history.splice(index + 1);
  history.push(txt);
  index = history.length - 1;
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && !e.shiftKey && e.key === "z") {
    // Ctrl+Z
    e.preventDefault();
    if (index > 0) {
      index--;
      editor.value!.innerHTML = history[index];
      applyDiff();
    }
  } else if (
    (e.ctrlKey && e.key === "y") ||
    (e.ctrlKey && e.shiftKey && e.key === "Z")
  ) {
    // Ctrl+Y 或 Ctrl+Shift+Z
    e.preventDefault();
    if (index < history.length - 1) {
      index++;
      editor.value!.innerHTML = history[index];
      applyDiff();
    }
  }
}

function restoreTags(diffHtml: string, currentHtml: string) {
  // 1. 图片占位复原
  const imgs = [...currentHtml.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  let i = 0;
  let restored = diffHtml.replace(/\[图片\]/g, () => imgs[i++] || "[图片]");

  // 2. 换行 \n -> <br>
  restored = restored.replace(/\n/g, "<br>");

  return restored;
}

const emit = defineEmits(["sendCorrections"]);

function computeFinalText() {
  if (!editor.value) return; // 防止 editor 为 null
  let finalContent = editor.value.innerHTML
    .replace(/<span\b[^>]*>/gi, "")
    .replace(/<\/span>/gi, "");

  // 将 MathType 图片转换回 MathML
  if (window.WirisPlugin && window.WirisPlugin.Parser) {
    finalContent = window.WirisPlugin.Parser.endParse(finalContent);
  }
  // finalContent = finalContent.replace(/<br\s*\/?>/gi, "\n");
  emit("sendCorrections", {
    correction: finalContent,
  });
}
</script>

<style scoped>
.rich-editor-container {
  max-height: 300px;
  overflow: auto;
}
.diff-edit-box.readonly {
  user-select: none; /* 禁止文本选择 */
  pointer-events: none; /* 禁用所有鼠标事件 */
  border: none; /* 移除边框 */
  padding: 10px; /* 保持内边距 */
}
.mathtype-toolbar {
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px 4px 0 0;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.diff-edit-box {
  min-height: 120px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 0 0 4px 4px !important;
}

/* MathType 按钮样式 */
:deep(.wrs_toolbar) {
  display: flex;
  gap: 8px;
}

:deep(.wrs_toolbar img) {
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

:deep(.wrs_toolbar img:hover) {
  background-color: #e6f7ff;
}

/* 确保数学公式的样式与页面一致 */
:deep(.Wirisformula) {
  vertical-align: middle;
  max-width: none;
}
</style>
