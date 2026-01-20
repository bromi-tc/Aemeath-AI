import type { PetState, InventoryData, AppSettings, FeedHistoryData } from './types';

/**
 * 默认宠物状态
 */
export const DEFAULT_PET_STATE: PetState = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  data: {
    basic: {
      name: '爱弥斯',
      level: 1,
      experience: 0,
      nextLevelExp: 100
    },
    status: {
      hunger: 100,
      happiness: 50,
      energy: 100,
      health: 100
    },
    timers: {
      lastFeedTime: new Date().toISOString(),
      lastSleepTime: new Date().toISOString(),
      lastPlayTime: new Date().toISOString(),
      totalBornTime: new Date().toISOString()
    },
    appearance: {
      currentSkin: 'default',
      currentExpression: 'normal',
      accessories: []
    }
  }
};

/**
 * 默认背包数据
 */
export const DEFAULT_INVENTORY: InventoryData = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  items: [
    {
      id: 'food_apple',
      name: '苹果',
      type: 'food',
      count: 10,
      effect: { hunger: 15, happiness: 5 },
      icon: 'food_apple.png',
      description: '甜甜的苹果，恢复少量饱食度'
    },
    {
      id: 'food_cake',
      name: '蛋糕',
      type: 'food',
      count: 3,
      effect: { hunger: 30, happiness: 15 },
      icon: 'food_cake.png',
      description: '美味的蛋糕，大幅恢复状态'
    },
    {
      id: 'food_milk',
      name: '牛奶',
      type: 'food',
      count: 5,
      effect: { hunger: 10, happiness: 10, energy: 10 },
      icon: 'food_milk.png',
      description: '温热的牛奶，恢复少量状态'
    }
  ]
};

/**
 * 默认应用设置
 */
export const DEFAULT_SETTINGS: AppSettings = {
  version: '1.0.0',
  behavior: {
    autoMove: true,
    autoHide: true,
    taskbarDocking: true,
    peekBehavior: {
      enabled: true,
      triggerType: 'both',
      intervalMinutes: 5
    }
  },
  window: {
    alwaysOnTop: true,
    clickThrough: false,
    startPosition: 'center',
    rememberPosition: true,
    lastPosition: { x: 100, y: 100 }
  },
  game: {
    difficulty: 'normal',
    hungerDecayRate: 1.0,
    happinessDecayRate: 1.0,
    saveInterval: 60000 // 1 分钟
  },
  appearance: {
    animationQuality: 'high',
    showEffects: true,
    showStatusBar: 'hover'
  },
  language: 'zh-CN'
};

/**
 * 默认喂食历史
 */
export const DEFAULT_FEED_HISTORY: FeedHistoryData = {
  version: '1.0.0',
  records: [],
  totalFeedCount: 0,
  lastFeedTime: new Date().toISOString()
};
