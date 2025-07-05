'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    country_code: '',
    phone_number: ''
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name: formData.name,
              address: formData.address,
              country_code: formData.country_code,
              phone_number: formData.phone_number
            }
          ]);

        if (profileError) throw profileError;

        router.push('/login?registered=true');
      }
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#0E1B14] px-4 py-8 relative"
    >
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center text-white hover:text-white/90 transition-all hover:scale-110 group"
      >
        <span className="font-bold">Back to Home</span>
      </Link>

      <motion.div 
        variants={formVariants}
        className="bg-gradient-to-br from-[#DBDBD1] via-[#C5C5BB] to-[#AEAE9D] w-full max-w-4xl rounded-2xl shadow-lg p-8 space-y-6 backdrop-blur-sm"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#14281D]">Create Account</h1>
          <p className="mt-2 text-[#14281D]">Join us and start ordering with voice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#14281D]">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#14281D]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#14281D]">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="Confirm your password"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-[#14281D]">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label htmlFor="country_code" className="block text-sm font-medium text-[#14281D]">
                Country Code
              </label>
              <input
                type="text"
                id="country_code"
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="+1"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-[#14281D]">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-[#14281D] placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="123-456-7890"
              />
            </div>
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-[#14281D]">Already have an account? </span>
          <Link href="/login" className="font-medium text-[#14281D] hover:text-[#14281D] transition-colors">
            Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 