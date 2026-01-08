"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { ChatMessage } from '@/types/career';
import { Bot, Sparkles, Menu as MenuIcon } from 'lucide-react'; 
import { Navbar } from '@/components/Navbar';

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! 👋 Aku adalah Career Advisor AI yang siap membantu kamu menemukan jalur karir IT yang sesuai. Ceritakan tentang minat dan kemampuanmu, atau tanyakan apapun tentang karir di bidang IT!',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_95%)] relative overflow-clip">      
      <Navbar />

      <div className="container relative z-10 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Bot className="w-4 h-4 text-[#ffaa40]" />
            <span className="text-sm">AI Career Advisor</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Chat dengan AI Career Advisor
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
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
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-6"
        >
          <p className="text-white/40 text-sm text-center mb-3">Contoh pertanyaan:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              'Apa bedanya Frontend dan Backend?',
              'Skill apa yang harus saya pelajari untuk jadi Data Scientist?',
              'Bagaimana cara mulai belajar UI/UX Design?',
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-sm hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}