'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleOAuthCallback } from '@/services/oauth';
import { Loader2 } from 'lucide-react';

const OAuthCallbackInner: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = 'apple' as const;

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          // 如果是弹出窗口模式，发送错误消息给父窗口
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'oauth_error',
                provider,
                error: errorDescription || error,
              },
              window.location.origin
            );
            window.close();
            return;
          }
          router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        if (!code || !state) {
          throw new Error('缺少必要的授权参数');
        }

        // 处理 OAuth 回调
        const userInfo = await handleOAuthCallback(provider, code, state);

        // 判断是弹出窗口模式还是直接跳转模式
        const isPopup = window.opener !== null;

        if (isPopup) {
          // 弹出窗口模式：发送消息给父窗口
          window.opener.postMessage(
            {
              type: 'oauth_success',
              provider,
              userInfo,
            },
            window.location.origin
          );
          setTimeout(() => {
            window.close();
          }, 100);
        } else {
          // 直接跳转模式：自动登录并重定向
          const { loginUser } = await import('@/services/auth');
          const avatar = userInfo.avatar || '';
          await loginUser(userInfo.nickname, avatar);
          
          let returnUrl = sessionStorage.getItem(`oauth_return_url_${provider}`) || '/';
          sessionStorage.removeItem(`oauth_return_url_${provider}`);
          
          if (returnUrl.includes('/login')) {
            returnUrl = '/';
          }
          
          router.push(returnUrl);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        
        const isPopup = window.opener !== null;
        const errorMessage = error instanceof Error ? error.message : '授权处理失败';
        
        if (isPopup) {
          window.opener.postMessage(
            {
              type: 'oauth_error',
              provider,
              error: errorMessage,
            },
            window.location.origin
          );
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          router.push(`/login?error=${encodeURIComponent(errorMessage)}`);
        }
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
        <p className="text-gray-600 dark:text-gray-400">正在处理授权...</p>
      </div>
    </div>
  );
};

export default function AppleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
