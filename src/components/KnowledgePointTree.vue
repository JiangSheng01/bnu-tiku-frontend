<template>
  <div class="side">
    <div class="search-box">
      <a-input-search
        v-model:value="searchBoxText"
        placeholder="搜索知识点"
        style="width: 260px"
        @search="onSearch"
      >
        <template #suffix v-if="!notSearchKp">
          <a-tooltip>
            <CloseCircleOutlined @click="onClikedClosedSearchKp" />
          </a-tooltip>
        </template>
      </a-input-search>
    </div>
    <div class="tree-scroll-container">
      <div v-if="notSearchKp">
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
      <div v-else>
        <div v-for="(item, index) in searchResult" :key="index">
          <a-button
            type="link"
            style="
              font-size: 14px;
              margin-bottom: 4px;
              color: black;
              border-left: #717171 dashed 1px;
              border-radius: 0;
            "
            @click="onSearchQuestion(item.name)"
          >
            <SmileOutlined /> {{ item.name }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  DownOutlined,
  SmileOutlined,
  RightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { ref, watch, watchEffect } from "vue";
import { debounce } from "lodash";
import treeData from "@/Data/TreeData";
import axios, { CancelTokenSource } from "axios";
import { defineEmits } from "vue";
import { getQuestionsByKp } from "@/api/question";
let searchBoxText = ref("");
let selectedKeys = ref([]);
let searchResult = ref();
let notSearchKp = ref(true);
let cancelTokenSource: CancelTokenSource | null = null;
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
  if (!info.selected) {
    emit("send", { resultData: null, selectedKey: null, loading: false });
    return;
  }
  const kpName = info.node.title;
  try {
    const res = await axios.get(
      `http://localhost:8080/api/question/search/kp/${encodeURIComponent(
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

const onSearch = async (q: any) => {
  q = q.trim();
  if (!q) {
    searchResult.value = [];
    return;
  }

  notSearchKp.value = false;
  // 取消上一次请求
  if (cancelTokenSource) {
    cancelTokenSource.cancel("取消前一个请求");
  }

  cancelTokenSource = axios.CancelToken.source();

  try {
    const res = await axios.get(
      `http://localhost:8080/api/kp/search/${encodeURIComponent(q)}`,
      {
        cancelToken: cancelTokenSource.token,
      }
    );

    searchResult.value = res.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("请求被取消:", error.message);
    } else {
      console.error("请求失败:", error);
    }
  }
};

const debouncedFetch = debounce(onSearch, 300);

watch(searchBoxText, (newSearchText: string) => {
  if (newSearchText == "") {
    notSearchKp.value = true;
  }
  debouncedFetch(newSearchText);
});

const onClikedClosedSearchKp = () => {
  searchBoxText.value = "";
  notSearchKp.value = true;
};

const onSearchQuestion = async (name: string) => {
  emit("send", { resultData: null, selectedKey: null, loading: true });
  const kpName = name.trim();
  try {
    const res = await getQuestionsByKp(kpName, "1", "10");
    console.log(`📘 查询知识点「${kpName}」返回结果:`, res.data);
    emit("send", { resultData: res.data, selectedKey: kpName, loading: false });
  } catch (err) {
    console.error("❌ 查询失败:", err);
    emit("send", { resultData: null, selectedKey: null, loading: false });
  }
};
</script>
<style scoped>
.side {
  display: flex;
  flex-direction: column;
  background-color: white;
  max-height: 770px;
  height: 770px;
  width: 300px;
  padding-bottom: 20px;
  padding-top: 10px;
  border-radius: 6px;
  box-shadow: 7px 7px 4px rgba(112, 112, 112, 0.5);
  overflow-x: hidden;
}
.tree-scroll-container {
  max-height: 770px;
  height: 770px;
  width: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
}
.search-box {
  display: flex;
  justify-content: center;
  padding-top: 5px;
}
</style>
