<template>
  <div id="app">
    <!-- 拖拽区域 -->
    <div class="drag-region" @mousedown="handleDragStart"></div>

    <!-- 宠物显示区域 -->
    <PetCanvas ref="petCanvasRef" />

    <!-- 右键菜单 -->
    <ContextMenu @open-feed-menu="handleOpenFeedMenu" />

    <!-- 喂食菜单 -->
    <FeedMenu ref="feedMenuRef" @feed-success="handleFeedSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PetCanvas from './components/PetCanvas.vue';
import ContextMenu from './components/ContextMenu.vue';
import FeedMenu from './components/FeedMenu.vue';

// 组件引用
const petCanvasRef = ref<InstanceType<typeof PetCanvas> | null>(null);
const feedMenuRef = ref<InstanceType<typeof FeedMenu> | null>(null);

// 打开喂食菜单
const handleOpenFeedMenu = () => {
  feedMenuRef.value?.show();
};

// 喂食成功
const handleFeedSuccess = (changes: any) => {
  // 显示喂食动画
  petCanvasRef.value?.showFeedAnimation();

  // 显示状态变化
  if (changes.hunger) {
    petCanvasRef.value?.showStatusChange('hunger', changes.hunger);
  }
  if (changes.happiness) {
    petCanvasRef.value?.showStatusChange('happiness', changes.happiness);
  }
  if (changes.energy) {
    petCanvasRef.value?.showStatusChange('energy', changes.energy);
  }
};

// 拖拽开始
const handleDragStart = () => {
  window.electronAPI?.startDrag();
};

onMounted(() => {
  console.log('爱弥斯桌宠已启动');
  console.log('Platform:', window.electronAPI?.platform);
});
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 10;
  /* 允许点击事件穿透到下层元素 */
  pointer-events: none;
}

/* 只有在需要拖拽时才接收鼠标事件 */
.drag-region:active {
  pointer-events: auto;
}
</style>
