import { defineStore } from 'pinia';
import type { PetState } from '@shared/types';

interface PetStoreState {
  data: PetState | null;
  loading: boolean;
}

export const usePetStore = defineStore('pet', {
  state: (): PetStoreState => ({
    data: null,
    loading: false
  }),

  getters: {
    // 宠物名称
    name: (state) => state.data?.data.basic.name || '爱弥斯',

    // 等级
    level: (state) => state.data?.data.basic.level || 1,

    // 经验值
    experience: (state) => state.data?.data.basic.experience || 0,

    // 下级所需经验
    nextLevelExp: (state) => state.data?.data.basic.nextLevelExp || 100,

    // 饱食度
    hunger: (state) => state.data?.data.status.hunger || 100,

    // 好感度
    happiness: (state) => state.data?.data.status.happiness || 50,

    // 能量
    energy: (state) => state.data?.data.status.energy || 100,

    // 健康值
    health: (state) => state.data?.data.status.health || 100,

    // 当前皮肤
    currentSkin: (state) => state.data?.data.appearance.currentSkin || 'default',

    // 当前表情
    currentExpression: (state) => state.data?.data.appearance.currentExpression || 'normal'
  },

  actions: {
    /**
     * 加载数据
     */
    async loadData() {
      this.loading = true;

      try {
        // 从主进程加载数据
        const data = await window.electronAPI?.loadData();
        if (data) {
          this.data = data;
        }
      } catch (error) {
        console.error('Failed to load pet data:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 保存数据
     */
    async saveData() {
      if (!this.data) return;

      try {
        await window.electronAPI?.saveData(this.data);
      } catch (error) {
        console.error('Failed to save pet data:', error);
      }
    },

    /**
     * 更新状态
     */
    updateStatus(status: Partial<PetState['data']['status']>) {
      if (!this.data) return;

      Object.assign(this.data.data.status, status);
      this.saveData();
    },

    /**
     * 增加经验值
     */
    async addExperience(amount: number) {
      if (!this.data) return;

      this.data.data.basic.experience += amount;

      // 检查升级
      while (this.data.data.basic.experience >= this.data.data.basic.nextLevelExp) {
        this.data.data.basic.experience -= this.data.data.basic.nextLevelExp;
        this.data.data.basic.level += 1;
        this.data.data.basic.nextLevelExp = Math.floor(
          this.data.data.basic.nextLevelExp * 1.5
        );
      }

      await this.saveData();
    },

    /**
     * 设置皮肤
     */
    async setSkin(skinId: string) {
      if (!this.data) return;

      this.data.data.appearance.currentSkin = skinId;
      await this.saveData();
    },

    /**
     * 设置表情
     */
    async setExpression(expression: string) {
      if (!this.data) return;

      this.data.data.appearance.currentExpression = expression;
      await this.saveData();
    }
  }
});
