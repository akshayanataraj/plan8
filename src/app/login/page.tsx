'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please check your email to verify your account before logging in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        // Redirect to home page
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#0E1B14] flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#2C4A3A] rounded-xl shadow-2xl p-8 w-full max-w-md text-white backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center justify-center mr-4 p-1 rounded transition-all duration-200 transform hover:scale-125">
            ←
          </Link>
          <h2 className="text-3xl font-bold text-center flex-1">Welcome Back</h2>
          <span className="w-8 mr-3" aria-hidden="true"></span>
        </div>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-white text-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
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
          <Link href="/register" className="text-white font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 