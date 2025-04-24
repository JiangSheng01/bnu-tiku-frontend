import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import katexDirective from "./directives/katexDirective";
const app = createApp(App);
app.use(router).use(Antd).mount("#app");
app.directive("katex", katexDirective);
