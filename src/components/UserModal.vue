<template>
  <a-modal
    v-model:open="visible"
    title=""
    :footer="null"
    :width="800"
    centered
    :maskClosable="false"
  >
    <a-col>
      <a-row :gutter="0">
        <!-- 左侧二维码区域 -->
        <a-col :span="8" class="qr-section">
          <div class="qr-container">
            <img
              src="../assets/qr_code_sample.png"
              alt="扫码登录"
              class="qr-image"
            />
          </div>
        </a-col>

        <!-- 中间灰色分隔线 -->
        <a-col :span="2" class="divider-col" v-show="selectedKey == 'login'">
          <div class="divider"></div>
        </a-col>

        <a-col :span="2" class="divider-col" v-show="selectedKey == 'register'">
          <div class="long-divider"></div>
        </a-col>

        <!-- 右侧登录表单 -->
        <a-col :span="14" class="form-section">
          <a-form @submit="onLogin" layout="vertical">
            <a-form-item>
              <a-row>
                <a-col :span="11"
                  ><div
                    style="text-align: right"
                    class="form-tip"
                    @click="selectKey(loginSign)"
                  >
                    <span v-show="selectedKey == loginSign"
                      ><a style="color: #4fa5d9">登录</a></span
                    >
                    <span v-show="selectedKey != loginSign"
                      ><a style="color: black">登录</a></span
                    >
                  </div></a-col
                >
                <a-col :span="2" class="divider-col">
                  <div
                    style="height: 20px; margin-bottom: 16px"
                    class="divider"
                  ></div>
                </a-col>
                <a-col :span="11"
                  ><div
                    style="text-align: left"
                    class="form-tip"
                    @click="selectKey(registerSign)"
                  >
                    <span v-show="selectedKey == registerSign"
                      ><a style="color: #4fa5d9">注册</a></span
                    >
                    <span v-show="selectedKey != registerSign"
                      ><a style="color: black">注册</a></span
                    >
                  </div></a-col
                >
              </a-row>
              <UserLoginForm
                v-if="selectedKey == loginSign"
                @send-visible="receiveVisible"
                @change-to-register="receiveRegisterSign"
              />
              <UserRegisterForm
                v-if="selectedKey == registerSign"
                @change-to-login="receiveLoginSign"
              />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-row>
        <div class="modal-tip">
          Backend Powered by Spring Boot
          <!--          <a href="https://github.com/Colentine/bnu_tiku_backend"-->
          <!--            ><GithubOutlined style="margin-left: 6px; margin-bottom: 3px"-->
          <!--          /></a>-->
        </div>
      </a-row>
    </a-col>
  </a-modal>
</template>

<script setup lang="ts">
import { GithubOutlined } from "@ant-design/icons-vue";
import { defineModel, ref, watch } from "vue";
import UserLoginForm from "@/components/UserLoginForm.vue";
import UserRegisterForm from "@/components/UserRegisterForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useHeaderViewStore } from "@/stores/HeaderView";
const visible = defineModel<boolean>("visible", { default: false });
// const selectedKey = ref("login");
const userStore = useUserStore();
const headerViewStore = useHeaderViewStore();
const { selectedKey, email } = storeToRefs(userStore);
const { selectedKeys } = storeToRefs(headerViewStore);
const loginSign = "login";
const registerSign = "register";
const selectKey = (key: string) => {
  selectedKey.value = key;
};
const receiveVisible = (res: any) => {
  visible.value = res.visible;
};
const receiveLoginSign = (res: any) => {
  selectedKey.value = res.key;
};
const receiveRegisterSign = (res: any) => {
  selectedKey.value = res.key;
};
watch(visible, (newVal, oldVal) => {
  if (!newVal) {
    email.value = "";
    selectedKeys.value = [];
  }
});

watch(selectedKey, (newVal, oldVal) => {
  if (newVal == "login") {
    email.value = "";
  }
});
</script>

<style scoped>
.qr-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-container {
  text-align: center;
}

.qr-image {
  margin-top: 8px;
  width: 190px;
  height: 190px;
}

.divider-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider {
  width: 1px;
  height: 240px;
  background-color: #e0e0e0;
}

.long-divider {
  width: 1px;
  height: 320px;
  background-color: #e0e0e0;
}

.form-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
.form-tip {
  color: #3c3c3c;
  font-size: 18px;
  text-align: center;
  margin-bottom: 16px;
}
.modal-tip {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #acacac;
}
</style>
