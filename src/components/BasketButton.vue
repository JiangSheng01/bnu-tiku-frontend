<template>
  <div class="basket-container">
    <div class="basket-icon" @click="openBasket">
      🧺
      <span v-if="count > 0" class="basket-count">{{ count }}</span>
    </div>
  </div>
</template>

<script setup>
// 接收父组件传值或自己管理状态
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["click"]);
const openBasket = () => emit("click");
</script>

<style scoped>
.basket-container {
  position: fixed;
  bottom: 30px;
  right: 150px;
  z-index: 1000;
}

.basket-icon {
  position: relative;
  background-color: #2877ff;
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 24px;
  text-align: center;
  line-height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
}

.basket-icon:hover {
  transform: scale(1.1);
}

.basket-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: red;
  color: white;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  padding: 2px 2px;
  font-size: 12px;
  font-weight: bold;
}
</style>
