import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QueryQuestionByKnowledgeView from "@/views/QueryQuestionByKnowledgeView.vue";
import LoginView from "@/views/LoginView.vue";
import registerView from "@/views/RegisterView.vue";
import UploadQuestionView from "@/views/UploadQuestionView.vue";
import QuestionBucketView from "@/views/QuestionBucketView.vue";
import QueryQuestionByKeywordView from "@/views/QueryQuestionByKeywordView.vue";

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
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
