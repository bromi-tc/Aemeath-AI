import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // 拖拽窗口
  startDrag: () => ipcRenderer.send('window-start-drag'),

  // 数据操作
  saveData: (data: any) => ipcRenderer.invoke('data-save', data),
  loadData: () => ipcRenderer.invoke('data-load'),

  // 背包操作
  getInventoryItems: () => ipcRenderer.invoke('inventory-get-items'),
  useInventoryItem: (itemId: string) => ipcRenderer.invoke('inventory-use-item', itemId),

  // 喂食操作
  feedPet: (itemId: string, effect: any) => ipcRenderer.invoke('pet-feed', itemId, effect),

  // 平台信息
  platform: process.platform
});
