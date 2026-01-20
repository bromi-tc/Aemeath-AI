<template>
  <div class="pet-canvas">
    <!-- 状态条 -->
    <StatusBar v-if="showStatusBar" />

    <!-- 宠物图像/动画 -->
    <div class="pet-container">
      <img
        :src="currentAnimation"
        :alt="petName"
        class="pet-image"
        @click="handlePetClick"
      />
    </div>

    <!-- 表情气泡（可选） -->
    <div v-if="currentExpression" class="expression-bubble">
      {{ currentExpression }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import StatusBar from './StatusBar.vue';
import { usePetStore } from '../stores/petStore';

// 状态管理
const petStore = usePetStore();

// 响应式数据
const showStatusBar = ref(true);
const currentExpression = ref('');

// 计算属性
const petName = computed(() => petStore.name);
const currentAnimation = computed(() => {
  // TODO: 根据当前状态返回对应的动画
  // 目前返回占位符
  return new URL('../assets/animations/idle/frame_01.svg', import.meta.url).href;
});

// 点击宠物
const handlePetClick = () => {
  // 随机显示表情
  const expressions = ['❤️', '✨', '🎵', '😊'];
  currentExpression.value = expressions[Math.floor(Math.random() * expressions.length)];

  setTimeout(() => {
    currentExpression.value = '';
  }, 2000);
};

// 初始化
onMounted(async () => {
  await petStore.loadData();
  console.log('Pet data loaded:', petStore.data);
});
</script>

<style scoped>
.pet-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}

.expression-bubble {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
