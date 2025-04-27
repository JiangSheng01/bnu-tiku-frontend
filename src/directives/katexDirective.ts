import katex from "katex";

export default {
  mounted(el: HTMLElement) {
    renderKatex(el);
  },
};

function renderKatex(el: HTMLElement) {
  const text = el.innerText;
  const html = text.replace(/\${1,2}(.+?)\${1,2}/g, (_, math) => {
    return katex.renderToString(math, {
      throwOnError: false,
      output: "mathml",
    });
  });
  el.innerHTML = html;
}
