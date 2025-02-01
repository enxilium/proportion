import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name } = await request.json();
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'onboardingName',
    value: name,
    path: '/',
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24,
    httpOnly: true
  });


  return NextResponse.json({ success: true });

}



