"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Roadmap, UserProgress } from '@/types/roadmap';
import { shareRoadmap } from '@/lib/shareExport';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: Roadmap;
  progress?: UserProgress;
}

export const ShareModal = ({ isOpen, onClose, roadmap, progress }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/roadmap/${roadmap.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNativeShare = async () => {
    const result = await shareRoadmap(roadmap, progress);
    if (result.success && result.method === 'clipboard') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                <h3 className="text-xl font-bold text-white mb-1">Share Roadmap</h3>
                <p className="text-white/60 text-xs truncate">{roadmap.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <motion.button
              onClick={handleNativeShare}
              className="w-full mb-3 py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-3 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Share via...</span>
            </motion.button>

            <motion.button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-between transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
                <span className="text-white text-sm font-medium">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </span>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};