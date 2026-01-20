/**
 * 全局类型定义
 */

import type { PetState } from '@shared/types';

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
      saveData: (data: PetState) => Promise<void>;
      loadData: () => Promise<PetState>;

      // 平台信息
      platform: string;
    };
  }
}

export {};
