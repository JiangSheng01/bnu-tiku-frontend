<template>
  <div class="question-bucket">
    <QuestionCard
      :all-questions="all_questions"
      :loading="false"
      :show-add-to-basket="false"
    />
  </div>
  <div class="basket-footer">
    <div class="basket-info">已选 {{ 2 }} / {{ maxCount }} 道题</div>
    <div class="basket-actions">
      <a-button
        type="primary"
        @click="$emit('export', 'word')"
        style="margin-right: 20px; font-size: 17px; height: 40px"
        >导出为 Word</a-button
      >
      <a-button
        type="primary"
        ghost
        @click="$emit('export', 'pdf')"
        style="font-size: 17px; height: 40px"
        >导出为 PDF</a-button
      >
    </div>
  </div>
</template>

<script setup>
import QuestionCard from "@/components/QuestionCard.vue";

defineProps({
  selectedCount: Number,
  maxCount: {
    type: Number,
    default: 20,
  },
});
defineEmits(["export"]);

const all_questions = [
  {
    simple_question_type: "2",
    question_type: "0",
    question_answer: "9",
    question_id: "6",
    knowledge_points:
      '["勾股定理及应用","整式有关的概念","勾股定理基础","代数式","三角形","代数式的分类","勾股定理的逆定理","式"]',
    difficulty: "0.85",
    question_source:
      "广东省汕头市潮阳区贵屿镇多校2024--2025学年下学期八年级数学期中考试卷",
    knowledge_point: "勾股定理的逆定理",
    complexity_type: "GeometryLogic",
    core_competency: "DataAwareness",
    grade: "Grade7-SecondTerm",
    question_explanation:
      "解析：<br/>本题考查了勾股定理和完全平方公式的应用.结合题意，表示出2+b2=41,(b-a)2-=a2-2ab+b2-1,求出2ab=40,然后利用(a+b)2=a2+2ab+b2=41+40=81,进而求解即可.<br/>详解：<br/>解：，大正方形的面积为41，小正方形的面积为1，a2+b2=41,(b-a)2=a2-2ab+b2=1.41-2ab=12ab=40∴(a+b)2=a2+2ab+b2=41+40=81+b=9(负值舍去)故答案为：9.<br/>",
    knowledge_point_list: "[1129,1119,1118,965,143,140,139,137]",
    stem: '5.如图所示的赵爽弦图是由四个全等的直角三角形和一个小正方形拼成的一个大正方形，大正方形的面积为41，小正方形的面积为1，设直角,较长直角边长为b,则a+b的值为<br/><img src="https://img.xkw.com/dksih/QBM/editorImg/2025/4/16/acf1ca76-2c3b-49d1-820e-7665742a7312.png" style="max-width: 100%; width: 100px; height: auto;"/><br/>',
  },
  {
    simple_question_type: "0",
    question_type: "0",
    question_answer: "B",
    question_id: "2",
    knowledge_points:
      '["数","有理数","有理数比较大小-作商法","有理数比较大小","有理数除法","有理数基础运算","含乘方的有理数混合运算"]',
    difficulty: "0.65",
    question_source: "24-25六年级下·广东汕头·自主招生",
    knowledge_point: "含乘方的有理数混合运算",
    complexity_type: "GeometryLogic",
    core_competency: "AbstractModeling",
    grade: "Grade7-FirstTerm",
    question_explanation:
      "解析：<br/>本题考查了有理数混合运算的应用，有理数大小比较，分别计算出三个超市优惠后的价格，进行比较法解决问题即可<br/>详解：<br/>解：20×4=80（元）甲超市优惠后价格：80×(1-15%)=80×85%=68(元)，乙超市优惠后价格：20×(4-1)=60(元)丙超市优惠后价格：80×80%=64（元）68>64>60,则从乙超市购买最省钱，故选：B.<br/>",
    knowledge_point_list: "[56,55,2,1,78,71,60,2,1]",
    stem: "端午节到来之际，甲、乙、丙三个超市都进行促销活动，同一品牌原件20元一袋的八宝糯米粽子，甲超市每袋降价，乙超市买三送一，丙超市每袋打八折出售，妈妈要买4袋粽子，去（            ）超市购买更省钱．A: 甲   B: 乙   C: 丙   D: 都一样   ",
  },
];
</script>

<style scoped>
.question-bucket {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.basket-footer {
  position: fixed;
  bottom: 0;
  left: 25%;
  right: 25%;
  width: 50%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fafafa;
  border-top: 1px solid #eee;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  border-radius: 10px 10px 0 0;
}

.basket-info {
  font-size: 17px;
  color: #666;
}
.basket-actions a-button + a-button {
  margin-left: 12px;
}
</style>
