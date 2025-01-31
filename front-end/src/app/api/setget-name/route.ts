import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name } = await request.json();
  console.log(name);
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'onboardingName',
    value: name,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',

    httpOnly: true
  });

  const cookieRetrieved = cookieStore.get('onboardingName');
  console.log(cookieRetrieved);

  return NextResponse.json({ success: true });

}



