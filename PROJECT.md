# MAGIKID Lab Opening Assistant — 项目介绍与技术方案

## 一、项目概述

**MAGIKID Lab Opening Assistant（MAGIKID Lab 开业助手）** 是一款专为 MAGIKID 机器人 & STEAM 教育品牌旗下各地 Lab（实验室/门店）定制的开业活动策划与管理工具。

- **目标用户**：MAGIKID 各地 Lab 主理人、运营人员
- **核心场景**：辅助团队系统化规划开业活动，涵盖嘉宾管理、活动流程、预算控制、物料追踪、任务清单等全流程事项
- **默认预设**：内置 Las Vegas Lab（2026-05-16 开业）的示例数据，可一键加载

---

## 二、项目结构

```
lab-openning-assistant/
└── index.html          # 全部源码（单文件应用，含 HTML/CSS/JS）
```

> 本项目为**纯前端单文件应用**，无需后端服务，无需构建工具，直接用浏览器打开 `index.html` 即可运行。

---

## 三、技术栈

### 前端基础

| 技术 | 版本 | 用途 |
|------|------|------|
| HTML5 | - | 应用结构 |
| CSS3 | - | 样式与动画（CSS 变量、Grid、Flexbox、@keyframes） |
| Vanilla JavaScript (ES6+) | - | 全部交互逻辑，无框架依赖 |

### CDN 引入的外部库

| 库 | 版本 | 用途 |
|----|------|------|
| [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) | 0.10.1 | PDF 导出（核心方案） |
| [Font Awesome](https://fontawesome.com/) | 6.4.0 | 图标系统 |
| [Google Fonts](https://fonts.google.com/) | - | 字体：Inter（英文）+ Noto Sans SC（中文） |

### 数据存储

- **`localStorage`**：所有用户数据持久化存储在浏览器本地，键名为 `magikidLabAssistant`
- **JSON 导出**：支持将数据导出为 `.json` 文件备份
- **JSON 导入**：支持从 `.json` 文件恢复数据（通过文件上传 + `FileReader` API）

### 国际化（i18n）

- 内置中英双语切换，语言偏好存储于 `localStorage`（键名 `magikidLabLang`）
- 所有 UI 文本通过语言包对象统一管理，运行时动态替换

---

## 四、核心功能模块

```
┌─────────────────────────────────────────────────────┐
│  快速看板（倒计时 / 嘉宾数 / 准备进度 / 预算总计）     │
├─────────────────────────────────────────────────────┤
│  Lab 基本信息   │  名称 / 开业日期 / 地址 / 电话       │
├─────────────────────────────────────────────────────┤
│  Lab 主理人     │  姓名 / 背景 / 邮箱                  │
├─────────────────────────────────────────────────────┤
│  活动流程       │  时间轴（时间 / 活动 / 详情）         │
├─────────────────────────────────────────────────────┤
│  嘉宾管理       │  列表 / 批量导入 / 邮件群发           │
├─────────────────────────────────────────────────────┤
│  互动体验项目   │  展示项目 / 负责人分配               │
├─────────────────────────────────────────────────────┤
│  抽奖 & 奖品    │  奖品设置 / 抽奖主持人               │
├─────────────────────────────────────────────────────┤
│  受众分析       │  年龄结构（数量 / 百分比双向联动）    │
├─────────────────────────────────────────────────────┤
│  人员分工       │  到场引导 / 接待 / VIP 接待          │
├─────────────────────────────────────────────────────┤
│  物料管理       │  海报 / 宣传视频 / 横幅条幅          │
├─────────────────────────────────────────────────────┤
│  社交媒体       │  Instagram / Facebook / YouTube /    │
│                 │  小红书 / 内容发布计划               │
├─────────────────────────────────────────────────────┤
│  活动预算       │  分类预算 / 实际支出 / 预算对比       │
├─────────────────────────────────────────────────────┤
│  任务清单       │  可勾选 / 可编辑 / 负责人分配        │
├─────────────────────────────────────────────────────┤
│  活动目标       │  CAMP 销售 / VEX 赛队报名目标        │
└─────────────────────────────────────────────────────┘
```

---

## 五、PDF 生成方案

### 使用库

**[html2pdf.js](https://github.com/eKoopmans/html2pdf.js) v0.10.1**（via CDN）

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

html2pdf.js 底层整合了：
- **html2canvas**：将 DOM 节点渲染为 Canvas 截图
- **jsPDF**：将 Canvas 图像转换并输出为 PDF 文件

### 实现原理

```
用户点击「PDF」按钮
        │
        ▼
动态创建白色背景 div（pdfContent）
将 appData 中的所有数据渲染为标准 HTML 表格/列表
        │
        ▼
将 pdfContent 临时挂载到 document.body（隐藏位置）
        │
        ▼
html2pdf().set(opt).from(pdfContent).save()
  ├─ html2canvas 截图（scale: 2，高清 + useCORS: true）
  └─ jsPDF 生成 A4 竖版 PDF
        │
        ▼
浏览器触发文件下载（自动命名）
从 document.body 移除临时节点
```

### PDF 输出配置

```javascript
const opt = {
    margin: 10,                              // 页边距 10mm
    filename: `MAGIKID-[Lab名]-[日期].pdf`,
    image: { type: 'jpeg', quality: 0.98 }, // JPEG 高质量截图
    html2canvas: {
        scale: 2,        // 2x 高清渲染
        useCORS: true    // 允许跨域图片资源
    },
    jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'              // A4 竖版
    }
};
```

### PDF 内容结构

生成的 PDF 为纯白底色，包含以下章节（有数据时自动显示）：

1. 封面标题（Lab 名称 + 开业计划）
2. 基本信息（开业日期 / 地址 / 电话）
3. Lab 主理人列表
4. 活动流程时间轴表格
5. 嘉宾名单表格
6. 互动体验项目
7. 奖品设置
8. 活动预算汇总表（含总计行）
9. 活动目标
10. 生成时间戳页脚

> PDF 样式独立于页面暗色主题，使用浅色/白色背景、黑色文字，确保打印友好性。

---

## 六、数据模型

```javascript
appData = {
    lab: { name, openingDate, address, phone },
    hosts:       [{ name, background, email }],
    guests:      [{ name, title, email, phone }],
    timeline:    [{ time, title, detail }],
    projects:    [{ name, lead }],
    prizes:      [{ name, quantity }],
    budget:      [{ category, amount, spent, note }],
    leads:       [{ name, role }],
    reception:   [{ name, role }],
    vips:        [{ name, role }],
    raffleHosts: [{ name }],
    posters:     [{ name, status }],
    videos:      [{ name, status }],
    banners:     [{ name, status }],
    socialPosts: [{ platform, content, date }],
    checklist:        Boolean[15],   // 任务完成状态
    checklistOwners:  String[15],    // 任务负责人
    promoProjects: String[],         // 宣传互动项目勾选
    ageGroups:     String[],         // 目标年龄段勾选
    social: { instagram, facebook, youtube, xiaohongshu },
    goals: { camp, vexElementary, vexMiddle, other }
}
```

---

## 七、其他特性

| 特性 | 说明 |
|------|------|
| **响应式设计** | 适配桌面宽屏，max-width: 1600px 居中布局 |
| **暗色科技主题** | 深色背景 + 电光蓝 / 金色双主色调，含发光动效 |
| **网格背景动效** | 固定定位网格线 + 渐变光晕，营造科技感 |
| **折叠面板** | 各信息区块可独立折叠/展开，节省屏幕空间 |
| **成就系统** | 内置 MAGIKID 品牌成就展示弹窗 |
| **预设数据** | 内置 Las Vegas Lab 完整示例数据，一键加载 |
| **邮件群发** | 内置邮件模板，支持复制嘉宾邮箱列表 |
| **年龄结构联动** | 输入人数自动计算百分比，反向亦然 |
| **多 Lab 选择器** | Header 含 Lab 切换下拉菜单（预留扩展） |

---

## 八、快速启动

无需安装任何依赖，直接在浏览器中打开：

```bash
# 方式一：直接双击文件
open index.html

# 方式二：本地 HTTP 服务（推荐，避免 CORS 限制）
npx serve .
# 或
python3 -m http.server 8080
```

访问 `http://localhost:8080` 即可使用。

---

*文档生成日期：2026-04-21*
