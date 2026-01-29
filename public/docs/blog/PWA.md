---
slug: pwa
title: PWA
excerpt: ## PWA  #### APP manifest  #### service worker  #### web push
date: 2025-12-18
author: 小菜权
readTime: 1 分钟
tags: []
category: blog
image: https://picsum.photos/seed/701/1200/600
---

## PWA (Progressive Web App)

Progressive Web App（渐进式 Web 应用）是一种使用 Web 技术构建的应用程序，它能够提供类似原生应用的体验。PWA 结合了 Web 的灵活性和原生应用的强大功能，让用户可以在浏览器中享受流畅的应用体验。

### APP Manifest

APP Manifest 是一个 JSON 文件，用于定义 Web 应用如何显示和启动。它包含了应用的元数据，如名称、图标、启动画面、显示模式等。

#### 基本配置

```json
{
  "name": "我的应用",
  "short_name": "应用",
  "description": "应用的描述信息",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 关键属性说明

- **name**: 应用的完整名称，显示在启动画面和应用列表中
- **short_name**: 应用的简短名称，当空间有限时使用
- **display**: 显示模式，可选值包括 `standalone`（独立窗口）、`fullscreen`（全屏）、`minimal-ui`（最小化 UI）
- **theme_color**: 主题颜色，影响浏览器地址栏和状态栏的颜色
- **icons**: 应用图标数组，需要提供多种尺寸以适应不同场景

### Service Worker

Service Worker 是 PWA 的核心技术，它是一个在浏览器后台运行的脚本，独立于网页，可以拦截网络请求、缓存资源、推送通知等。

#### 注册 Service Worker

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker 注册成功');
    })
    .catch(error => {
      console.log('Service Worker 注册失败');
    });
}
```

#### 缓存策略

Service Worker 可以实现多种缓存策略：

1. **Cache First**: 优先使用缓存，适合静态资源
2. **Network First**: 优先使用网络，适合动态内容
3. **Stale While Revalidate**: 先返回缓存，同时更新缓存
4. **Network Only**: 只使用网络，不缓存
5. **Cache Only**: 只使用缓存，不请求网络

#### 离线支持

通过 Service Worker 可以实现离线访问功能，即使没有网络连接，用户也能访问已缓存的内容。

### Web Push

Web Push 允许 Web 应用向用户推送通知，即使浏览器已关闭。这是 PWA 的一个重要特性，可以显著提升用户 engagement。

#### 推送流程

1. **用户授权**: 请求用户允许接收推送通知
2. **订阅**: 获取推送订阅对象（PushSubscription）
3. **发送推送**: 服务器使用订阅信息发送推送消息
4. **显示通知**: Service Worker 接收并显示通知

#### 实现示例

```javascript
// 请求通知权限
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // 订阅推送
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    });
  }
});
```

### PWA 的优势

1. **无需安装**: 用户可以直接通过浏览器访问，无需从应用商店下载
2. **跨平台**: 一套代码可以在多个平台上运行
3. **离线可用**: 通过 Service Worker 实现离线访问
4. **自动更新**: 应用可以自动更新，无需用户手动操作
5. **轻量级**: 相比原生应用，PWA 的体积更小，加载更快

### 最佳实践

- 确保应用在 HTTPS 环境下运行（Service Worker 要求）
- 提供高质量的图标和启动画面
- 实现合理的缓存策略，平衡性能和实时性
- 优化首屏加载速度，提升用户体验
- 合理使用推送通知，避免打扰用户

PWA 技术为 Web 应用带来了新的可能性，让 Web 应用能够提供接近原生应用的体验，是前端开发中值得深入学习和应用的技术。
