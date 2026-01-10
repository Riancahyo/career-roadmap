"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { ChatMessage } from '@/types/career';
import { Bot, RefreshCw, X } from 'lucide-react'; 
import { Navbar } from '@/components/Navbar';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Halo! 👋 Aku adalah Career Advisor AI yang siap membantu kamu menemukan jalur karir IT yang sesuai. Ceritakan tentang minat dan kemampuanmu, atau tanyakan apapun tentang karir di bidang IT!',
  timestamp: new Date(),
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (messages.length > 1) { 
      localStorage.setItem('ai-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setShowConfirmModal(true);
  };

  const confirmNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem('ai-chat-history');
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_95%)] relative overflow-clip">      
      <Navbar />

      <div className="container relative z-10 px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-3">
            <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffaa40]" />
            <span className="text-xs">AI Career Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Chat dengan AI Career Advisor
          </h1>
          <p className="text-white/60 text-xs sm:text-sm lg:text-base max-w-lg mx-auto">
            Tanyakan apapun tentang karir IT, atau ceritakan minat dan kemampuanmu untuk mendapat saran yang personal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onNewChat={handleNewChat}
            showNewChatButton={messages.length > 1}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-3 sm:mt-4"
        >
          <p className="text-white/40 text-xs text-center mb-2">Contoh pertanyaan:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Apa bedanya Frontend dan Backend?',
              'Skill apa yang harus saya pelajari untuk jadi Data Scientist?',
              'Bagaimana cara mulai belajar UI/UX Design?',
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-xs hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#200D42] to-[#4F21A1] border border-white/20 rounded-xl p-5 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-[#ffaa40]" />
                  </div>
                  <h3 className="text-lg font-bold">Chat Baru?</h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-white/70 text-sm mb-4">
                Percakapan sebelumnya akan dihapus. Yakin ingin melanjutkan?
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmNewChat}
                  className="flex-1 px-3 py-2 bg-[#ffaa40] hover:bg-[#ff9920] text-black rounded-lg transition-colors text-sm font-medium"
                >
                  Ya, Mulai Baru
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}