import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRouter,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import QueryQuestionByKnowledgeView from "@/views/QueryQuestionByKnowledgeView.vue";
import LoginView from "@/views/LoginView.vue";
import registerView from "@/views/RegisterView.vue";
import UploadQuestionView from "@/views/UploadQuestionView.vue";
import QuestionBucketView from "@/views/QuestionBucketView.vue";
import QueryQuestionByKeywordView from "@/views/QueryQuestionByKeywordView.vue";
import { isLoggedIn, requireLogin } from "@/api/auth";
import { useHeaderViewStore } from "@/stores/HeaderView";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/search/question/by/kp",
    name: "SearchQuestionByKp",
    component: QueryQuestionByKnowledgeView,
  },
  {
    path: "/search/question/by/keyword",
    name: "SearchQuestionByKeyword",
    component: QueryQuestionByKeywordView,
  },
  {
    path: "/register",
    name: "Register",
    component: registerView,
  },
  {
    path: "/upload/question",
    name: "UploadQuestion",
    component: UploadQuestionView,
  },
  {
    path: "/question/bucket",
    name: "QuestionBucket",
    component: QuestionBucketView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !requireLogin()) {
    next({
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
