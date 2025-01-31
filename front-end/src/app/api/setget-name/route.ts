import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name } = await request.json();
  const cookieStore = await cookies();

  // Get the current host from the request headers
  const host = request.headers.get('host') || '';
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set({
    name: 'onboardingName',
    value: name,
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
    httpOnly: true,
    // For EC2, use the root domain without port
    domain: isProduction ? host.split(':')[0] : undefined,
    // Set a longer maxAge to ensure the cookie persists through the auth flow
    maxAge: 60 * 5 // 5 minutes
  });

  return NextResponse.json({ success: true });
}



