import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error?.status && error.status !== 503 && error.status !== 429) {
        throw error;
      }
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export const analyzeQuizAnswers = async (answers: string[]): Promise<string> => {
  const prompt = `
Kamu adalah career advisor untuk mahasiswa IT yang sedang bingung memilih jalur karir.
Berdasarkan jawaban quiz berikut (beberapa jawaban mungkin berisi multiple pilihan yang dipisah dengan ' | '):

${answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')}

Jalur karir IT yang tersedia:
- Frontend Developer
- Backend Developer
- UI/UX Designer
- Data Scientist
- Data Analyst
- DevOps Engineer
- Machine Learning Engineer
- Game Developer
- Mobile Developer
- Full Stack Developer

Analisis jawaban tersebut dan berikan rekomendasi dalam format JSON:
{
  "careerPath": "nama jalur karir yang paling cocok",
  "confidence": 85,
  "reasons": ["alasan 1", "alasan 2", "alasan 3"],
  "learningPath": ["langkah belajar 1", "langkah 2", "langkah 3"],
  "skills": ["skill 1", "skill 2", "skill 3"],
  "resources": ["resource 1", "resource 2", "resource 3"]
}

Berikan rekomendasi yang paling sesuai dengan pola jawaban.
Jawab HANYA dalam format JSON, tanpa penjelasan tambahan.
`;

  try {
    const response = await retryWithBackoff(async () => {
      const model = ai.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });
      
      const result = await model.generateContent(prompt);
      return result.response;
    });

    return response.text() || '{}';
  } catch (error) {
    console.error('Error analyzing quiz:', error);
    throw error;
  }
};

export const chatWithAI = async (
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> => {
  const systemPrompt = `Kamu adalah career advisor untuk mahasiswa IT di Indonesia. 
Tugasmu membantu mereka menemukan jalur karir yang sesuai dengan minat dan kemampuan mereka.

Jalur karir IT yang bisa kamu rekomendasikan:
- Frontend Developer
- Backend Developer
- UI/UX Designer
- Data Scientist
- Data Analyst
- DevOps Engineer
- Machine Learning Engineer
- Game Developer
- Mobile Developer
- Full Stack Developer

Berikan saran yang praktis, ramah, dan memotivasi. 
Gunakan bahasa Indonesia yang santai tapi profesional.

PENTING: Jangan gunakan markdown formatting seperti *, **, atau _ untuk bold/italic. Tulis teks biasa saja tanpa formatting khusus.`;

  const chatHistory = conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}

Riwayat percakapan:
${chatHistory}

User: ${userMessage}

Jawab dengan ramah dan helpful. Jangan terlalu panjang (maksimal 1-2 paragraf).`;

  try {
    const response = await retryWithBackoff(async () => {
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const result = await model.generateContent(fullPrompt);
      return result.response;
    }, 2); 
    
    return response.text() || 'Maaf, saya tidak bisa memberikan respons saat ini.';
  } catch (error: any) {
    console.error('Error in chat:', error);

    if (error?.status === 429) {
      throw new Error('Maaf, quota API sudah habis. Silakan coba lagi besok.');
    }
    throw error;
  }
};