import FileManager from '../utils/fileManager';
import { DEFAULT_INVENTORY } from '../../shared/defaults';
import type { InventoryData, InventoryItem } from '../../shared/types';

/**
 * 背包数据管理器
 */
class InventoryManager {
  private filename = 'inventory.json';
  private cache: InventoryData | null = null;

  /**
   * 加载背包数据
   */
  async load(): Promise<InventoryData> {
    if (this.cache) {
      return this.cache;
    }

    const data = await FileManager.readJSON<InventoryData>(
      this.filename,
      DEFAULT_INVENTORY
    );

    this.cache = data;
    return data;
  }

  /**
   * 保存背包数据
   */
  async save(data: InventoryData): Promise<void> {
    data.lastUpdated = new Date().toISOString();
    this.cache = data;
    await FileManager.writeJSON(this.filename, data);
  }

  /**
   * 添加物品
   */
  async addItem(itemId: string, count: number = 1): Promise<void> {
    const data = await this.load();
    const item = data.items.find((i) => i.id === itemId);

    if (item) {
      item.count += count;
    } else {
      console.warn(`Item ${itemId} not found in inventory config`);
      return;
    }

    await this.save(data);
  }

  /**
   * 使用物品
   */
  async useItem(itemId: string): Promise<InventoryItem | null> {
    const data = await this.load();
    const item = data.items.find((i) => i.id === itemId);

    if (!item || item.count <= 0) {
      return null;
    }

    item.count -= 1;

    // 移除数量为 0 的物品
    if (item.count === 0) {
      data.items = data.items.filter((i) => i.id !== itemId);
    }

    await this.save(data);
    return item;
  }

  /**
   * 获取所有物品
   */
  async getAllItems(): Promise<InventoryItem[]> {
    const data = await this.load();
    return data.items;
  }

  /**
   * 根据类型获取物品
   */
  async getItemsByType(type: 'food' | 'toy' | 'decoration'): Promise<InventoryItem[]> {
    const data = await this.load();
    return data.items.filter((i) => i.type === type);
  }

  /**
   * 获取单个物品信息
   */
  async getItem(itemId: string): Promise<InventoryItem | null> {
    const data = await this.load();
    return data.items.find((i) => i.id === itemId) || null;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache = null;
  }
}

export default new InventoryManager();
