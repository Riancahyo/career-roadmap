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
          className="w-16 h-16 border-4 border-[#9c40ff] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_50%,#4F21A1_95%)] py-12 sm:py-24 relative overflow-clip">

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] px-6 py-3 rounded-full mb-6"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Hasil Analisis</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            {recommendation.careerPath}
          </h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Confidence Score:</span>
            </div>
            <span className="text-2xl font-bold text-[#ffaa40]">{recommendation.confidence}%</span>
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-[inset_0_-8px_10px_#8fdfff1f]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Kenapa Cocok Untukmu?</h2>
            </div>
            <ul className="space-y-3">
              {recommendation.reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex gap-3 text-white/80"
                >
                  <span className="text-[#ffaa40] mt-1">•</span>
                  <span>{reason}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-[inset_0_-8px_10px_#8fdfff1f]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Skills yang Dibutuhkan</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendation.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm"
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
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-[inset_0_-8px_10px_#8fdfff1f] md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Roadmap Belajar</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendation.learningPath.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-white/80">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-[inset_0_-8px_10px_#8fdfff1f] md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Sumber Belajar Rekomendasi</h2>
            </div>
            <ul className="space-y-2">
              {recommendation.resources.map((resource, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex gap-3 text-white/80 text-sm"
                >
                  <span className="text-[#9c40ff]">→</span>
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
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            onClick={() => {
              const path = getCareerPath(recommendation.careerPath);
              router.push(`/roadmap/${path}`);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5" />
            Lihat Roadmap
          </motion.button>

          <motion.button
            onClick={() => router.push('/ai-chat')}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5" />
            Chat dengan AI
          </motion.button>
          
          <motion.button
            onClick={() => {
              localStorage.removeItem('careerRecommendation');
              router.push('/quiz');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Ulangi Quiz
          </motion.button>

          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors"
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