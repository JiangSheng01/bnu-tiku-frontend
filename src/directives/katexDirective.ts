import katex from "katex";

export default {
  mounted(el: HTMLElement) {
    renderKatex(el);
  },
};

function renderKatex(el: HTMLElement) {
  let text = el.innerText;

  // 替换所有$$...$$块为渲染公式，公式内容先去除所有html标签
  text = text.replace(/\$\$(.+?)\$\$/gs, (_, math) => {
    // 去掉公式内容中的HTML标签
    const cleanMath = math.replace(/<[^>]+>/g, "");
    return katex.renderToString(cleanMath, {
      throwOnError: false,
      output: "mathml",
    });
  });

  el.innerHTML = text;
}
