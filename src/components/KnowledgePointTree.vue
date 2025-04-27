<template>
  <div class="tree-scroll-container">
    <a-tree
      :tree-data="treeData"
      show-icon
      v-model:selectedKeys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      @select="onSelect"
    >
      <template #switcherIcon="{ expanded }">
        <component :is="expanded ? DownOutlined : RightOutlined" />
      </template>
      <template #smile>
        <smile-outlined />
      </template>
      <template #meh>
        <smile-outlined />
      </template>
    </a-tree>
  </div>
</template>
<script setup lang="ts">
import {
  DownOutlined,
  SmileOutlined,
  RightOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import treeData from "@/Data/TreeData";
import axios from "axios";
import { defineEmits } from "vue";

let selectedKeys = ref([]);
let expandedKeys = ref([
  "0-0",
  "0-1",
  "0-2",
  "0-3",
  "0-4",
  "0-5",
  "0-6",
  "0-7",
  "0-8",
  "0-9",
  "0-10",
  "0-11",
]);
const emit = defineEmits(["send"]);
const onSelect = async (selectedKeys: any, info: any) => {
  emit("send", { resultData: null, selectedKey: null, loading: true });
  if (!info.selected) return;
  const kpName = info.node.title;
  try {
    const res = await axios.get(
      `http://localhost:8080/question/search/kp/${encodeURIComponent(
        kpName
      )}/${encodeURIComponent(1)}/${encodeURIComponent(10)}`
    );
    console.log(`📘 查询知识点「${kpName}」返回结果:`, res.data);
    emit("send", { resultData: res.data, selectedKey: kpName, loading: false });
  } catch (err) {
    console.error("❌ 查询失败:", err);
    emit("send", { resultData: null, selectedKey: null, loading: false });
  }
};
</script>
<style scoped>
.tree-scroll-container {
  max-height: 770px;
  height: 770px;
  width: 300px;
  overflow-y: auto;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
  background-color: white;
  box-shadow: 7px 7px 4px rgba(112, 112, 112, 0.5);
}
</style>
