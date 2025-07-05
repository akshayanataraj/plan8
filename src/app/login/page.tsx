'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#0E1B14] flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#2C4A3A] rounded-xl shadow-2xl p-8 w-full max-w-md text-white backdrop-blur-sm bg-opacity-90">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-[#1B3627] py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Don't have an account?{' '}
          <Link href="/register" className="text-white hover:text-opacity-80 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 