"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileJson, FileText, FileDown } from 'lucide-react';
import { Roadmap, UserProgress } from '@/types/roadmap';
import { exportAsJSON, exportAsMarkdown, exportAsPDF } from '@/lib/shareExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: Roadmap;
  progress?: UserProgress;
}

export const ExportModal = ({ isOpen, onClose, roadmap, progress }: ExportModalProps) => {
  const handleExport = (format: 'json' | 'markdown' | 'pdf') => {
    switch (format) {
      case 'json':
        exportAsJSON(roadmap, progress);
        break;
      case 'markdown':
        exportAsMarkdown(roadmap, progress);
        break;
      case 'pdf':
        exportAsPDF(roadmap, progress);
        break;
    }
    setTimeout(() => onClose(), 500);
  };

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
            className="bg-gradient-to-br from-[#200D42] to-[#4F21A1] border border-white/20 rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Export Roadmap</h3>
                <p className="text-white/60 text-xs truncate">{roadmap.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <p className="text-white/60 text-xs mb-4">
              Choose format {progress ? 'with progress' : ''}
            </p>

            <div className="space-y-2">
              <motion.button
                onClick={() => handleExport('json')}
                className="w-full p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-3 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileJson className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-0.5">JSON</h4>
                  <p className="text-white/60 text-xs">
                    For importing to other tools
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleExport('markdown')}
                className="w-full p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-3 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-0.5">Markdown</h4>
                  <p className="text-white/60 text-xs">
                    For GitHub, Notion, or Obsidian
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleExport('pdf')}
                className="w-full p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-3 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FileDown className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-0.5">PDF</h4>
                  <p className="text-white/60 text-xs">
                    For offline reference or portfolio
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};