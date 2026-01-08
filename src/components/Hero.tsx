"use client"
import CursorImage from '../assets/images/cursor.png'
import MessageImage from '../assets/images/message.png'
import Image from 'next/image';
import {motion} from 'framer-motion'
import { useRouter } from 'next/navigation';
import { Sparkles, MessageSquare } from 'lucide-react';

export const Hero = () => {
  const router = useRouter();

  return (
    <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] flex-1 flex items-center justify-center py-12 sm:py-16 relative overflow-clip">
      <div className="absolute h-[375px] w-[750px] sm:w-[1200px] sm:h-[600px] lg:w-[1800px] lg:h-[650px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
      
      <div className="container relative z-10 -translate-y-4 sm:-translate-y-6 lg:-translate-y-6">
        <div className="flex justify-center">
          <div className="inline-flex relative">
            <h1 className='text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tighter text-center px-4 sm:px-0 leading-tight'>
              Temukan Jalur <br/> Karir IT-mu
            </h1>
            <motion.div 
              className='absolute right-[110%] top-[40%] hidden lg:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={CursorImage} alt="cursor" height={150} width={150} className='max-w-none' draggable="false"/>
            </motion.div>
            <motion.div 
              className='absolute left-[110%] top-[10%] hidden lg:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={MessageImage} alt="message" height={150} width={150} className='max-w-none' draggable="false"/>
            </motion.div>
          </div>
        </div>
        
        <div className="flex justify-center px-4 sm:px-0">
          <p className='text-base sm:text-lg lg:text-xl text-center mt-6 sm:mt-8 max-w-2xl text-white/80 leading-relaxed'>
            Bingung mau fokus ke Frontend, Backend, UI/UX, atau jalur IT lainnya? 
            Yuk temukan passion-mu dengan bantuan AI!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 sm:mt-12 px-4 sm:px-0">
          <motion.button 
            onClick={() => router.push('/quiz')}
            className='flex items-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors w-full sm:w-auto justify-center'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            Mulai Quiz
          </motion.button>
          <motion.button 
            onClick={() => router.push('/ai-chat')}
            className='flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors w-full sm:w-auto justify-center'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5" />
            Chat dengan AI
          </motion.button>
        </div>
      </div>
    </div>
  )
};