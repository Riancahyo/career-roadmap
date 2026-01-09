"use client"
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '../assets/images/logo.png';
import MenuIcon from '../assets/icons/menu.svg';
import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="px-4">
        <div className="container">
          <div className="py-4 sm:py-3 flex items-center justify-between">
            <div className="relative">
              <div className='absolute w-full top-2 bottom-0'></div>
              <Image 
                src={LogoImage} 
                alt="Logo" 
                className="h-12 w-12 sm:h-10 sm:w-10 relative mt-1 object-contain"
              />
            </div>

            <button 
              onClick={toggleMenu}
              className='border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden z-50 relative'
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="text-white w-6 h-6" />
              ) : (
                <MenuIcon className="text-white" />
              )}
            </button>

            <nav className='text-white gap-4 lg:gap-5 items-center hidden sm:flex text-sm'>
              <Link href="/" className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Home
              </Link>
              <Link href="/quiz" className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                Quiz
              </Link>
              <Link href="/ai-chat" className='text-opacity-60 text-white hover:text-opacity-100 transition'>
                AI Chat
              </Link>
              <Link href="/roadmap" className='bg-white py-1.5 px-3 sm:px-4 rounded-lg text-black hover:bg-white/90 transition'>
                Roadmap
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 sm:hidden"
              onClick={closeMenu}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-full left-0 right-0 bg-black border-t border-white/10 z-40 sm:hidden shadow-2xl"
            >
              <nav className='flex flex-col py-4 px-4'>
                <Link 
                  href="/" 
                  onClick={closeMenu}
                  className='text-white/70 hover:text-white hover:bg-white/5 py-3 px-4 rounded-lg transition'
                >
                  Home
                </Link>
                <Link 
                  href="/quiz" 
                  onClick={closeMenu}
                  className='text-white/70 hover:text-white hover:bg-white/5 py-3 px-4 rounded-lg transition'
                >
                  Quiz
                </Link>
                <Link 
                  href="/ai-chat" 
                  onClick={closeMenu}
                  className='text-white/70 hover:text-white hover:bg-white/5 py-3 px-4 rounded-lg transition'
                >
                  AI Chat
                </Link>
                <Link 
                  href="/roadmap" 
                  onClick={closeMenu}
                  className='bg-white text-black py-3 px-4 rounded-lg hover:bg-white/90 transition mt-2 text-center font-medium'
                >
                  Roadmap
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};