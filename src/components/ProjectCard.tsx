"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { Clock, Users } from 'lucide-react';
import { getProjectProgress, getCompletionPercentage } from '@/lib/projectTracking';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');

  useEffect(() => {
    const projectProgress = getProjectProgress(project.id);
    if (projectProgress) {
      setStatus(projectProgress.status);
      const percentage = getCompletionPercentage(project.id, project.requirements.length);
      setProgress(percentage);
    }
  }, [project.id, project.requirements.length]);

  return (
    <motion.div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer group relative"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Status Badge */}
      {status !== 'not-started' && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${
            status === 'completed'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {status === 'completed' ? '✓ Completed' : `${progress}%`}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 pr-16 sm:pr-20">
          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 group-hover:text-[#ffaa40] transition-colors">
            {project.title}
          </h3>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
            +{project.tags.length - 3}
          </span>
        )}
      </div>

      {status === 'in-progress' && (
        <div className="mb-3 sm:mb-4">
          <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ffaa40] to-[#9c40ff]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${
              difficultyColors[project.difficulty]
            }`}
          >
            {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
          </span>

          <div className="flex items-center gap-1 text-white/60 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{project.estimatedHours}h</span>
          </div>
        </div>

        {project.participants && (
          <div className="flex items-center gap-1 text-white/60 text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{project.participants.toLocaleString()} Started</span>
            <span className="sm:hidden">{project.participants > 999 ? `${Math.floor(project.participants / 1000)}k` : project.participants}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};