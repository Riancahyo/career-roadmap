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
    <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] flex-1 flex items-center justify-center py-16 sm:py-24 relative overflow-clip">
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
      
      <div className="container relative z-10">
        <div className="flex justify-center">
          <div className="inline-flex relative">
            <h1 className='text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter text-center px-4 sm:px-0'>
              Temukan Jalur <br/> Karir IT-mu
            </h1>
            <motion.div 
              className='absolute right-[110%] top-[40%] hidden sm:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={CursorImage} alt="cursor" height={200} width={200} className='max-w-none' draggable="false"/>
            </motion.div>
            <motion.div 
              className='absolute left-[110%] top-[10%] hidden sm:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={MessageImage} alt="message" height={200} width={200} className='max-w-none' draggable="false"/>
            </motion.div>
          </div>
        </div>
        
        <div className="flex justify-center px-4 sm:px-0">
          <p className='text-lg sm:text-xl text-center mt-8 max-w-md text-white/70'>
            Bingung mau fokus ke Frontend, Backend, UI/UX, atau jalur IT lainnya? 
            Yuk temukan passion-mu dengan bantuan AI!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-4 sm:px-0">
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