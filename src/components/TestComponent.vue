<template>
  <a-tree
    :tree-data="treeData"
    :expanded-keys="expandedKeys"
    @expand="onExpand"
    show-icon
    block-node
  >
    <template #switcherIcon="{ expanded }">
      <component :is="expanded ? DownOutlined : RightOutlined" />
    </template>
  </a-tree>
</template>

<script setup>
import { ref } from "vue";
import { DownOutlined, RightOutlined } from "@ant-design/icons-vue";

// 模拟知识点树结构
const treeData = [
  {
    title: "数与式",
    key: "0-0",
    children: [
      {
        title: "有理数",
        key: "0-0-0",
        children: [
          {
            title: "整数",
            key: "0-0-0-0",
          },
        ],
      },
    ],
  },
];

// 记录当前展开的 key 列表
const expandedKeys = ref([]);

const onExpand = (keys) => {
  expandedKeys.value = keys;
};
</script>
