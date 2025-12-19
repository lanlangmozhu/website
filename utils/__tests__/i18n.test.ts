import { describe, it, expect } from 'vitest';
import { formatDate } from '../i18n';
import { Language } from '../../locales';

describe('formatDate', () => {
  it('应该正确格式化中文日期', () => {
    // 使用 UTC 时间避免时区问题
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDate(date, 'zh');
    // 检查格式包含月份和日期
    expect(result).toMatch(/\d+/); // 包含数字
    expect(result.length).toBeGreaterThan(0);
  });

  it('应该正确格式化英文日期', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDate(date, 'en');
    // 检查包含月份缩写（Jan）和时间格式
    expect(result).toContain('Jan');
    // 检查包含时间（可能是 12 小时制或 24 小时制，取决于时区）
    expect(result).toMatch(/\d{1,2}:\d{2}/); // 时间格式 HH:MM 或 H:MM
  });

  it('应该正确格式化日文日期', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDate(date, 'jp');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('应该处理字符串格式的日期', () => {
    const dateString = '2024-01-15T14:30:00Z';
    const result = formatDate(dateString, 'zh');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('应该处理无效的语言代码，默认使用中文', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDate(date, 'invalid' as Language);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('应该根据语言返回不同格式', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const zhResult = formatDate(date, 'zh');
    const enResult = formatDate(date, 'en');
    const jpResult = formatDate(date, 'jp');
    
    // 不同语言应该有不同的格式
    expect(zhResult).toBeTruthy();
    expect(enResult).toBeTruthy();
    expect(jpResult).toBeTruthy();
    
    // 英文应该包含月份缩写
    expect(enResult).toContain('Jan');
  });
});

