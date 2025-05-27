<template>
  <div class="question-filter">
    <div style="margin-top: 20px" />
    <div
      class="filter-group"
      v-for="(group, groupKey) in filterOptions"
      :key="groupKey"
    >
      <div class="filter-title">{{ group.label }}：</div>
      <div class="filter-items">
        <span
          v-for="item in group.options"
          :key="item"
          class="filter-item"
          :class="{ active: selected[groupKey] === item }"
          @click="selectItem(groupKey, item)"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

// 可传入 props 使其可复用
const filterOptions = {
  grade: {
    label: "年级",
    options: ["全部", "七上", "七下", "八上", "八下", "九上", "九下"],
  },
  type: {
    label: "题型",
    options: ["全部", "单选题", "多选题", "填空题", "解答题", "判断题"],
  },
  difficulty: {
    label: "难度",
    options: ["全部", "容易", "较易", "适中", "较难", "困难"],
  },
};

// 选中状态
const selected = reactive({
  grade: "全部",
  type: "全部",
  difficulty: "全部",
});

const selectItem = (groupKey, item) => {
  selected[groupKey] = item;
  // emit 可选：向父组件发出更新事件
  // emit("update:filter", { ...selected })
};
</script>

<style scoped>
.question-filter {
  background-color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 1000px;
  border-radius: 6px;
}
.filter-group {
  margin-left: 20px;
  margin-bottom: 16px;
  display: flex;
  font-size: 15px;
}
.filter-title {
  width: 60px;
  color: #979797;
}
.filter-items {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.filter-item {
  cursor: pointer;
  color: #333;
  padding: 2px 8px;
  border-radius: 4px;
  transition: 0.2s;
}
.filter-item.active {
  color: #2877ff;
  font-weight: bold;
}
</style>
