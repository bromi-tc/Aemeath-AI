import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import PetDataManager from './managers/petDataManager';
import InventoryManager from './managers/inventoryManager';
import SettingsManager from './managers/settingsManager';

let mainWindow: BrowserWindow | null = null;

// 检测是否为开发环境
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 512,
    height: 512,
    transparent: true,           // 透明背景
    frame: false,                // 无边框
    alwaysOnTop: true,           // 置顶
    skipTaskbar: false,          // 显示任务栏图标
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载页面
  if (isDev) {
    // 开发模式：加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5175').catch(() => {
      return mainWindow.loadURL('http://localhost:5174');
    }).catch(() => {
      return mainWindow.loadURL('http://localhost:5173');
    }).catch((err) => {
      console.error('Failed to load dev server:', err);
    });
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 注册 IPC 处理器
function registerIpcHandlers() {
  // 保存宠物数据
  ipcMain.handle('data-save', async (_event, data) => {
    try {
      await PetDataManager.save(data);
      return { success: true };
    } catch (error) {
      console.error('Failed to save pet data:', error);
      return { success: false, error: String(error) };
    }
  });

  // 加载宠物数据
  ipcMain.handle('data-load', async () => {
    try {
      const data = await PetDataManager.load();
      return { success: true, data };
    } catch (error) {
      console.error('Failed to load pet data:', error);
      return { success: false, error: String(error) };
    }
  });

  // 背包操作
  ipcMain.handle('inventory-get-items', async () => {
    try {
      const items = await InventoryManager.getAllItems();
      return { success: true, items };
    } catch (error) {
      console.error('Failed to get inventory items:', error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle('inventory-use-item', async (_event, itemId: string) => {
    try {
      const item = await InventoryManager.useItem(itemId);
      return { success: true, item };
    } catch (error) {
      console.error('Failed to use item:', error);
      return { success: false, error: String(error) };
    }
  });

  // 喂食宠物
  ipcMain.handle('pet-feed', async (_event, itemId: string, effect: any) => {
    try {
      await PetDataManager.feed(itemId, effect);
      return { success: true };
    } catch (error) {
      console.error('Failed to feed pet:', error);
      return { success: false, error: String(error) };
    }
  });

  // 窗口操作
  ipcMain.on('window-start-drag', () => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        document.body.style.cursor = 'move';
      `);
    }
  });

  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });
}

// 应用就绪时创建窗口
app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（Windows & Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 阻止应用多开
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  // 清理资源
  console.log('Application quitting...');
});

export { mainWindow };
