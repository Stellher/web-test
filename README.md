# Sparkle · Liquid Glass V2

Sparkle 静态网站的 Liquid Glass（液态玻璃）交互式设计预览。项目根目录可直接部署到 GitHub Pages。

**部署目标：** https://stellher.github.io/web-test/

## 项目功能

- 模拟玻璃边缘折射、色散、镜面高光和动态交互反馈
- iOS 风格玻璃搜索/导航组件；弥散渐变氛围背景
- 搜索、筛选、收藏、浅色/深色主题切换
- 适配桌面浏览器和手机

## 本地运行

这是纯静态网页，没有 npm 构建依赖。可以直接打开 `index.html`，或在项目根目录运行：

```bash
python3 -m http.server 8080
```

访问 http://localhost:8080 。

## 自动发布

`.github/workflows/deploy-pages.yml` 会在推送 `main` 分支时自动构建和部署 GitHub Pages。

首次使用 GitHub Pages 时，仓库所有者需在 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**。
完成后可在 `Actions → Deploy Sparkle Liquid Glass → Run workflow` 重新触发部署。

## 代码结构

- `index.html`：网页结构
- `css/styles.css`：基本样式与响应式设计
- `css/liquid.css`：液态玻璃光学样式
- `js/app.js`：搜索、资源列表、导航、收藏与主题交互
- `js/liquid.js`：折射位移图和鼠标响应
- `assets/sparkle.svg`：品牌图标
- `CREDITS.md`：参考项目与许可声明

## 重要说明

- 这是前端静态演示，不包含 `stobox.dpdns.org` 生产环境的 API、登录与数据库。
- 参考 [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react) 的 MIT 许可实现设计，但为了支持静态 GitHub Pages 部署，当前版本以原生 CSS/JavaScript 独立实现，**没有直接安装 React 依赖**。
- 不同浏览器对 SVG 位移、`backdrop-filter` 的支持不完全一致。特别是 Safari / Firefox 的边缘折射可能降级。
- `demo-test` 与生产域名均不受此仓库部署影响。
