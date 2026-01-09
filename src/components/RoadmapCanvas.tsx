"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roadmap, RoadmapNode as RoadmapNodeType, UserProgress } from '@/types/roadmap';
import { RoadmapNode } from './RoadmapNode';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';

interface RoadmapCanvasProps {
  roadmap: Roadmap;
  userProgress?: UserProgress;
  onUpdateProgress?: (nodeId: string, completed: boolean) => void;
}

export const RoadmapCanvas = ({ roadmap, userProgress, onUpdateProgress }: RoadmapCanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(
    new Set(userProgress?.completedNodes || [])
  );
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateScale = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) { 
          setScale(0.4);
        } else if (width < 1024) { 
          setScale(0.6);
        } else { 
          setScale(1);
        }
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const isNodeUnlocked = (node: RoadmapNodeType): boolean => {
    if (!node.prerequisites || node.prerequisites.length === 0) return true;
    return node.prerequisites.every((prereqId) => completedNodes.has(prereqId));
  };

  const toggleNodeCompletion = (nodeId: string) => {
    const newCompleted = new Set(completedNodes);
    const isCompleted = completedNodes.has(nodeId);

    if (isCompleted) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }

    setCompletedNodes(newCompleted);
    onUpdateProgress?.(nodeId, !isCompleted);
  };

  const renderConnections = () => {
    const NODE_WIDTH = 180;
    const NODE_HEIGHT = 100;
    
    return roadmap.connections.map((conn, index) => {
      const fromNode = roadmap.nodes.find((n) => n.id === conn.from);
      const toNode = roadmap.nodes.find((n) => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const x1 = (fromNode.position.x + NODE_WIDTH / 2) * scale;
      const y1 = (fromNode.position.y + NODE_HEIGHT / 2) * scale;
      const x2 = (toNode.position.x + NODE_WIDTH / 2) * scale;
      const y2 = (toNode.position.y + NODE_HEIGHT / 2) * scale;

      const dx = x2 - x1;
      const dy = y2 - y1;
      
      const controlX = x1 + dx / 2;
      const controlY = y1 + dy * 0.3;
      
      const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

      const isActive = completedNodes.has(conn.from);
      const strokeColor = isActive ? '#ffaa40' : 'rgba(255, 255, 255, 0.2)';
      const strokeWidth = conn.type === 'required' ? 2 : 1;
      const strokeDasharray = conn.type === 'optional' ? '5,5' : '0';

      return (
        <path
          key={index}
          d={pathD}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      );
    });
  };

  const progress = Math.round((completedNodes.size / roadmap.nodes.length) * 100);

  const canvasHeight = scale < 0.6 ? 380 : scale < 1 ? 600 : 900;

  return (
    <>
      <div className="mb-3 sm:mb-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-bold text-sm sm:text-base">Progress</h3>
          <span className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] bg-clip-text">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ffaa40] to-[#9c40ff]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-white/60 text-xs mt-1.5 sm:mt-2">
          {completedNodes.size} dari {roadmap.nodes.length} topik selesai
        </p>
      </div>

      <div 
        ref={canvasRef}
        className="relative w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl overflow-auto"
        style={{ height: `${canvasHeight}px` }}
      >
        <div 
          className="relative"
          style={{ 
            width: `${roadmap.nodes.reduce((max, node) => Math.max(max, node.position.x + 200), 800) * scale}px`,
            height: `${roadmap.nodes.reduce((max, node) => Math.max(max, node.position.y + 150), 800) * scale}px`,
            minHeight: '100%'
          }}
        >
          <div style={{ transform: isDesktop ? `scale(${scale}) translateX(0px)` : `scale(${scale}) translateX(-50px)`, transformOrigin: isDesktop ? 'top center' : 'top left'}}>
            {roadmap.nodes.map((node) => (
              <RoadmapNode
                key={node.id}
                node={node}
                isCompleted={completedNodes.has(node.id)}
                isUnlocked={isNodeUnlocked(node)}
                onClick={() => isNodeUnlocked(node) && setSelectedNode(node)}
              />
            ))}
          </div>
        </div>

        <div className="hidden sm:block absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3">
          <h4 className="text-white font-bold text-xs mb-2">Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
              <span className="text-white/80 text-xs">Fundamentals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-500 to-pink-500" />
              <span className="text-white/80 text-xs">Core Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-500" />
              <span className="text-white/80 text-xs">Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500 to-emerald-500" />
              <span className="text-white/80 text-xs">Specialization</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <h4 className="text-white font-bold text-xs mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
            <span className="text-white/80 text-xs">Fundamentals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
            <span className="text-white/80 text-xs">Core Skills</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0" />
            <span className="text-white/80 text-xs">Advanced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0" />
            <span className="text-white/80 text-xs">Specialization</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#200D42] to-[#4F21A1] border border-white/20 rounded-lg sm:rounded-xl p-5 sm:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">{selectedNode.title}</h2>
                  <p className="text-white/60 text-xs sm:text-sm">
                    Estimasi: {selectedNode.estimatedWeeks} minggu
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <p className="text-white/80 mb-4 leading-relaxed text-xs sm:text-sm">{selectedNode.description}</p>

              <motion.button
                onClick={() => toggleNodeCompletion(selectedNode.id)}
                className={`w-full py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg font-medium flex items-center justify-center gap-2 mb-4 sm:mb-5 text-xs sm:text-sm ${
                  completedNodes.has(selectedNode.id)
                    ? 'bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedNodes.has(selectedNode.id) ? 'Sudah Selesai ✓' : 'Tandai Selesai'}
              </motion.button>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2.5 sm:mb-3">Learning Resources</h3>
                <div className="space-y-2">
                  {selectedNode.resources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-1 mr-2">
                        <h4 className="text-white font-medium mb-1 text-xs sm:text-sm">{resource.title}</h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                            {resource.type}
                          </span>
                          {resource.isFree && (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-white font-bold mb-2 text-xs sm:text-sm">Prerequisites</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.prerequisites.map((prereqId) => {
                      const prereqNode = roadmap.nodes.find((n) => n.id === prereqId);
                      return (
                        <span
                          key={prereqId}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs"
                        >
                          {prereqNode?.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};