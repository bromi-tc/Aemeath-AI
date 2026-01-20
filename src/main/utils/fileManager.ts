import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';

/**
 * 文件管理器
 * 负责本地文件的读写、备份等操作
 */
class FileManager {
  private dataPath: string;
  private backupPath: string;
  private isInitialized: boolean = false;

  constructor() {
    // 获取用户数据目录
    this.dataPath = path.join(app.getPath('userData'), 'data');
    this.backupPath = path.join(app.getPath('userData'), 'backups');
  }

  /**
   * 初始化目录
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
      this.isInitialized = true;
      console.log('FileManager initialized');
      console.log('Data path:', this.dataPath);
      console.log('Backup path:', this.backupPath);
    } catch (error) {
      console.error('Failed to initialize FileManager:', error);
      throw error;
    }
  }

  /**
   * 读取 JSON 文件
   * @param filename 文件名
   * @param defaultData 默认数据（文件不存在时返回）
   */
  async readJSON<T>(filename: string, defaultData: T): Promise<T> {
    await this.init();

    const filePath = path.join(this.dataPath, filename);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      return data;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // 文件不存在，创建并返回默认值
        console.log(`File ${filename} not found, creating with default data`);
        await this.writeJSON(filename, defaultData);
        return defaultData;
      }
      throw error;
    }
  }

  /**
   * 写入 JSON 文件（带原子性保护）
   * @param filename 文件名
   * @param data 数据
   */
  async writeJSON<T>(filename: string, data: T): Promise<void> {
    await this.init();

    const filePath = path.join(this.dataPath, filename);
    const tempFilePath = filePath + '.tmp';

    try {
      // 先写入临时文件
      await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');

      // 验证 JSON 有效性
      const content = await fs.readFile(tempFilePath, 'utf-8');
      JSON.parse(content);

      // 替换原文件（原子操作）
      await fs.rename(tempFilePath, filePath);

      console.log(`File ${filename} saved successfully`);
    } catch (error) {
      // 出错时删除临时文件
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {
        // 忽略删除临时文件的错误
      }
      console.error(`Failed to save file ${filename}:`, error);
      throw error;
    }
  }

  /**
   * 备份数据文件
   * @param filename 文件名
   */
  async backup(filename: string): Promise<void> {
    await this.init();

    const filePath = path.join(this.dataPath, filename);
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const backupFileName = `${timestamp}_${timeStr}_${filename}`;
    const backupFilePath = path.join(this.backupPath, backupFileName);

    try {
      await fs.copyFile(filePath, backupFilePath);
      console.log(`Backup created: ${backupFileName}`);

      // 只保留最近 7 天的备份
      await this.cleanOldBackups();
    } catch (error) {
      console.error(`Failed to backup file ${filename}:`, error);
      // 不抛出错误，备份失败不应影响主流程
    }
  }

  /**
   * 清理旧备份文件（保留最近 7 天）
   */
  private async cleanOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupPath);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.backupPath, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > sevenDays) {
          await fs.unlink(filePath);
          console.log(`Old backup deleted: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  /**
   * 删除数据文件
   * @param filename 文件名
   */
  async deleteFile(filename: string): Promise<void> {
    await this.init();

    const filePath = path.join(this.dataPath, filename);

    try {
      await fs.unlink(filePath);
      console.log(`File ${filename} deleted`);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * 检查文件是否存在
   * @param filename 文件名
   */
  async exists(filename: string): Promise<boolean> {
    await this.init();

    const filePath = path.join(this.dataPath, filename);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取所有备份文件列表
   */
  async getBackupList(): Promise<string[]> {
    await this.init();

    try {
      const files = await fs.readdir(this.backupPath);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Failed to get backup list:', error);
      return [];
    }
  }

  /**
   * 恢复备份
   * @param backupFilename 备份文件名
   * @param targetFilename 目标文件名
   */
  async restoreBackup(backupFilename: string, targetFilename: string): Promise<void> {
    await this.init();

    const backupFilePath = path.join(this.backupPath, backupFilename);
    const targetFilePath = path.join(this.dataPath, targetFilename);

    try {
      await fs.copyFile(backupFilePath, targetFilePath);
      console.log(`Backup restored: ${backupFilename} -> ${targetFilename}`);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  /**
   * 获取数据路径（供调试使用）
   */
  getDataPath(): string {
    return this.dataPath;
  }

  /**
   * 获取备份路径（供调试使用）
   */
  getBackupPath(): string {
    return this.backupPath;
  }
}

// 导出单例
export default new FileManager();
