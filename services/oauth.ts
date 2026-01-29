/**
 * OAuth 授权服务
 * 支持 GitHub、Apple、WeChat 第三方登录
 */

export type OAuthProvider = 'github' | 'apple' | 'wechat';

export interface OAuthUserInfo {
  id: string;
  nickname: string;
  avatar: string;
  email?: string;
  provider: OAuthProvider;
}

// OAuth 配置（从环境变量读取）
const getOAuthConfig = (provider: OAuthProvider) => {
  // 获取基础 URL，优先使用环境变量，否则使用当前 origin
  const getBaseUrl = () => {
    if (typeof window === 'undefined') return '';
    // 优先使用环境变量配置的站点 URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_OAUTH_REDIRECT_BASE_URL;
    if (siteUrl) {
      return siteUrl.replace(/\/$/, ''); // 移除末尾的斜杠
    }
    return window.location.origin;
  };

  const baseUrl = getBaseUrl();

  const configs: Record<OAuthProvider, { clientId: string; redirectUri: string; scope: string; authUrl: string }> = {
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
      redirectUri: `${baseUrl}/auth/callback/github`,
      scope: 'user:email',
      authUrl: 'https://github.com/login/oauth/authorize',
    },
    apple: {
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
      redirectUri: `${baseUrl}/auth/callback/apple`,
      scope: 'name email',
      authUrl: 'https://appleid.apple.com/auth/authorize',
    },
    wechat: {
      clientId: process.env.NEXT_PUBLIC_WECHAT_APP_ID || '',
      redirectUri: `${baseUrl}/auth/callback/wechat`,
      scope: 'snsapi_login',
      authUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    },
  };
  return configs[provider];
};

/**
 * 生成随机 state 用于防止 CSRF 攻击
 */
const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * 直接跳转到 OAuth 授权页面（用于 GitHub 等）
 */
export const authorizeWithRedirect = (provider: OAuthProvider): void => {
  const config = getOAuthConfig(provider);
  
  if (!config.clientId) {
    throw new Error(`${provider} OAuth 未配置，请设置环境变量`);
  }

  const state = generateState();
  sessionStorage.setItem(`oauth_state_${provider}`, state);
  
  // 保存当前页面 URL，用于回调后重定向
  const returnUrl = typeof window !== 'undefined' ? window.location.href : '/';
  sessionStorage.setItem(`oauth_return_url_${provider}`, returnUrl);

  // 构建授权 URL
  let authUrl = '';
  if (provider === 'github') {
    authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${state}`;
  } else if (provider === 'apple') {
    authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code id_token&scope=${config.scope}&response_mode=form_post&state=${state}`;
  } else if (provider === 'wechat') {
    authUrl = `${config.authUrl}?appid=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=${config.scope}&state=${state}#wechat_redirect`;
  }

  // 直接跳转
  window.location.href = authUrl;
};

/**
 * 使用弹出窗口进行 OAuth 授权
 */
export const authorizeWithPopup = (provider: OAuthProvider): Promise<OAuthUserInfo> => {
  return new Promise((resolve, reject) => {
    const config = getOAuthConfig(provider);
    
    if (!config.clientId) {
      reject(new Error(`${provider} OAuth 未配置，请设置环境变量`));
      return;
    }

    const state = generateState();
    sessionStorage.setItem(`oauth_state_${provider}`, state);

    // 构建授权 URL
    let authUrl = '';
    if (provider === 'github') {
      authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${state}`;
    } else if (provider === 'apple') {
      authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code id_token&scope=${config.scope}&response_mode=form_post&state=${state}`;
    } else if (provider === 'wechat') {
      authUrl = `${config.authUrl}?appid=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=${config.scope}&state=${state}#wechat_redirect`;
    }

    // 打开弹出窗口
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      authUrl,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      reject(new Error('无法打开弹出窗口，请检查浏览器弹窗设置'));
      return;
    }

    // 监听弹出窗口的消息
    const messageHandler = (event: MessageEvent) => {
      // 验证来源
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'oauth_success' && event.data.provider === provider) {
        window.removeEventListener('message', messageHandler);
        popup.close();
        sessionStorage.removeItem(`oauth_state_${provider}`);
        resolve(event.data.userInfo);
      } else if (event.data.type === 'oauth_error' && event.data.provider === provider) {
        window.removeEventListener('message', messageHandler);
        popup.close();
        sessionStorage.removeItem(`oauth_state_${provider}`);
        reject(new Error(event.data.error || 'OAuth 授权失败'));
      }
    };

    window.addEventListener('message', messageHandler);

    // 检查弹出窗口是否被关闭
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        sessionStorage.removeItem(`oauth_state_${provider}`);
        reject(new Error('用户取消了授权'));
      }
    }, 1000);
  });
};

/**
 * 处理 OAuth 回调（在回调页面中调用）
 */
export const handleOAuthCallback = async (
  provider: OAuthProvider,
  code: string | null,
  state: string | null
): Promise<OAuthUserInfo> => {
  const storedState = sessionStorage.getItem(`oauth_state_${provider}`);
  
  // 验证 state
  if (!state || state !== storedState) {
    throw new Error('Invalid state parameter');
  }

  sessionStorage.removeItem(`oauth_state_${provider}`);

  // 根据不同的 provider 获取用户信息
  switch (provider) {
    case 'github':
      return await handleGitHubCallback(code!);
    case 'apple':
      return await handleAppleCallback(code!);
    case 'wechat':
      return await handleWeChatCallback(code!);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

/**
 * 处理 GitHub OAuth 回调
 * 注意：由于安全原因，client_secret 不能暴露在前端
 * 需要后端 API 来处理 token 交换
 */
async function handleGitHubCallback(code: string): Promise<OAuthUserInfo> {
  const apiUrl = process.env.NEXT_PUBLIC_OAUTH_API_URL || '/api/auth/github';
  
  // 调用后端 API 交换 token
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to exchange code for token');
  }

  const { access_token } = await response.json();
  
  if (!access_token) {
    throw new Error('No access token received');
  }
  
  // 获取用户信息
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user info from GitHub');
  }

  const user = await userResponse.json();

  return {
    id: user.id.toString(),
    nickname: user.login || user.name || 'GitHub User',
    avatar: user.avatar_url || '',
    email: user.email,
    provider: 'github',
  };
}

/**
 * 处理 Apple OAuth 回调
 * Apple Sign In 需要后端支持来验证 JWT token
 */
async function handleAppleCallback(code: string): Promise<OAuthUserInfo> {
  const apiUrl = process.env.NEXT_PUBLIC_OAUTH_API_URL || '/api/auth/apple';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to verify Apple token');
  }

  const user = await response.json();

  return {
    id: user.sub || user.id || 'apple_user',
    nickname: user.name || user.email?.split('@')[0] || 'Apple User',
    avatar: '',
    email: user.email,
    provider: 'apple',
  };
}

/**
 * 处理 WeChat OAuth 回调
 * 微信 OAuth 需要后端支持（app_secret 不能暴露在前端）
 */
async function handleWeChatCallback(code: string): Promise<OAuthUserInfo> {
  const apiUrl = process.env.NEXT_PUBLIC_OAUTH_API_URL || '/api/auth/wechat';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to exchange WeChat code');
  }

  const user = await response.json();

  return {
    id: user.openid || 'wechat_user',
    nickname: user.nickname || '微信用户',
    avatar: user.headimgurl || '',
    provider: 'wechat',
  };
}
