'use client';

import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGooglePlay, FaApple, FaQrcode } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const fadeInUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="bg-[#14281D] text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-20 px-2 grid grid-cols-1 md:grid-cols-2 items-center"
      >
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl space-y-8 pl-10 group"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Order With Your Voice, Experience<br />
            Food Magic
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed">
            Let our intelligent voice assistant revolutionize your dining experience. 
            Talk and order your favorite meal, completely hands-free. 
            Welcome to the future of food ordering.
          </p>
          <div className="flex justify-center sm:justify-center">
            <button className="bg-[#070E0A] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold 
              hover:bg-[#F1F8F4] hover:text-black hover:scale-105 transform transition-all duration-300 
              shadow-lg hover:shadow-xl">
              Try it Now
            </button>
          </div>
        </motion.div>
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-10 md:mt-0"
        >
          <HeroSlider />
        </motion.div>
      </motion.section>

      {/* Feature Highlights */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        id="features" 
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-12"
        >
          Why forkit?
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: "Voice-First Ordering", desc: "Place and track orders through natural voice commands." },
            { title: "Personalized Agent", desc: "Your agent learns your preferences via a smart knowledge graph profile." },
            { title: "Multimodal Experience", desc: "Use voice, text, or click to explore restaurants and menus seamlessly." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-[#1B3326] p-6 sm:p-8 rounded-xl shadow-lg border border-[#2A4A39] 
                hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-lg sm:text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        id="how-it-works" 
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          How It Works
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "1", title: "Say Hello", desc: "Start with a simple greeting. The agent greets you back." },
            { num: "2", title: "Discover", desc: "Ask for your favorite cuisine or explore new restaurants." },
            { num: "3", title: "Place Order", desc: "The agent places the order after confirming your choices." },
            { num: "4", title: "Track & Enjoy", desc: "Track your delivery in real-time and enjoy your food!" }
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-[#1B3326] p-6 sm:p-8 rounded-xl shadow-lg border border-[#2A4A39] 
                hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl font-bold text-white">{step.num}</span>
              <h3 className="text-lg sm:text-xl font-semibold mt-3">{step.title}</h3>
              <p className="text-gray-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer Section */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#070E0A] py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">forkit</h3>
              <p className="text-gray-300">Order food the smart way. Voice-first, AI-powered, and deeply personalized.</p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-white hover:text-[#F1F8F4] transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#F1F8F4] transition-colors">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#F1F8F4] transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#F1F8F4] transition-colors">
                  <FaLinkedinIn size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Our Services</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Featured Restaurants</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Download App</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Join as Partner</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MdLocationOn className="text-[#F1F8F4] text-xl" />
                  <p className="text-gray-300">Chennai, India</p>
                </div>
                <div className="flex items-center space-x-3">
                  <MdEmail className="text-[#F1F8F4] text-xl" />
                  <a href="mailto:akshayanataraj09@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    akshayanataraj09@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Download App Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Download Our App</h4>
              <div className="space-y-4">
                <p className="text-gray-300">Get the best food ordering experience on your mobile</p>
                <div className="flex flex-col space-y-3">
                  <button className="flex items-center space-x-2 bg-[#1B3326] text-white px-4 py-2 rounded-lg hover:bg-[#2A4A39] transition-colors">
                    <FaApple className="text-2xl" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="flex items-center space-x-2 bg-[#1B3326] text-white px-4 py-2 rounded-lg hover:bg-[#2A4A39] transition-colors">
                    <FaGooglePlay className="text-2xl" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <FaQrcode className="text-white text-4xl" />
                  <span className="text-gray-300 text-sm">Scan to download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="text-gray-400 text-sm">
                © 2025 forkit. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
