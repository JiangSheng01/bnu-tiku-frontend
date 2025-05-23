import katex from "katex";

export default {
  mounted(el: HTMLElement) {
    renderKatex(el);
  },
};

function renderKatex(el: HTMLElement) {
  let text = el.innerText;

  // 先替换 $$...$$ 块级公式
  text = text.replace(/\$\$(.+?)\$\$/gs, (_, math) => {
    return `${katex.renderToString(math, {
      throwOnError: false,
      output: "mathml",
    })}`;
  });

  // // 再替换 $...$ 行内公式
  // text = text.replace(/\$(.+?)\$/g, (_, math) => {
  //   return `<span class="inline-math">${katex.renderToString(math, {
  //     throwOnError: false,
  //     output: "mathml",
  //   })}</span>`;
  // });

  el.innerHTML = text;
}
