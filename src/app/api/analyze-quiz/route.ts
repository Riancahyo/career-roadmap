import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuizAnswers } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: 'Format jawaban tidak valid. Harus 10 jawaban.' },
        { status: 400 }
      );
    }

    const analysisText = await analyzeQuizAnswers(answers);
    
    let analysisResult;
    try {
      const cleanedText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
      
      if (!analysisResult.careerPath || !analysisResult.confidence) {
        throw new Error('Struktur hasil analisis tidak valid');
      }
      
    } catch (parseError) {
      console.error('Gagal parse AI response:', analysisText);
      return NextResponse.json(
        { 
          error: 'Gagal memproses hasil analisis',
          message: 'Format respons dari AI tidak valid',
          retry: true
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendation: analysisResult,
    });
    
  } catch (error: any) {
    console.error('Error analyzing quiz:', error);
    
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