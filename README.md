# JSON Formatter

一个在线 JSON 格式化、校验和可视化工具，使用 Vue 3 + TypeScript + Vite 构建。

## 功能特性

- **JSON 格式化/压缩**：一键格式化或压缩 JSON 数据
- **实时校验**：输入时自动校验 JSON 语法
- **多种视图**：
  - 编辑器视图：语法高亮的代码展示
  - 表格视图：数组数据以表格形式展示
  - 树形视图：可折叠的树形结构
  - 类型视图：展示各字段数据类型
- **导入导出**：支持上传 JSON 文件和下载结果
- **撤销/重做**：编辑历史记录
- **复制功能**：一键复制格式化结果
- **可调节布局**：左右分栏可拖拽调整宽度
- **设置记忆**：字体大小、缩进等设置自动保存

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Vite
- Tailwind CSS
- CodeMirror 6
- Lucide Vue Icons

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 部署

项目配置了 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 或 `master` 分支后会自动构建并部署。

手动部署：

1. 在 GitHub 仓库设置中启用 GitHub Pages
2. 选择 Source 为 GitHub Actions
3. 推送代码到主分支，自动触发部署

## License

MIT
