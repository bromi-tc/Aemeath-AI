<template>
  <div id="app">
    <!-- 拖拽区域 -->
    <div class="drag-region" @mousedown="handleDragStart"></div>

    <!-- 宠物显示区域 -->
    <PetCanvas />

    <!-- 右键菜单 -->
    <ContextMenu />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PetCanvas from './components/PetCanvas.vue';
import ContextMenu from './components/ContextMenu.vue';

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
