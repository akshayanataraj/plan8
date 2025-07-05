'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    countryCode: '+1',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  const countryCodes = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    // Add more country codes as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#0E1B14] flex items-center justify-center px-4 py-8">
      <div className="bg-gradient-to-br from-[#2C4A3A] via-[#1B3627] to-[#2C4A3A] rounded-xl shadow-2xl p-8 w-full max-w-md text-white backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center justify-center mr-4 p-1 rounded transition-all duration-200 transform hover:scale-125">
            ←
          </Link>
          <h2 className="text-3xl font-bold text-center flex-1">Create Account</h2>
          <span className="w-8 mr-3" aria-hidden="true"></span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Enter your address"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/3">
              <label htmlFor="countryCode" className="block text-sm font-medium mb-1">
                Country Code
              </label>
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white"
              >
                {countryCodes.map(country => (
                  <option key={country.code} value={country.code} className="bg-[#1B3627]">
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-2/3">
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
                required
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1B3627]/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              required
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#1B3627] py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium mt-6"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
} 