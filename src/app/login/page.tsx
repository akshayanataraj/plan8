'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const containerVariants: Variants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const formVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/voice-order');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#0E1B14] px-4 relative"
    >
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center text-white hover:text-white/90 transition-all hover:scale-110 group"
      >
        <span className="font-bold">Back to Home</span>
      </Link>

      <motion.div 
        variants={formVariants}
        className="bg-gradient-to-br from-[#DBDBD1] via-[#C5C5BB] to-[#AEAE9D] w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6 backdrop-blur-sm"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#14281D]">Welcome Back</h1>
          <p className="mt-2 text-[#14281D]">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#14281D]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#14281D]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
              bg-[#14281D] hover:bg-[#2C4A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-[#14281D]">Don't have an account? </span>
          <Link href="/register" className="font-medium text-[#14281D] hover:text-[#14281D] transition-colors">
            Register
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 