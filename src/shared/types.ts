/**
 * 宠物状态接口
 */
export interface PetState {
  version: string;
  lastUpdated: string;
  data: {
    basic: {
      name: string;
      level: number;
      experience: number;
      nextLevelExp: number;
    };
    status: {
      hunger: number;        // 0-100
      happiness: number;     // 0-100
      energy: number;        // 0-100
      health: number;        // 0-100
    };
    timers: {
      lastFeedTime: string;
      lastSleepTime: string;
      lastPlayTime: string;
      totalBornTime: string;
    };
    appearance: {
      currentSkin: string;
      currentExpression: string;
      accessories: string[];
    };
  };
}

/**
 * 背包物品接口
 */
export interface InventoryItem {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'decoration';
  count: number;
  effect: {
    hunger?: number;
    happiness?: number;
    energy?: number;
  };
  icon: string;
  description: string;
}

/**
 * 背包数据接口
 */
export interface InventoryData {
  version: string;
  lastUpdated: string;
  items: InventoryItem[];
}

/**
 * 喂食记录接口
 */
export interface FeedRecord {
  id: string;
  itemId: string;
  itemName: string;
  timestamp: string;
  effect: {
    hungerBefore: number;
    hungerAfter: number;
    happinessBefore: number;
    happinessAfter: number;
  };
}

/**
 * 喂食历史数据接口
 */
export interface FeedHistoryData {
  version: string;
  records: FeedRecord[];
  totalFeedCount: number;
  lastFeedTime: string;
}

/**
 * 应用设置接口
 */
export interface AppSettings {
  version: string;
  behavior: {
    autoMove: boolean;
    autoHide: boolean;
    taskbarDocking: boolean;
    peekBehavior: {
      enabled: boolean;
      triggerType: 'mouse_exit' | 'timer' | 'both';
      intervalMinutes: number;
    };
  };
  window: {
    alwaysOnTop: boolean;
    clickThrough: boolean;
    startPosition: 'center' | 'random' | 'last';
    rememberPosition: boolean;
    lastPosition: { x: number; y: number };
  };
  game: {
    difficulty: 'easy' | 'normal' | 'hard';
    hungerDecayRate: number;
    happinessDecayRate: number;
    saveInterval: number;
  };
  appearance: {
    animationQuality: 'low' | 'medium' | 'high';
    showEffects: boolean;
    showStatusBar: 'always' | 'hover' | 'never';
  };
  language: string;
}

/**
 * 统计数据接口
 */
export interface StatisticsData {
  version: string;
  totalFeedCount: number;
  totalPlayTime: number;
  favoriteFood: string;
  highestLevel: number;
  totalAffectionRaised: number;
  achievements: Achievement[];
}

/**
 * 成就接口
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockTime?: string;
}

/**
 * 动画帧接口
 */
export interface AnimationFrame {
  image: string;
  duration: number;
}

/**
 * 动画配置接口
 */
export interface AnimationConfig {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  priority: number;
}

/**
 * 窗口位置接口
 */
export interface WindowPosition {
  x: number;
  y: number;
}

/**
 * 屏幕边缘位置
 */
export type ScreenEdge = 'top' | 'left' | 'right' | 'bottom';

/**
 * 宠物状态类型
 */
export type PetStatusType = 'idle' | 'walking' | 'peeking' | 'eating' | 'sleeping' | 'interacting';

/**
 * 表情类型
 */
export type ExpressionType = 'normal' | 'happy' | 'angry' | 'sad' | 'sleepy' | 'shy' | 'surprised';
