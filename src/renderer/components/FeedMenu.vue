<template>
  <div v-if="visible" class="feed-menu-overlay" @click="handleClose">
    <div class="feed-menu" @click.stop>
      <!-- 标题栏 -->
      <div class="menu-header">
        <h3>🍖 喂食</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 标题栏 -->
      <div class="menu-header">
        <h3>🍖 喂食</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 当前状态提示 -->
      <div class="status-hint">
        <span class="hint-item">
          <span class="hint-icon">🍖</span>
          饱食度: {{ petStore.hunger }}%
        </span>
        <span class="hint-item">
          <span class="hint-icon">❤️</span>
          好感度: {{ petStore.happiness }}%
        </span>
      </div>

      <!-- 食物列表 -->
      <div class="food-list">
        <div
          v-for="item in foodItems"
          :key="item.id"
          class="food-item"
          :class="{ disabled: item.count <= 0 }"
          @click="handleFeed(item)"
        >
          <!-- 食物图标 -->
          <div class="food-icon">
            {{ getFoodEmoji(item.id) }}
          </div>

          <!-- 食物信息 -->
          <div class="food-info">
            <div class="food-name">{{ item.name }}</div>
            <div class="food-description">{{ item.description }}</div>

            <!-- 效果标签 -->
            <div class="food-effects">
              <span v-if="item.effect.hunger" class="effect-tag hunger">
                +{{ item.effect.hunger }} 饱食
              </span>
              <span v-if="item.effect.happiness" class="effect-tag happiness">
                +{{ item.effect.happiness }} 好感
              </span>
              <span v-if="item.effect.energy" class="effect-tag energy">
                +{{ item.effect.energy }} 能量
              </span>
            </div>
          </div>

          <!-- 数量徽章 -->
          <div class="food-count">×{{ item.count }}</div>
        </div>

        <!-- 空状态 -->
        <div v-if="foodItems.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-text">背包里没有食物了</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 喂食成功提示 -->
  <div v-if="showFeedback" class="feed-feedback" :class="feedbackType">
    {{ feedbackText }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '../stores/petStore';
import type { InventoryItem } from '@shared/types';

// 定义 emits
const emit = defineEmits<{
  feedSuccess: [changes: { hunger?: number; happiness?: number; energy?: number }];
}>();

const petStore = usePetStore();

// 组件状态
const visible = ref(false);
const showFeedback = ref(false);
const feedbackText = ref('');
const feedbackType = ref<'success' | 'error' | 'warning'>('success');

// 食物列表（从主进程获取）
const foodItems = ref<InventoryItem[]>([]);

// 从主进程加载背包数据
const loadInventory = async () => {
  try {
    const result = await window.electronAPI?.getInventoryItems();
    if (result?.success && result.items) {
      // 只显示食物类型的物品
      foodItems.value = result.items.filter(item => item.type === 'food');
    }
  } catch (error) {
    console.error('Failed to load inventory:', error);
  }
};

// 临时默认食物列表（如果主进程没有数据）
const defaultFoodItems: InventoryItem[] = [
  {
    id: 'food_apple',
    name: '苹果',
    type: 'food',
    count: 10,
    effect: { hunger: 15, happiness: 5 },
    icon: 'food_apple.png',
    description: '甜甜的苹果，恢复少量饱食度'
  },
  {
    id: 'food_cake',
    name: '蛋糕',
    type: 'food',
    count: 3,
    effect: { hunger: 30, happiness: 15 },
    icon: 'food_cake.png',
    description: '美味的蛋糕，大幅恢复状态'
  },
  {
    id: 'food_milk',
    name: '牛奶',
    type: 'food',
    count: 5,
    effect: { hunger: 10, happiness: 10, energy: 10 },
    icon: 'food_milk.png',
    description: '温热的牛奶，恢复少量状态'
  },
  {
    id: 'food_bread',
    name: '面包',
    type: 'food',
    count: 8,
    effect: { hunger: 20, happiness: 3 },
    icon: 'food_bread.png',
    description: '松软的面包，恢复饱食度'
  },
  {
    id: 'food_fish',
    name: '烤鱼',
    type: 'food',
    count: 2,
    effect: { hunger: 25, happiness: 20 },
    icon: 'food_fish.png',
    description: '香喷喷的烤鱼，大幅提升好感'
  }
];

// 获取食物 emoji
const getFoodEmoji = (itemId: string): string => {
  const emojiMap: Record<string, string> = {
    food_apple: '🍎',
    food_cake: '🍰',
    food_milk: '🥛',
    food_bread: '🍞',
    food_fish: '🐟'
  };
  return emojiMap[itemId] || '🍽️';
};

// 显示菜单
const show = async () => {
  visible.value = true;
  // 加载背包数据
  await loadInventory();

  // 如果没有数据，使用默认列表
  if (foodItems.value.length === 0) {
    foodItems.value = defaultFoodItems;
  }
};

// 隐藏菜单
const hide = () => {
  visible.value = false;
};

// 关闭菜单
const handleClose = () => {
  hide();
};

// 喂食
const handleFeed = async (item: InventoryItem) => {
  if (item.count <= 0) {
    showFeedbackMessage('该食物已用完', 'warning');
    return;
  }

  // 检查状态是否已满
  if (petStore.hunger >= 100 && item.effect.hunger) {
    showFeedbackMessage('爱弥斯已经吃饱了~', 'warning');
    return;
  }

  try {
    // 调用主进程喂食
    const result = await window.electronAPI?.feedPet(item.id, item.effect);

    if (result?.success) {
      // 计算实际增加的数值
      const hungerIncrease = Math.min(100, petStore.hunger + (item.effect.hunger || 0)) - petStore.hunger;
      const happinessIncrease = Math.min(100, petStore.happiness + (item.effect.happiness || 0)) - petStore.happiness;
      const energyIncrease = Math.min(100, petStore.energy + (item.effect.energy || 0)) - petStore.energy;

      // 更新前端状态
      const newHunger = Math.min(100, petStore.hunger + (item.effect.hunger || 0));
      const newHappiness = Math.min(100, petStore.happiness + (item.effect.happiness || 0));
      const newEnergy = Math.min(100, petStore.energy + (item.effect.energy || 0));

      petStore.updateStatus({
        hunger: newHunger,
        happiness: newHappiness,
        energy: newEnergy
      });

      // 减少物品数量
      item.count -= 1;

      // 增加经验值
      await petStore.addExperience(5);

      // 触发喂食成功事件
      emit('feedSuccess', {
        hunger: hungerIncrease > 0 ? item.effect.hunger : 0,
        happiness: happinessIncrease > 0 ? item.effect.happiness : 0,
        energy: energyIncrease > 0 ? item.effect.energy : 0
      });

      // 显示成功提示
      showFeedbackMessage(`成功喂食 ${item.name}！`, 'success');

      // 延迟关闭菜单
      setTimeout(() => {
        hide();
      }, 800);
    } else {
      showFeedbackMessage(result?.error || '喂食失败，请重试', 'error');
    }

  } catch (error) {
    console.error('喂食失败:', error);
    showFeedbackMessage('喂食失败，请重试', 'error');
  }
};

// 显示反馈消息
const showFeedbackMessage = (text: string, type: 'success' | 'error' | 'warning') => {
  feedbackText.value = text;
  feedbackType.value = type;
  showFeedback.value = true;

  setTimeout(() => {
    showFeedback.value = false;
  }, 2000);
};

// 暴露方法给父组件
defineExpose({
  show,
  hide
});
</script>

<style scoped>
.feed-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.feed-menu {
  width: 480px;
  max-height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.menu-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 28px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.status-hint {
  display: flex;
  gap: 20px;
  padding: 12px 20px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.hint-icon {
  font-size: 18px;
}

.food-list {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.food-item:hover:not(.disabled) {
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.food-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.food-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 12px;
  flex-shrink: 0;
}

.food-info {
  flex: 1;
  min-width: 0;
}

.food-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.food-description {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.food-effects {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.effect-tag {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.effect-tag.hunger {
  background: linear-gradient(135deg, #ff9a56, #ff6b6b);
}

.effect-tag.happiness {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
}

.effect-tag.energy {
  background: linear-gradient(135deg, #ffd93d, #f9ca24);
}

.food-count {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  padding: 8px 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
}

/* 滚动条样式 */
.food-list::-webkit-scrollbar {
  width: 6px;
}

.food-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.food-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.food-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 喂食反馈提示 */
.feed-feedback {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  z-index: 3000;
  animation: feedbackDrop 0.4s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes feedbackDrop {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.feed-feedback.success {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #057f62;
}

.feed-feedback.error {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  color: #c0392b;
}

.feed-feedback.warning {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  color: #d35400;
}
</style>
