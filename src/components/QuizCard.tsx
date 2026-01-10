"use client"
import { motion } from 'framer-motion';
import { QuizQuestion } from '@/types/career';
import { Check } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswers: string[]; 
  onSelectAnswer: (answer: string) => void;
  maxSelections?: number; 
}

export const QuizCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswers,
  onSelectAnswer,
  maxSelections = 3,
}: QuizCardProps) => {
  const isSelected = (option: string) => selectedAnswers.includes(option);
  const canSelectMore = selectedAnswers.length < maxSelections;

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
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2">
          {question.question}
        </h2>

        <p className="text-white/60 text-xs mb-4">
          Pilih maksimal {maxSelections} jawaban yang paling sesuai ({selectedAnswers.length}/{maxSelections} dipilih)
        </p>

        <div className="space-y-2 sm:space-y-2.5">
          {question.options.map((option, index) => {
            const selected = isSelected(option);
            const disabled = !selected && !canSelectMore;

            return (
              <motion.button
                key={index}
                onClick={() => onSelectAnswer(option)}
                disabled={disabled}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                  selected
                    ? 'border-[#9c40ff] bg-[#9c40ff]/20 shadow-[0_0_20px_#ffaa4040]'
                    : disabled
                    ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }`}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selected
                        ? 'border-[#9c40ff] bg-[#9c40ff]'
                        : disabled
                        ? 'border-white/20'
                        : 'border-white/40'
                    }`}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm ${selected ? 'text-white font-medium' : disabled ? 'text-white/40' : 'text-white'}`}>
                    {option}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};