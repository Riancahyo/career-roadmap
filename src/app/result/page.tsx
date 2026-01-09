"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CareerRecommendation } from '@/types/career';
import { Trophy, Target, BookOpen, Lightbulb, Share2, RotateCcw, MessageSquare } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null);

  useEffect(() => {
    const savedRecommendation = localStorage.getItem('careerRecommendation');
    if (savedRecommendation) {
      setRecommendation(JSON.parse(savedRecommendation));
    } else {
      router.push('/quiz');
    }
  }, [router]);

  const getCareerPath = (careerName: string): string => {
    const pathMap: { [key: string]: string } = {
      'Frontend Developer': 'frontend-developer',
      'Backend Developer': 'backend-developer',
      'UI/UX Designer': 'uiux-designer',
      'Full Stack Developer': 'fullstack-developer',
      'Data Analyst': 'data-analyst',
      'Data Scientist': 'data-scientist',
      'DevOps Engineer': 'devops-engineer',
      'Game Developer': 'game-developer',
      'Machine Learning Engineer': 'machine-learning-engineer',
      'Mobile Developer': 'mobile-developer',
      'Cybersecurity Specialist': 'cybersecurity-specialist',
    };
    return pathMap[careerName] || 'frontend-developer';
  };

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#ffaa40] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_50%,#4F21A1_95%)] py-8 sm:py-12 lg:py-16 relative overflow-clip">

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-[#ffaa40] px-4 sm:px-5 py-2 rounded-full mb-4 sm:mb-5"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">Hasil Analisis</span>
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {recommendation.careerPath}
          </h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full border border-white/20"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm">Confidence:</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#ffaa40]">{recommendation.confidence}%</span>
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 shadow-[inset_0_-8px_10px_#8fdfff1f]"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ffaa40] rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">Kenapa Cocok Untukmu?</h2>
            </div>
            <ul className="space-y-2 sm:space-y-2.5">
              {recommendation.reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex gap-2 text-white/80 text-xs sm:text-sm"
                >
                  <span className="text-[#ffaa40] mt-0.5">•</span>
                  <span>{reason}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 shadow-[inset_0_-8px_10px_#8fdfff1f]"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ffaa40] rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">Skills yang Dibutuhkan</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendation.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1.5 bg-white/5 border border-white/20 rounded-full text-xs"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 shadow-[inset_0_-8px_10px_#8fdfff1f] md:col-span-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ffaa40] rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">Roadmap Belajar</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendation.learningPath.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex gap-2 sm:gap-2.5 p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#ffaa40] rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-white/80">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 shadow-[inset_0_-8px_10px_#8fdfff1f] md:col-span-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ffaa40] rounded-lg flex items-center justify-center">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">Sumber Belajar Rekomendasi</h2>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {recommendation.resources.map((resource, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex gap-2 text-white/80 text-xs sm:text-sm"
                >
                  <span className="text-[#ffaa40]">→</span>
                  <span>{resource}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          <motion.button
            onClick={() => {
              const path = getCareerPath(recommendation.careerPath);
              router.push(`/roadmap/${path}`);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#ffaa40] rounded-lg font-medium text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-4 h-4" />
            Lihat Roadmap
          </motion.button>

          <motion.button
            onClick={() => router.push('/ai-chat')}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-4 h-4" />
            Chat dengan AI
          </motion.button>
          
          <motion.button
            onClick={() => {
              localStorage.removeItem('careerRecommendation');
              router.push('/quiz');
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Quiz
          </motion.button>

          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kembali ke Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}