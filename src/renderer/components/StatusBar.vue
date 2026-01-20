<template>
  <div class="status-bar">
    <!-- 饱食度 -->
    <div class="status-item">
      <span class="status-icon">🍖</span>
      <div class="progress-bar">
        <div
          class="progress-fill hunger"
          :style="{ width: hunger + '%' }"
        ></div>
      </div>
      <span class="status-value">{{ hunger }}%</span>
    </div>

    <!-- 好感度 -->
    <div class="status-item">
      <span class="status-icon">❤️</span>
      <div class="progress-bar">
        <div
          class="progress-fill happiness"
          :style="{ width: happiness + '%' }"
        ></div>
      </div>
      <span class="status-value">{{ happiness }}%</span>
    </div>

    <!-- 能量 -->
    <div class="status-item">
      <span class="status-icon">⚡</span>
      <div class="progress-bar">
        <div
          class="progress-fill energy"
          :style="{ width: energy + '%' }"
        ></div>
      </div>
      <span class="status-value">{{ energy }}%</span>
    </div>

    <!-- 等级 -->
    <div class="level-badge">
      LV.{{ level }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePetStore } from '../stores/petStore';

const petStore = usePetStore();

const hunger = computed(() => petStore.hunger);
const happiness = computed(() => petStore.happiness);
const energy = computed(() => petStore.energy);
const level = computed(() => petStore.level);
</script>

<style scoped>
.status-bar {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-fill.hunger {
  background: linear-gradient(90deg, #ff9a56, #ff6b6b);
}

.progress-fill.happiness {
  background: linear-gradient(90deg, #ff6b9d, #c44569);
}

.progress-fill.energy {
  background: linear-gradient(90deg, #ffd93d, #f9ca24);
}

.status-value {
  min-width: 40px;
  text-align: right;
  font-weight: bold;
}

.level-badge {
  position: absolute;
  top: -15px;
  right: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
