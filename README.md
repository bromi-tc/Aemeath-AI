# 爱弥斯桌宠 (Aemeath-AI)

一个可爱的虚拟桌面宠物应用，使用 Electron + Vue3 + TypeScript 开发。

## 功能特性

- ✨ 透明无边框窗口，完美融入桌面
- 🎭 可爱的动画和表情系统
- 🖱️ 支持鼠标拖拽移动
- 💾 本地文件数据存储
- 🍖 投喂养成玩法
- 😊 状态显示（饱食度、好感度、能量）
- 🎮 右键菜单交互
- 📊 等级成长系统

## 技术栈

- **Electron** - 桌面应用框架
- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **Vite** - 构建工具

## 项目结构

```
Aemeath-AI/
├── src/
│   ├── main/                # Electron 主进程
│   │   ├── index.ts         # 入口文件
│   │   ├── window.ts        # 窗口管理
│   │   ├── preload.ts       # 预加载脚本
│   │   ├── utils/           # 工具函数
│   │   └── managers/        # 数据管理器
│   │
│   ├── renderer/            # Vue3 渲染进程
│   │   ├── App.vue          # 根组件
│   │   ├── components/      # 组件
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── assets/          # 静态资源
│   │   └── styles/          # 样式文件
│   │
│   └── shared/              # 共享代码
│       ├── types.ts         # 类型定义
│       └── defaults.ts      # 默认数据
│
├── data/                    # 运行时数据目录
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 开发指南

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这将启动 Vite 开发服务器并打开 Electron 窗口。

### 构建

```bash
npm run build
```

这将构建项目并生成 Windows 安装包到 `release/` 目录。

## 数据存储

数据使用本地 JSON 文件存储，位置在：

**Windows:** `C:\Users\<用户名>\AppData\Roaming\Aemeath-AI\data\`

数据文件：
- `pet.json` - 宠物状态数据
- `inventory.json` - 背包物品
- `settings.json` - 应用设置
- `feed_history.json` - 喂食记录

## 开发路线

### MVP (最小可行产品)
- [x] 项目框架搭建
- [x] 窗口管理（透明、置顶、拖拽）
- [x] 基础 UI 组件
- [x] 数据存储系统
- [ ] 动画系统
- [ ] 完整的喂食功能

### 第二阶段
- [ ] 探头动画
- [ ] 任务栏吸附
- [ ] 自动移动行为
- [ ] 表情系统

### 第三阶段
- [ ] 换装系统
- [ ] 音效和语音
- [ ] 小游戏互动

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
