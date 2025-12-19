import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { UserProfile } from '../types';

const USER_STORAGE_KEY = 'site_user_profile';

// 延迟加载，只在客户端环境中初始化
let fpPromise: Promise<any> | null = null;

const getFingerprintPromise = () => {
  if (typeof window === 'undefined') {
    // 服务端环境，返回一个拒绝的 Promise
    return Promise.reject(new Error('FingerprintJS can only be used in browser environment'));
  }
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
};

export const getVisitorId = async (): Promise<string> => {
  const fp = await getFingerprintPromise();
  const result = await fp.get();
  return result.visitorId;
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const loginUser = async (nickname: string, avatar: string): Promise<UserProfile> => {
  if (typeof window === 'undefined') {
    throw new Error('loginUser can only be called in browser environment');
  }
  const visitorId = await getVisitorId();
  
  const profile: UserProfile = {
    userId: visitorId,
    nickname,
    avatar,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  
  const os = navigator.platform;
  return `${browser} on ${os}`;
};
