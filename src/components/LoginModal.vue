<template>
  <a-modal
    v-model:open="visible"
    title=""
    :footer="null"
    :width="800"
    centered
    :maskClosable="false"
  >
    <a-row :gutter="0">
      <!-- 左侧二维码区域 -->
      <a-col :span="8" class="qr-section">
        <div class="qr-container">
          <img src="../assets/bnuai_logo.png" alt="扫码登录" class="qr-image" />
        </div>
      </a-col>

      <!-- 中间灰色分隔线 -->
      <a-col :span="2" class="divider-col">
        <div class="divider"></div>
      </a-col>

      <!-- 右侧登录表单 -->
      <a-col :span="14" class="form-section">
        <a-form @submit="onLogin" layout="vertical">
          <a-form-item>
            <a-row>
              <a-col :span="11"
                ><div style="text-align: right" class="form-tip">
                  登录
                </div></a-col
              >
              <a-col :span="2" class="divider-col">
                <div
                  style="height: 20px; margin-bottom: 16px"
                  class="divider"
                ></div>
              </a-col>
              <a-col :span="11"
                ><div style="text-align: left" class="form-tip">
                  注册
                </div></a-col
              >
            </a-row>
            <a-input
              style="
                border-bottom: 0;
                box-shadow: none;
                height: 40px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-color: #d8d8d8;
              "
              v-model:value="username"
              placeholder="请输入账号"
            >
              <template #prefix
                ><span style="margin-right: 8px; margin-left: 8px"
                  >账号</span
                ></template
              >
            </a-input>
            <a-input
              v-model:value="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              style="
                box-shadow: none;
                height: 40px;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-color: #d8d8d8;
              "
            >
              <template #prefix
                ><span style="margin-right: 8px; margin-left: 8px"
                  >密码</span
                ></template
              >
              <template #suffix>
                <span @click="toggle" style="cursor: pointer; color: #1890ff">
                  <EyeOutlined v-if="showPassword" />
                  <EyeInvisibleOutlined v-else />
                </span>
                <span>忘记密码？</span>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row>
              <a-col :span="12"
                ><a-button style="width: 94%; height: 40px"
                  >注册</a-button
                ></a-col
              >
              <a-col :span="12"
                ><a-button
                  type="primary"
                  @click="onLogin"
                  style="width: 94%; height: 40px"
                  >登录</a-button
                ></a-col
              >
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineModel, h } from "vue";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons-vue";
import bnuAiImage from "../../public/bnuai_logo.png";

const visible = defineModel<boolean>("visible", { default: false });
const username = ref("");
const password = ref("");
const qrCodeUrl = ref(
  "https://img2.baidu.com/it/u=2516570002,1967194860&fm=253&fmt=auto&app=138&f=GIF?w=300&h=300"
); // 替换为实际的二维码图片地址
const showPassword = ref(false);
const toggle = () => (showPassword.value = !showPassword.value);
function onLogin() {
  console.log("登录信息：", username.value, password.value);
  // 在此处添加登录逻辑
}
const psVisible = ref(false);
</script>

<style scoped>
.qr-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.qr-container {
  text-align: center;
}

.qr-image {
  margin-top: 8px;
  width: 200px;
  height: 160px;
}

.divider-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider {
  width: 1px;
  height: 200px;
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
</style>
