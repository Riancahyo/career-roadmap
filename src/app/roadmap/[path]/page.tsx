"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RoadmapCanvas } from '@/components/RoadmapCanvas';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ShareModal } from '@/components/ShareModal';
import { ExportModal } from '@/components/ExportModal';
import { getRoadmapById } from '@/data/roadmaps';
import { getProjectsByCareerPath, hasProjects } from '@/data/projects';
import { Roadmap, UserProgress } from '@/types/roadmap';
import { Project, ProjectDifficulty } from '@/types/project';
import { ArrowLeft, Download, Share2, Map as MapIcon, Briefcase } from 'lucide-react';

type TabType = 'roadmap' | 'projects';

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('roadmap');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProjectDifficulty | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const pathId = params.path as string;

    const loadedRoadmap = getRoadmapById(pathId);
    
    if (loadedRoadmap) {
      setRoadmap(loadedRoadmap);

      const savedProgress = localStorage.getItem(`roadmap-progress-${pathId}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress({
          careerPath: pathId,
          completedNodes: [],
          lastUpdated: new Date(),
        });
      }
    } else {
      router.push('/roadmap');
    }
  }, [params.path, router]);

  const handleUpdateProgress = (nodeId: string, completed: boolean) => {
    if (!userProgress || !roadmap) return;

    const newCompletedNodes = completed
      ? [...userProgress.completedNodes, nodeId]
      : userProgress.completedNodes.filter((id) => id !== nodeId);

    const updatedProgress: UserProgress = {
      ...userProgress,
      completedNodes: newCompletedNodes,
      lastUpdated: new Date(),
    };

    setUserProgress(updatedProgress);
    localStorage.setItem(
      `roadmap-progress-${roadmap.id}`,
      JSON.stringify(updatedProgress)
    );
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const pathId = params.path as string;
  const projects = getProjectsByCareerPath(pathId);
  const hasProjectsAvailable = hasProjects(pathId);
  
  const filteredProjects = selectedDifficulty === 'all' 
    ? projects 
    : projects.filter(p => p.difficulty === selectedDifficulty);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#9c40ff] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_50%,#4F21A1_95%)] py-6 sm:py-10 lg:py-12 relative overflow-clip">

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <motion.button
            onClick={() => router.push('/roadmap')}
            className="flex items-center gap-1.5 text-white/60 hover:text-white mb-4 sm:mb-5 transition-colors text-sm"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Roadmaps
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{roadmap.title}</h1>
              </div>
              <p className="text-white/60 text-sm sm:text-base">{roadmap.description}</p>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Share</span>
              </motion.button>
              <motion.button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl p-1.5 sm:p-2"
        >
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Roadmap
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Projects
          </button>
        </motion.div>

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RoadmapCanvas
              roadmap={roadmap}
              userProgress={userProgress || undefined}
              onUpdateProgress={handleUpdateProgress}
            />
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!hasProjectsAvailable ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-10 text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚧</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Projects Coming Soon!</h3>
                <p className="text-white/60 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto">
                  We re currently working on curated projects for {roadmap.title}. 
                  Check back soon or explore other career paths!
                </p>
                <motion.button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Roadmap Instead
                </motion.button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
                  {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                    <motion.button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                        selectedDifficulty === difficulty
                          ? 'bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-white'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {difficulty === 'all' ? 'All Projects' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </motion.button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProjectCard 
                        project={project}
                        onClick={() => handleProjectClick(project)}
                      />
                    </motion.div>
                  ))}
                </div>

                {filteredProjects.length === 0 && projects.length > 0 && (
                  <div className="text-center py-12 sm:py-16 text-white/60 text-sm">
                    <p>No projects found for this difficulty level.</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          careerPath={pathId}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          roadmap={roadmap}
          progress={userProgress || undefined}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          roadmap={roadmap}
          progress={userProgress || undefined}
        />

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 sm:mt-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5"
          >
            <h3 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Cara Menggunakan Roadmap</h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm">
              <div>
                <strong className="text-white">1. Ikuti Urutan</strong>
                <p>Mulai dari node fundamentals (biru) ke specialization (hijau)</p>
              </div>
              <div>
                <strong className="text-white">2. Klik Node</strong>
                <p>Lihat detail, resources, dan tandai jika sudah selesai</p>
              </div>
              <div>
                <strong className="text-white">3. Prerequisites</strong>
                <p>Node akan unlock setelah prerequisites selesai</p>
              </div>
              <div>
                <strong className="text-white">4. Track Progress</strong>
                <p>Progress tersimpan otomatis di browser kamu</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 sm:mt-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5"
          >
            <h3 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">💡 Tips Mengerjakan Projects</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-white/60 text-xs sm:text-sm">
              <li>• Mulai dari <strong className="text-white">Beginner</strong> untuk membangun fondasi yang kuat</li>
              <li>• Jangan copy-paste! Ketik manual untuk muscle memory</li>
              <li>• Commit progress ke GitHub untuk portfolio</li>
              <li>• Deploy project ke Vercel/Netlify untuk showcase</li>
              <li>• Challenge yourself: tambah fitur extra setelah requirement tercapai</li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}