"use client"
import { motion } from 'framer-motion';
import { RoadmapNode as RoadmapNodeType } from '@/types/roadmap';
import { CheckCircle2, Circle, ExternalLink, Clock } from 'lucide-react';

interface RoadmapNodeProps {
  node: RoadmapNodeType;
  isCompleted: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

const categoryColors = {
  fundamentals: 'from-blue-500 to-cyan-500',
  core: 'from-purple-500 to-pink-500',
  advanced: 'from-orange-500 to-red-500',
  specialization: 'from-green-500 to-emerald-500',
};

export const RoadmapNode = ({ node, isCompleted, isUnlocked, onClick }: RoadmapNodeProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)',
      }}
      className="z-10"
    >
      <motion.button
        onClick={onClick}
        disabled={!isUnlocked}
        className={`relative group ${!isUnlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        whileHover={isUnlocked ? { scale: 1.1 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
      >
        <div
          className={`w-32 h-32 rounded-2xl backdrop-blur-sm border-2 flex flex-col items-center justify-center p-4 transition-all ${
            isCompleted
              ? 'bg-gradient-to-br from-[#9c40ff] to-[#ffaa40] border-[#ffaa40] shadow-[0_0_30px_rgba(255,170,64,0.5)]'
              : isUnlocked
              ? `bg-gradient-to-br ${categoryColors[node.category]} border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]`
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="absolute -top-2 -right-2">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-gradient-to-br from-[#ffaa40] to-[#9c40ff] rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
              </motion.div>
            ) : isUnlocked ? (
              <Circle className="w-6 h-6 text-white/40" />
            ) : (
              <div className="w-6 h-6 bg-white/10 rounded-full" />
            )}
          </div>

          <h3 className="text-white font-bold text-sm text-center leading-tight">
            {node.title}
          </h3>

          <div className="flex items-center gap-1 mt-2 text-white/60">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{node.estimatedWeeks}w</span>
          </div>
        </div>

        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
          >
            <p className="text-white/80 text-xs leading-relaxed">{node.description}</p>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-white/60 text-xs">Klik untuk lihat detail & resources</p>
            </div>
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};