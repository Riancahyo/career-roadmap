"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QuizCard } from '@/components/QuizCard';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizAnswer } from '@/types/career';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [
      ...answers.filter((a) => a.questionId !== quizQuestions[currentQuestion].id),
      {
        questionId: quizQuestions[currentQuestion].id,
        answer: selectedAnswer,
      },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = answers.find(
        (a) => a.questionId === quizQuestions[currentQuestion - 1].id
      );
      setSelectedAnswer(previousAnswer?.answer || null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    const finalAnswers = [
      ...answers.filter((a) => a.questionId !== quizQuestions[currentQuestion].id),
      {
        questionId: quizQuestions[currentQuestion].id,
        answer: selectedAnswer,
      },
    ];

    if (finalAnswers.length !== quizQuestions.length) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/analyze-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers.map((a) => a.answer),
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('careerRecommendation', JSON.stringify(data.recommendation));
        router.push('/result');
      } else {
        alert('Gagal menganalisis jawaban. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const canSubmit = selectedAnswer !== null;

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_95%)] relative overflow-clip">
      <Navbar />

      <div className="container relative z-10 px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-3">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffaa40]" />
            <span className="text-xs">Career Path Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Temukan Jalur Karir IT-mu
          </h1>
          <p className="text-white/60 text-xs sm:text-sm lg:text-base max-w-lg mx-auto">
            Jawab 10 pertanyaan untuk mendapatkan rekomendasi karir IT yang sesuai dengan minat dan bakatmu
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <QuizCard
            key={currentQuestion}
            question={quizQuestions[currentQuestion]}
            currentQuestion={currentQuestion + 1}
            totalQuestions={quizQuestions.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mt-5 sm:mt-6 max-w-3xl mx-auto"
        >
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sebelumnya
          </motion.button>

          {!isLastQuestion ? (
            <motion.button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Selanjutnya
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Lihat Hasil
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}