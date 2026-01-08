"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/project';
import { X, Clock, CheckCircle, Target, ExternalLink, PlayCircle, CheckCircle2 } from 'lucide-react';
import { startProject, getProjectProgress, updateProjectStatus, toggleRequirement, getCompletionPercentage } from '@/lib/projectTracking';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  careerPath: string;
}

export const ProjectModal = ({ project, isOpen, onClose, careerPath }: ProjectModalProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [completedRequirements, setCompletedRequirements] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');

  useEffect(() => {
    if (project) {
      const progress = getProjectProgress(project.id);
      if (progress) {
        setIsStarted(true);
        setProjectStatus(progress.status);
        setCompletedRequirements(progress.checklist);
      } else {
        setIsStarted(false);
        setProjectStatus('not-started');
        setCompletedRequirements([]);
      }
    }
  }, [project]);

  if (!project) return null;

  const handleStartProject = () => {
    startProject(project.id, careerPath);
    setIsStarted(true);
    setProjectStatus('in-progress');
  };

  const handleToggleRequirement = (requirement: string) => {
    toggleRequirement(project.id, requirement);
    const progress = getProjectProgress(project.id);
    if (progress) {
      setCompletedRequirements(progress.checklist);
    }
  };

  const handleCompleteProject = () => {
    updateProjectStatus(project.id, 'completed');
    setProjectStatus('completed');
  };

  const completionPercentage = getCompletionPercentage(project.id, project.requirements.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#200D42] to-[#4F21A1] border border-white/20 rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto scrollbar-custom"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                  {isStarted && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      projectStatus === 'completed'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {projectStatus === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  )}
                </div>
                <p className="text-white/70">{project.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {isStarted && projectStatus !== 'completed' && (
              <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-sm">Project Progress</span>
                  <span className="text-[#ffaa40] font-bold">{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ffaa40] to-[#9c40ff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ffaa40]" />
                <span className="text-white/80">
                  Estimated: <strong>{project.estimatedHours} hours</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#9c40ff]" />
                <span className="text-white/80">
                  Difficulty: <strong className="capitalize">{project.difficulty}</strong>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🛠️</span> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Skills You ll Learn
              </h3>
              <ul className="space-y-2">
                {project.skillsLearned.map((skill, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/80">
                    <span className="text-[#ffaa40] mt-1">✓</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span> Requirements
              </h3>
              <ul className="space-y-3">
                {project.requirements.map((req, index) => {
                  const isChecked = completedRequirements.includes(req);
                  return (
                    <li key={index} className="flex items-start gap-3">
                      {isStarted ? (
                        <button
                          onClick={() => handleToggleRequirement(req)}
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                            isChecked
                              ? 'bg-[#9c40ff] border-[#9c40ff]'
                              : 'border-white/40 hover:border-white/60'
                          }`}
                        >
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </button>
                      ) : (
                        <span className="text-[#9c40ff] mt-1 flex-shrink-0">→</span>
                      )}
                      <span className={`text-white/80 ${isChecked ? 'line-through text-white/40' : ''}`}>
                        {req}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              {!isStarted ? (
                <motion.button
                  onClick={handleStartProject}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Project
                </motion.button>
              ) : projectStatus === 'in-progress' ? (
                <motion.button
                  onClick={handleCompleteProject}
                  disabled={completionPercentage < 100}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: completionPercentage === 100 ? 1.02 : 1 }}
                  whileTap={{ scale: completionPercentage === 100 ? 0.98 : 1 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  {completionPercentage === 100 ? 'Mark as Completed' : `Complete All Requirements (${completionPercentage}%)`}
                </motion.button>
              ) : (
                <div className="flex-1 py-3 px-6 bg-green-500/20 border-2 border-green-500/50 rounded-lg font-medium flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Project Completed! 
                </div>
              )}
              
              {project.solutionUrl && (
                <motion.a
                  href={project.solutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Solution
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};