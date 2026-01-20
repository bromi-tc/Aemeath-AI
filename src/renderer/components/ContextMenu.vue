<template>
  <div
    v-if="visible"
    class="context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop
  >
    <div class="menu-item" @click="handleFeed">
      <span class="menu-icon">🍖</span>
      <span>喂食</span>
    </div>

    <div class="menu-item" @click="handlePlay">
      <span class="menu-icon">🎮</span>
      <span>玩耍</span>
    </div>

    <div class="menu-item" @click="handleSleep">
      <span class="menu-icon">😴</span>
      <span>睡觉</span>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-item" @click="handleSettings">
      <span class="menu-icon">⚙️</span>
      <span>设置</span>
    </div>

    <div class="menu-item" @click="handleAbout">
      <span class="menu-icon">ℹ️</span>
      <span>关于</span>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-item danger" @click="handleClose">
      <span class="menu-icon">❌</span>
      <span>退出</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { usePetStore } from '../stores/petStore';

const petStore = usePetStore();

const visible = ref(false);
const x = ref(0);
const y = ref(0);

// 显示右键菜单
const showMenu = (event: MouseEvent) => {
  event.preventDefault();
  x.value = event.clientX;
  y.value = event.clientY;
  visible.value = true;
};

// 隐藏右键菜单
const hideMenu = () => {
  visible.value = false;
};

// 喂食
const handleFeed = async () => {
  console.log('喂食');
  // TODO: 打开喂食菜单
  hideMenu();
};

// 玩耍
const handlePlay = () => {
  console.log('玩耍');
  // TODO: 实现玩耍逻辑
  hideMenu();
};

// 睡觉
const handleSleep = () => {
  console.log('睡觉');
  // TODO: 实现睡觉逻辑
  hideMenu();
};

// 设置
const handleSettings = () => {
  console.log('打开设置');
  // TODO: 打开设置面板
  hideMenu();
};

// 关于
const handleAbout = () => {
  console.log('关于');
  // TODO: 显示关于信息
  hideMenu();
};

// 关闭应用
const handleClose = () => {
  window.electronAPI?.closeWindow();
};

onMounted(() => {
  window.addEventListener('contextmenu', showMenu);
  window.addEventListener('click', hideMenu);
});

onUnmounted(() => {
  window.removeEventListener('contextmenu', showMenu);
  window.removeEventListener('click', hideMenu);
});
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #333;
}

.menu-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.menu-item.danger:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 4px 0;
}
</style>
