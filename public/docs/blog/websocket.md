---
slug: websocket
title: websocket
excerpt: 
date: 2025-12-18
author: 小菜权
readTime: 1 分钟
tags: []
category: blog
image: https://picsum.photos/seed/376/1200/600
---

## WebSocket 实时通信技术

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，它允许服务器主动向客户端推送数据，实现了真正的实时双向通信。相比传统的 HTTP 轮询方式，WebSocket 具有更低的延迟和更高的效率。

### WebSocket 的优势

1. **实时性**: 服务器可以主动推送数据，无需客户端轮询
2. **低延迟**: 建立连接后，数据传输延迟极低
3. **减少带宽**: 不需要频繁建立 HTTP 连接
4. **全双工通信**: 客户端和服务器可以同时发送数据

### 基本用法

#### 客户端实现

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:8080');

// 连接打开
ws.onopen = () => {
  console.log('WebSocket 连接已建立');
  ws.send('Hello Server');
};

// 接收消息
ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

// 连接关闭
ws.onclose = () => {
  console.log('WebSocket 连接已关闭');
};

// 错误处理
ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

// 发送消息
ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));

// 关闭连接
ws.close();
```

#### 服务器端实现（Node.js）

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('新客户端连接');

  // 接收消息
  ws.on('message', (message) => {
    console.log('收到消息:', message);
    // 广播给所有客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 连接关闭
  ws.on('close', () => {
    console.log('客户端断开连接');
  });

  // 发送欢迎消息
  ws.send('欢迎连接到 WebSocket 服务器');
});
```

### 连接状态

WebSocket 有以下几种状态：

- **CONNECTING (0)**: 连接正在建立
- **OPEN (1)**: 连接已建立，可以通信
- **CLOSING (2)**: 连接正在关闭
- **CLOSED (3)**: 连接已关闭

```javascript
if (ws.readyState === WebSocket.OPEN) {
  ws.send('消息');
}
```

### 心跳机制

为了保持连接活跃，通常需要实现心跳机制：

```javascript
let heartbeatInterval;

ws.onopen = () => {
  // 每 30 秒发送一次心跳
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
};

ws.onclose = () => {
  clearInterval(heartbeatInterval);
};
```

### 重连机制

网络不稳定时，需要实现自动重连：

```javascript
let reconnectTimer;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('连接成功');
    reconnectAttempts = 0;
  };

  ws.onclose = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectTimer = setTimeout(connect, delay);
      console.log(`将在 ${delay}ms 后重连...`);
    }
  };

  return ws;
}

const ws = connect();
```

### 实际应用场景

1. **实时聊天**: 即时通讯应用
2. **在线游戏**: 多人在线游戏
3. **股票行情**: 实时数据推送
4. **协作编辑**: 多人同时编辑文档
5. **监控系统**: 实时监控数据展示
6. **通知系统**: 实时通知推送

### 安全考虑

1. **使用 WSS**: 生产环境必须使用 `wss://`（WebSocket Secure）
2. **身份验证**: 在建立连接时进行身份验证
3. **消息验证**: 验证接收到的消息格式和内容
4. **速率限制**: 防止恶意客户端发送大量消息
5. **CORS 配置**: 正确配置跨域资源共享

### 与 HTTP 轮询对比

| 特性 | WebSocket | HTTP 轮询 |
|------|-----------|-----------|
| 延迟 | 极低 | 较高 |
| 服务器压力 | 低 | 高 |
| 带宽消耗 | 低 | 高 |
| 实时性 | 优秀 | 一般 |
| 复杂度 | 中等 | 低 |

### 最佳实践

1. **错误处理**: 实现完善的错误处理和重连机制
2. **消息格式**: 使用 JSON 等标准格式，便于解析和扩展
3. **连接管理**: 合理管理连接生命周期，及时清理资源
4. **性能优化**: 避免频繁发送小消息，考虑批量处理
5. **监控日志**: 记录连接状态和消息日志，便于排查问题

WebSocket 是现代 Web 应用中实现实时通信的重要技术，掌握 WebSocket 的使用对于构建实时应用至关重要。
