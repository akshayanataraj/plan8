'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="bg-[#1B3627] px-12 py-8 flex items-center text-white sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
      <h1 className="text-3xl font-bold tracking-tight flex-shrink-0 w-48">forkit</h1>
      <nav className="flex-1 flex justify-center items-center space-x-12 hidden md:flex text-lg">
        <Link 
          href="#" 
          className="hover:text-[#F7F4F3] transition-colors duration-200"
        >
          Home
        </Link>
        <Link 
          href="#" 
          className="hover:text-[#F7F4F3] transition-colors duration-200"
        >
          Features
        </Link>
        <Link 
          href="#" 
          className="hover:text-[#F7F4F3] transition-colors duration-200"
        >
          About Us
        </Link>
      </nav>
      <div className="flex-shrink-0 w-48 flex justify-end">
        <Link 
          href="/login" 
          className="border border-white px-8 py-2 rounded-lg hover:bg-white hover:text-[#1B3627] transition-all duration-200"
        >
          LOG IN
        </Link>
      </div>
      <div className="md:hidden">
        <button className="text-2xl hover:text-[#F7F4F3] transition-colors duration-200">☰</button>
      </div>
    </header>
  );
};

export default Navbar; 