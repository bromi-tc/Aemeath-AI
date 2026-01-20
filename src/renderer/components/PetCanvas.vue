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

      <!-- 喂食动画效果 -->
      <div v-if="showFeedEffect" class="feed-effect">
        <div class="heart">❤️</div>
        <div class="heart" style="animation-delay: 0.2s">💕</div>
        <div class="heart" style="animation-delay: 0.4s">💖</div>
      </div>
    </div>

    <!-- 表情气泡（可选） -->
    <div v-if="currentExpression" class="expression-bubble">
      {{ currentExpression }}
    </div>

    <!-- 数值变化提示 -->
    <div v-if="statusChanges.length > 0" class="status-changes">
      <div
        v-for="(change, index) in statusChanges"
        :key="index"
        class="status-change-item"
        :class="change.type"
      >
        {{ change.text }}
      </div>
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
const showFeedEffect = ref(false);
const statusChanges = ref<Array<{ type: string; text: string }>>([]);

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

// 显示喂食效果
const showFeedAnimation = () => {
  showFeedEffect.value = true;

  setTimeout(() => {
    showFeedEffect.value = false;
  }, 1500);
};

// 显示状态变化提示
const showStatusChange = (type: 'hunger' | 'happiness' | 'energy', value: number) => {
  const typeMap = {
    hunger: { icon: '🍖', label: '饱食度' },
    happiness: { icon: '❤️', label: '好感度' },
    energy: { icon: '⚡', label: '能量' }
  };

  const info = typeMap[type];
  statusChanges.value.push({
    type,
    text: `${info.icon} +${value} ${info.label}`
  });

  // 3秒后移除提示
  setTimeout(() => {
    statusChanges.value.shift();
  }, 3000);
};

// 暴露方法供外部调用
defineExpose({
  showFeedAnimation,
  showStatusChange
});

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
  transition: transform 0.3s ease;
}

.pet-image:active {
  transform: scale(0.95);
}

/* 喂食动画效果 */
.feed-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.heart {
  position: absolute;
  font-size: 32px;
  animation: floatHeart 1.5s ease-out forwards;
  opacity: 0;
}

@keyframes floatHeart {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(var(--tx, 0), -40px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx, 0), -80px) scale(0.8);
  }
}

.heart:nth-child(1) {
  --tx: -30px;
}

.heart:nth-child(2) {
  --tx: 0px;
}

.heart:nth-child(3) {
  --tx: 30px;
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

/* 状态变化提示 */
.status-changes {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.status-change-item {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  animation: slideIn 0.3s ease-out, fadeOut 0.5s ease-in 2.5s forwards;
}

.status-change-item.hunger {
  background: linear-gradient(135deg, #ff9a56, #ff6b6b);
}

.status-change-item.happiness {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
}

.status-change-item.energy {
  background: linear-gradient(135deg, #ffd93d, #f9ca24);
  color: #333;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
