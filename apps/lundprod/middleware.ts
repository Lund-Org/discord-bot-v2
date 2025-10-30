import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  const { pathname } = req.nextUrl;

  // exclude all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // next files should also behave normally
  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // exclude files from public folder
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  const hostname = req.headers.get('host');

  // Request without hostname usually comes from revalidate
  if (hostname === null) {
    return NextResponse.next();
  }

  if (hostname.startsWith('gacha')) {
    url.pathname = `/gacha${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
