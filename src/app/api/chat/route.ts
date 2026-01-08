import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await chatWithAI(message, history || []);

    return NextResponse.json({
      success: true,
      message: response,
    });
    
  } catch (error: any) {
    console.error('Error in chat:', error);
    
    if (error?.status === 503) {
      return NextResponse.json(
        { 
          error: 'Service temporarily unavailable',
          message: 'AI sedang sibuk. Coba lagi dalam beberapa saat ya!',
          retry: true
        },
        { status: 503 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Terlalu banyak request. Tunggu sebentar ya!',
          retry: true
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Maaf, terjadi kesalahan. Coba lagi ya!',
        retry: true
      },
      { status: 500 }
    );
  }
}