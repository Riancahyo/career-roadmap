"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Map, ArrowRight, Clock, Menu as MenuIcon } from 'lucide-react';
import { getAllRoadmaps } from '@/data/roadmaps';
import { Navbar } from '@/components/Navbar';

const roadmapsMeta = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Master HTML, CSS, JavaScript, React, dan modern web technologies',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Server-side programming, databases, APIs, dan infrastructure',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    description: 'Design thinking, prototyping, user research, dan visual design',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    description: 'Combine frontend dan backend development untuk aplikasi lengkap',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Machine learning, data analysis, Python, dan statistical modeling',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'SQL, Excel, visualization tools, dan business intelligence',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'CI/CD, Docker, Kubernetes, cloud platforms, dan automation',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    description: 'Deep learning, MLOps, model deployment, dan production systems',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    description: 'Unity, C#, game mechanics, graphics, dan gameplay programming',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    description: 'React Native, iOS/Android, mobile UI/UX, dan app deployment',
    color: 'from-teal-500 to-green-500',
  },
];

export default function RoadmapGalleryPage() {
  const router = useRouter();
  const [roadmapsWithProgress, setRoadmapsWithProgress] = useState<any[]>([]);

  useEffect(() => {
    const roadmaps = getAllRoadmaps();
    
    const roadmapsData = roadmapsMeta.map((meta) => {
      const roadmapData = roadmaps.find((r) => r.id === meta.id);
      
      const savedProgress = localStorage.getItem(`roadmap-progress-${meta.id}`);
      let progress = 0;
      
      if (savedProgress && roadmapData) {
        const progressData = JSON.parse(savedProgress);
        progress = Math.round((progressData.completedNodes.length / roadmapData.nodes.length) * 100);
      }
      
      return {
        ...meta,
        totalWeeks: roadmapData?.totalWeeks || 0,
        topics: roadmapData?.nodes.length || 0,
        progress,
      };
    });
    
    setRoadmapsWithProgress(roadmapsData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_50%,#4F21A1_95%)] relative overflow-clip">    
      <Navbar />

      <div className="container relative z-10 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Map className="w-4 h-4 text-[#ffaa40]" />
            <span className="text-sm">Learning Roadmaps</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Pilih Roadmap IT-mu
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Ikuti roadmap terstruktur untuk mencapai tujuan karir IT-mu. Setiap roadmap dilengkapi dengan materi, resources, dan progress tracking.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {roadmapsWithProgress.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                className="w-full text-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all hover:bg-white/15 hover:border-white/30 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{roadmap.title}</h2>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>

                <p className="text-white/60 mb-6 leading-relaxed">{roadmap.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">{roadmap.totalWeeks} minggu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">{roadmap.topics} topik</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-xs">Progress</span>
                    <span className="text-white/60 text-xs">{roadmap.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#ffaa40] to-[#9c40ff]"
                      initial={{ width: 0 }}
                      animate={{ width: `${roadmap.progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-2">💡 Tips Menggunakan Roadmap</h3>
          <ul className="text-white/60 text-sm space-y-2">
            <li>• Ikuti urutan topik dari atas ke bawah untuk hasil maksimal</li>
            <li>• Klik setiap node untuk melihat detail materi dan resources</li>
            <li>• Tandai topik yang sudah selesai untuk tracking progress</li>
            <li>• Roadmap bersifat fleksibel, sesuaikan dengan kecepatan belajarmu</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}