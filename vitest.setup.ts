import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// 扩展 expect 匹配器
expect.extend({
  // 可以在这里添加自定义匹配器
});

