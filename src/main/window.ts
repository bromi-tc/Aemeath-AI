import { BrowserWindow, screen } from 'electron';
import { mainWindow } from './index';

/**
 * 窗口管理器
 */
export class WindowManager {
  /**
   * 设置窗口可拖拽
   */
  static setWindowDraggable() {
    if (!mainWindow) return;

    mainWindow.on('move', () => {
      // 窗口移动时的处理
      // 可以在这里添加边界检测等逻辑
    });
  }

  /**
   * 设置窗口位置
   */
  static setWindowPosition(x: number, y: number) {
    if (!mainWindow) return;
    mainWindow.setPosition(x, y);
  }

  /**
   * 获取窗口位置
   */
  static getWindowPosition() {
    if (!mainWindow) return { x: 0, y: 0 };
    const position = mainWindow.getPosition();
    return { x: position[0], y: position[1] };
  }

  /**
   * 设置窗口大小
   */
  static setWindowSize(width: number, height: number) {
    if (!mainWindow) return;
    mainWindow.setSize(width, height);
  }

  /**
   * 获取屏幕尺寸
   */
  static getScreenSize() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return { width, height };
  }

  /**
   * 设置窗口居中
   */
  static centerWindow() {
    if (!mainWindow) return;
    mainWindow.center();
  }

  /**
   * 设置窗口置顶
   */
  static setAlwaysOnTop(flag: boolean) {
    if (!mainWindow) return;
    mainWindow.setAlwaysOnTop(flag);
  }

  /**
   * 设置窗口点击穿透
   */
  static setClickThrough(flag: boolean) {
    if (!mainWindow) return;

    if (flag) {
      // Windows 上使用 -1 作为 hit-test 值来实现点击穿透
      mainWindow.setIgnoreMouseEvents(true);
    } else {
      mainWindow.setIgnoreMouseEvents(false);
    }
  }

  /**
   * 限制窗口在屏幕内
   */
  static constrainToScreen() {
    if (!mainWindow) return;

    const [x, y] = mainWindow.getPosition();
    const [width, height] = mainWindow.getSize();
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    let newX = x;
    let newY = y;

    // 限制 X 轴
    if (newX < 0) newX = 0;
    if (newX + width > screenWidth) newX = screenWidth - width;

    // 限制 Y 轴
    if (newY < 0) newY = 0;
    if (newY + height > screenHeight) newY = screenHeight - height;

    mainWindow.setPosition(newX, newY);
  }
}

export default WindowManager;
