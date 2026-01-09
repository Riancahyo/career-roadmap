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
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/60 mb-1.5">
          <span>Pertanyaan {currentQuestion} dari {totalQuestions}</span>
          <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:200%_100%] animate-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-[inset_0_-8px_10px_#8fdfff1f]">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4">
          {question.question}
        </h2>

        <div className="space-y-2 sm:space-y-2.5">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => onSelectAnswer(option)}
              className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedAnswer === option
                  ? 'border-[#9c40ff] bg-[#9c40ff]/20 shadow-[0_0_20px_#ffaa4040]'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedAnswer === option
                      ? 'border-[#9c40ff] bg-[#9c40ff]'
                      : 'border-white/40'
                  }`}
                >
                  {selectedAnswer === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"
                    />
                  )}
                </div>
                <span className="text-white text-xs sm:text-sm">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};