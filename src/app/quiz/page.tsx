"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QuizCard } from '@/components/QuizCard';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizAnswer } from '@/types/career';
import { ArrowLeft, ArrowRight, Sparkles, Menu as MenuIcon } from 'lucide-react';
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

      <div className="container relative z-10 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#ffaa40]" />
            <span className="text-sm">Career Path Finder</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Temukan Jalur Karir IT-mu
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
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
          className="flex justify-between items-center mt-8 max-w-3xl mx-auto"
        >
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Sebelumnya
          </motion.button>

          {!isLastQuestion ? (
            <motion.button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
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