// app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    // 1. Get API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ text: 'API key not configured' }, { status: 500 });
    }

    // 2. Get text from request
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ text: 'No text provided' }, { status: 400 });
    }

    // 3. Get response from Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(text);
    const response = await result.response;
    
    // 4. Return simple text response
    return NextResponse.json({ text: response.text() });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { text: 'Sorry, I had trouble processing that request' },
      { status: 500 }
    );
  }
}