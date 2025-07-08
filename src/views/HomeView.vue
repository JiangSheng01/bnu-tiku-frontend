<template>
  <div class="home-content">
    <div class="banner">
      <!-- 背景主图，可替换为任意封面 -->
      <!-- 前景玻璃盒子 -->
      <a-col>
        <a-row
          style="display: flex; justify-content: center; align-items: center"
        >
          <div class="glass-box-search">
            <!-- Logo + 系统名 -->
            <div class="logo-block">
              <img
                src="../assets/hsaBNU-full.png"
                alt="logo"
                class="logo-img"
                draggable="false"
              />
              <span class="logo-text">智慧题库</span>
            </div>
            <div class="all-actions">
              <a-row
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <a-col span="17">
                  <div class="email-register-box">
                    <a-input
                      v-model:value="email"
                      placeholder="请输入邮箱"
                      size="large"
                      class="register-input"
                      @search="onSearch"
                    />
                    <a-button class="register-button" @click="registerShow">
                      注册
                    </a-button>
                  </div>
                </a-col>
                <a-col span="1"></a-col>
                <a-col span="6">
                  <a-button
                    class="enter-question-select"
                    @click="enterSelectPage"
                  >
                    <!--                    进入选题页-->
                    进入题库
                  </a-button>
                </a-col>
              </a-row>
            </div>
            <!-- 大号搜索框 -->
          </div>
        </a-row>
        <a-row style="display: flex; justify-content: center">
          <!--          <div class="glass-box-video">-->
          <!--            <img src="../assets/front-page-img.png" alt="智慧题库封面" />-->
          <!-- 使用 public 目录下的视频 -->
          <div class="glass-box">
            <video
              src="../assets/tiku_video.mp4"
              controls
              controlslist="nodownload noplaybackrate"
              class="glass-box-video"
            >
              > 你的浏览器不支持 Video 标签。
            </video>
          </div>
          <!-- 
                如果你把视频放在 src/assets 下，可以这样使用：
                (需要先在 <script> 部分导入)
                <video :src="videoSrcFromAssets" controls width="600"></video>
              -->
          <!--          </div>-->
        </a-row>
      </a-col>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import "vue3-video-play/dist/style.css";
import { createRouter, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { syncUserFromServer } from "@/api/user";
const router = useRouter();
const userStore = useUserStore();
const { token, showLogin, selectedKey, email, userInfo } =
  storeToRefs(userStore);
console.log("home user info is " + userInfo.value);
// 搜索关键词
const query = ref("");
function onSearch(value: string) {
  if (!value) {
    message.warning("请输入关键词");

    return;
  }
  // TODO: 路由跳转或接口请求
  console.log("搜索关键字 =>", value);
}
// alert(userStore.userInfo?.userAccount);
function enterSelectPage() {
  router.push({ path: "/search/question/by/kp" });
  // alert(userStore.userInfo?.userAccount);
}

function registerShow() {
  showLogin.value = true;
  selectedKey.value = "register";
  // alert(email.value);
}
</script>

<style scoped>
/* 页面整体：把背景扩展到整屏 */
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-content {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;

  /* 铺满整屏的银杏叶背景 */
  background-image: url("../assets/front-page-no-char.png");
  background-size: cover; /* 按比例铺满 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat;
  background-attachment: fixed; /* 页面滚动时背景不跟随，增强视觉层次 */
}

/* Banner 容器，承载 front-page-img.png */

/* 玻璃拟态搜索盒子：覆盖在 front-page-img.png 上方 */
.glass-box-search {
  margin-top: 20vh;
  margin-bottom: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-width: 42%;
  padding: 3rem 2rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
}

.glass-box {
  width: 70%;
  padding: 1.25rem 1.25rem 0 1.25rem;
  border-radius: 1.25rem 1.25rem 0 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
}

.glass-box-video {
  width: 100%;
  border-radius: 0.75rem 0.75rem 0 0;
}

/* Logo 样式 */
.logo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.logo-img {
  height: 7.5rem;
  width: auto;
}
.logo-text {
  font-size: 2rem;
  font-weight: 600;
  color: #3e3e3e;
  font-family: 幼圆;
  letter-spacing: 0.03em;
}

.search-input .ant-input-group-addon .ant-btn {
  padding: 0 2rem;
}
.banner .glass-box-video img {
  width: 100%;
  border-radius: 0.75rem 0.75rem 0 0;
}
.email-register-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.5rem;
  padding: 3px;
}
.register-input {
  margin-right: 3px;
  height: 48px;
  border: none;
}
.register-button {
  height: 48px;
  width: 300px;
  background-color: #1a7f37;
  color: white;
  font-size: 16px;
}
.enter-question-select {
  background-color: #0d1117;
  color: white;
  height: 54px;
  border-radius: 0.5rem;
  border: 3px solid #ffffff;
  width: 100%;
  font-size: 16px;
  word-wrap: normal;
}
.all-actions {
  width: 75%;
}

.ant-input:focus,
.ant-input-focused {
  border: 1px solid #4096ff;
  border-inline-end-width: 1px;
  outline: 0;
}

.register-button:not(:disabled):active {
  color: white;
}

.register-button:not(:disabled):hover {
  color: white;
  border-color: #116329;
  box-shadow: none;
  background-color: #116329;
}

.enter-question-select:not(:disabled):active {
  color: white;
  box-shadow: none;
}

.enter-question-select:not(:disabled):focus {
  color: white;
  box-shadow: none;
}

.enter-question-select:not(:disabled):hover {
  color: white;
  box-shadow: none;
  background-color: #0d1117;
  border: 3px solid gray;
}
</style>
