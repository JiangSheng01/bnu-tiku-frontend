<template>
  <div class="rich-editor-container">
    <!-- 编辑框，用内容可控的 input 或 contenteditable 实现 -->
    <div
      ref="editor"
      class="diff-edit-box"
      contenteditable="true"
      @input="onInput"
      @compositionstart="isComposing = true"
      @compositionend="onCompositionEnd"
      @keydown="onKeydown"
      style="min-height: 120px; border: 1px solid #ccc; padding: 10px"
      @blur="computeFinalText"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  ref,
  toRefs,
  watchEffect,
} from "vue";
import DiffMatchPatch from "diff-match-patch";
const props = defineProps<{
  text: string;
}>();
let index = 0;
let { text } = toRefs(props);
// text.value = "1";
const history: string[] = [text.value];
// console.log(origin.value.text);
// watchEffect(() => {
//   console.log(origin.value.text);
// });

const editor = ref<HTMLElement>();
const dmp = new DiffMatchPatch();
const isComposing = ref(false);

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

onMounted(() => {
  editor.value!.innerText = html2text(text.value);
  editor.value!.innerHTML = text.value; // 初始黑字
});

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

// function applyDiff(currentHtml: string) {
//   const plain = html2text(currentHtml); // 把当前内容也转纯文本
//   const htmlDiff = diffHighlight(plain); // 用 diff-match-patch
//
//   // 再把 diff 结果“映射回 html”：
//   //   - 换行用 <br>
//   //   - 图片占位 "[图片]" 用原 <img …> 标签
//   const merged = restoreTags(htmlDiff, currentHtml);
//   editor.value!.innerHTML = merged;
//   restoreCaret(editor.value!, savedPos);
// }

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
// text.value = "123";
function computeFinalText() {
  // text.value = "123";
  // alert(text.value);
  // alert(editor.value!.innerHTML);
  // alert(text.value == editor.value!.innerHTML);
  emit("sendCorrections", {
    correction: editor
      .value!.innerHTML.replace(/<span\b[^>]*>/gi, "")
      .replace(/<\/span>/gi, ""),
  });
}
</script>

<style scoped>
.rich-editor-container {
  max-height: 250px;
  overflow: auto;
}
</style>
