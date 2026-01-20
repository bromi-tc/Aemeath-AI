import FileManager from '../utils/fileManager';
import { DEFAULT_PET_STATE } from '@shared/defaults';
import type { PetState } from '@shared/types';

/**
 * 宠物数据管理器
 */
class PetDataManager {
  private filename = 'pet.json';
  private cache: PetState | null = null;

  /**
   * 加载宠物数据
   */
  async load(): Promise<PetState> {
    if (this.cache) {
      return this.cache;
    }

    const data = await FileManager.readJSON<PetState>(
      this.filename,
      DEFAULT_PET_STATE
    );

    this.cache = data;
    return data;
  }

  /**
   * 保存宠物数据
   */
  async save(data: PetState): Promise<void> {
    data.lastUpdated = new Date().toISOString();
    this.cache = data;
    await FileManager.writeJSON(this.filename, data);
  }

  /**
   * 更新状态值
   */
  async updateStatus(
    status: Partial<PetState['data']['status']>
  ): Promise<void> {
    const data = await this.load();
    Object.assign(data.data.status, status);
    await this.save(data);
  }

  /**
   * 增加经验值
   */
  async addExperience(amount: number): Promise<boolean> {
    const data = await this.load();
    data.data.basic.experience += amount;

    let leveledUp = false;

    // 检查升级
    while (data.data.basic.experience >= data.data.basic.nextLevelExp) {
      data.data.basic.experience -= data.data.basic.nextLevelExp;
      data.data.basic.level += 1;
      data.data.basic.nextLevelExp = Math.floor(
        data.data.basic.nextLevelExp * 1.5
      );
      leveledUp = true;
    }

    await this.save(data);
    return leveledUp;
  }

  /**
   * 喂食
   */
  async feed(itemId: string, effect: any): Promise<void> {
    const data = await this.load();

    // 应用效果
    if (effect.hunger) {
      data.data.status.hunger = Math.min(
        100,
        data.data.status.hunger + effect.hunger
      );
    }
    if (effect.happiness) {
      data.data.status.happiness = Math.min(
        100,
        data.data.status.happiness + effect.happiness
      );
    }
    if (effect.energy) {
      data.data.status.energy = Math.min(
        100,
        data.data.status.energy + effect.energy
      );
    }

    data.data.timers.lastFeedTime = new Date().toISOString();

    await this.save(data);

    // 备份数据
    await FileManager.backup(this.filename);
  }

  /**
   * 清除缓存（强制重新加载）
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * 获取当前状态（不加载）
   */
  getCachedState(): PetState | null {
    return this.cache;
  }
}

export default new PetDataManager();
