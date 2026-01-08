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
            className="bg-gradient-to-br from-[#200D42] to-[#4F21A1] border border-white/20 rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Export Roadmap</h3>
                <p className="text-white/60 text-sm">{roadmap.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <p className="text-white/60 text-sm mb-6">
              Choose a format to download your roadmap {progress ? 'with your progress' : ''}
            </p>

            <div className="space-y-3">
              <motion.button
                onClick={() => handleExport('json')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-start gap-4 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileJson className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">JSON Format</h4>
                  <p className="text-white/60 text-sm">
                    Machine-readable format. Best for importing to other tools.
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleExport('markdown')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-start gap-4 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">Markdown Format</h4>
                  <p className="text-white/60 text-sm">
                    Human-readable checklist. Great for GitHub, Notion, or Obsidian.
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleExport('pdf')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-start gap-4 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <FileDown className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">PDF Format</h4>
                  <p className="text-white/60 text-sm">
                    Printable document. Perfect for offline reference or portfolio.
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