/**
 * 全局类型定义
 */

import type { PetState, InventoryItem } from '@shared/types';

/**
 * 扩展 Window 接口，添加 electronAPI
 */
declare global {
  interface Window {
    electronAPI?: {
      // 窗口控制
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;

      // 拖拽窗口
      startDrag: () => void;

      // 数据操作
      saveData: (data: PetState) => Promise<{ success: boolean; error?: string }>;
      loadData: () => Promise<{ success: boolean; data?: PetState; error?: string }>;

      // 背包操作
      getInventoryItems: () => Promise<{ success: boolean; items?: InventoryItem[]; error?: string }>;
      useInventoryItem: (itemId: string) => Promise<{ success: boolean; item?: InventoryItem; error?: string }>;

      // 喂食操作
      feedPet: (itemId: string, effect: any) => Promise<{ success: boolean; error?: string }>;

      // 平台信息
      platform: string;
    };
  }
}

export {};
