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

<script setup lang="ts">
import { reactive } from "vue";
import { useFilterStore } from "@/stores/filter";
import { storeToRefs } from "pinia";

const emits = defineEmits(["updateFilter"]);

// 可传入 props 使其可复用
const filterOptions = {
  grade: {
    label: "年级",
    options: [
      "全部",
      "七年级上",
      "七年级下",
      "八年级上",
      "八年级下",
      "九年级上",
      "九年级下",
    ],
  },
  type: {
    label: "题型",
    options: ["全部", "单选题", "多选题", "填空题", "简答题", "判断题"],
  },
  difficulty: {
    label: "难度",
    options: ["全部", "容易", "较易", "适中", "较难", "困难"],
  },
};

const filterStore = useFilterStore();
const { selected } = storeToRefs(filterStore);
// 选中状态
// const selected = reactive<Record<string, any>>({
//   grade: "全部",
//   type: "全部",
//   difficulty: "全部",
// });

const selectItem = (groupKey: string, item: string) => {
  selected.value[groupKey] = item;
  // emit 可选：向父组件发出更新事件
  // emit("update:filter", { ...selected })
  const newSelected = {
    grade: gradeToId(selected.value.grade),
    type: questionTypeToId(selected.value.type),
    difficulty: transferDifficulty(selected.value.difficulty),
  };
  // console.log(newSelected);
  emits("updateFilter", {
    selected: newSelected,
  });
};

const gradeToId = (gradeName: any) => {
  switch (gradeName) {
    case "七年级上":
      return 1;
    case "七年级下":
      return 2;
    case "八年级上":
      return 3;
    case "八年级下":
      return 4;
    case "九年级上":
      return 5;
    case "九年级下":
      return 6;
    case "全部":
      return -1;
  }
};
const questionTypeToId = (typeName: any) => {
  switch (typeName) {
    case "单选题":
      return 0;
    case "多选题":
      return 1;
    case "填空题":
      return 2;
    case "简答题":
      return 3;
    case "判断题":
      return 4;
    case "全部":
      return -1;
  }
};
const transferDifficulty = (difficultyName: any) => {
  switch (difficultyName) {
    case "容易":
      return "easy";
    case "较易":
      return "simple";
    case "适中":
      return "medium";
    case "较难":
      return "relatively-difficult";
    case "困难":
      return "difficult";
    case "全部":
      return "all";
  }
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
