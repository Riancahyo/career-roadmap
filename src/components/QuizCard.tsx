"use client"
import { motion } from 'framer-motion';
import { QuizQuestion } from '@/types/career';

interface QuizCardProps {
  question: QuizQuestion;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

export const QuizCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuizCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Pertanyaan {currentQuestion} dari {totalQuestions}</span>
          <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:200%_100%] animate-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-[inset_0_-8px_10px_#8fdfff1f]">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => onSelectAnswer(option)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedAnswer === option
                  ? 'border-[#9c40ff] bg-[#9c40ff]/20 shadow-[0_0_20px_#9c40ff40]'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? 'border-[#9c40ff] bg-[#9c40ff]'
                      : 'border-white/40'
                  }`}
                >
                  {selectedAnswer === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  )}
                </div>
                <span className="text-white text-lg">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};