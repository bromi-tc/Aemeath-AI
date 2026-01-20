import FileManager from '../utils/fileManager';
import { DEFAULT_SETTINGS } from '../../shared/defaults';
import type { AppSettings } from '../../shared/types';

/**
 * 设置数据管理器
 */
class SettingsManager {
  private filename = 'settings.json';
  private cache: AppSettings | null = null;

  /**
   * 加载设置
   */
  async load(): Promise<AppSettings> {
    if (this.cache) {
      return this.cache;
    }

    const data = await FileManager.readJSON<AppSettings>(
      this.filename,
      DEFAULT_SETTINGS
    );

    this.cache = data;
    return data;
  }

  /**
   * 保存设置
   */
  async save(data: AppSettings): Promise<void> {
    this.cache = data;
    await FileManager.writeJSON(this.filename, data);
  }

  /**
   * 更新设置
   */
  async update(settings: Partial<AppSettings>): Promise<void> {
    const data = await this.load();
    const merged = { ...data, ...settings };
    await this.save(merged);
  }

  /**
   * 获取单个设置项
   */
  async get<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const data = await this.load();
    return data[key];
  }

  /**
   * 设置单个设置项
   */
  async set<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    const data = await this.load();
    data[key] = value;
    await this.save(data);
  }

  /**
   * 重置为默认设置
   */
  async reset(): Promise<void> {
    await this.save(DEFAULT_SETTINGS);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache = null;
  }
}

export default new SettingsManager();
