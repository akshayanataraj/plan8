'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function VoiceOrderPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
      }
    };

    checkUser();

    // Add ElevenLabs script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.removeChild(script);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router]);

  return (
    <div className="h-screen bg-[#DBDBD1] flex">
      {/* Left Side - Content */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col h-full relative">
        {/* Profile Dropdown */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-50"
        >
          <button
            id="profile-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-[#1B3627] text-white flex items-center justify-center hover:bg-[#2C4A3A] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              id="profile-dropdown"
              className="absolute top-12 left-0 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
            >
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 flex-1 flex flex-col"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#2C4A3A] backdrop-blur-sm rounded-2xl border border-[#3C5A4A] p-6 shadow-lg flex-1"
          >
            <motion.div variants={itemVariants} className="text-left mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Your Personal Order Assistant</h1>
              <p className="text-white/80 text-sm lg:text-base mt-2">
                Speak naturally, and I'll guide you through your order.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <motion.div 
                variants={itemVariants}
                className="bg-[#1B3627]/40 rounded-xl p-4 shadow-sm border border-[#3C5A4A] hover:bg-[#1B3627]/60 transition-colors"
              >
                <div className="text-white text-base lg:text-lg flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  Smart Understanding
                </div>
                <p className="text-white/70 text-xs lg:text-sm mt-1">Natural conversation with context awareness</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="bg-[#1B3627]/40 rounded-xl p-4 shadow-sm border border-[#3C5A4A] hover:bg-[#1B3627]/60 transition-colors"
              >
                <div className="text-white text-base lg:text-lg flex items-center">
                  <span className="text-xl mr-2">🔊</span>
                  Crystal Clear Voice
                </div>
                <p className="text-white/70 text-xs lg:text-sm mt-1">High-quality AI voice interaction</p>
              </motion.div>
            </div>

            {/* Quick Tips */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#1B3627]/20 rounded-xl p-4 border border-[#3C5A4A] hover:bg-[#1B3627]/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Quick Tips</h3>
              <ul className="text-white/70 space-y-2 text-xs lg:text-sm">
                <li className="flex items-center">
                  <span className="text-white/50 mr-2">•</span>
                  Ask about menu items and pricing
                </li>
                <li className="flex items-center">
                  <span className="text-white/50 mr-2">•</span>
                  Modify your order anytime
                </li>
                <li className="flex items-center">
                  <span className="text-white/50 mr-2">•</span>
                  Request personalized recommendations
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Voice AI */}
      <div className="w-full lg:w-1/2 bg-[#14281D]">
        <div className="h-full flex items-center justify-center">
          <elevenlabs-convai 
            agent-id="agent_01jze22mjqe9hvfr66jfzm4d1f"
            className="w-full h-full"
          ></elevenlabs-convai>
        </div>
      </div>
    </div>
  );
} 