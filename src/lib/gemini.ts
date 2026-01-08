import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
Berdasarkan jawaban quiz berikut:

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
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
    });

    return response.text || '{}';
  } catch (error) {
    console.error('Error analyzing quiz:', error);
    throw error;
  }
};

export const chatWithAI = async (
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> => {
  const systemPrompt = `Kamu adalah career advisor untuk mahasiswa IT di Indonesia yang santai dan to-the-point.

ATURAN PENTING:
- Jawab SINGKAT dan PADAT (maksimal 2-3 kalimat atau 1 paragraf pendek)
- Langsung ke intinya, no fluff
- Kalau bisa dijawab dengan bullet points, pakai bullet points
- Hindari intro panjang seperti "Wah pertanyaan bagus!" atau penutup panjang
- Fokus pada informasi praktis yang bisa langsung dipakai

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

Gunakan bahasa Indonesia yang santai, seperti ngobrol dengan teman.`;

  const chatHistory = conversationHistory
    .slice(-4) 
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}

Riwayat percakapan:
${chatHistory}

User: ${userMessage}

Jawab SINGKAT (maksimal 2-3 kalimat atau 1 paragraf pendek). Langsung to the point!`;

  try {
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          maxOutputTokens: 150, 
        },
      });
    }, 2); 

    return response.text || 'Maaf, saya tidak bisa memberikan respons saat ini.';
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
};