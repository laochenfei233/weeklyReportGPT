import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 支持的语言列表
const locales = ['zh', 'en'];
const defaultLocale = 'zh';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否是静态资源或API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 文件扩展名
  ) {
    return NextResponse.next();
  }

  // 获取路径中是否有语言前缀
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // 重定向到带语言前缀的路径
    const locale = defaultLocale; // 默认使用中文
    const url = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // 排除所有静态资源、API和debug页面
    '/((?!_next|api|.*\\..*|debug|production-debug|quick-debug|markdown-test|admin|2fa).*)',
  ],
};
