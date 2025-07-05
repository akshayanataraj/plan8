'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    src: '/images/voice-order.gif',
    alt: 'Voice Assistant Demo 1',
  },
  {
    id: 2,
    src: '/images/voice-order.gif',
    alt: 'Voice Assistant Demo 2',
  },
  {
    id: 3,
    src: '/images/voice-order.gif',
    alt: 'Voice Assistant Demo 3',
  },
  {
    id: 4,
    src: '/images/voice-order.gif',
    alt: 'Voice Assistant Demo 4',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-advance after GIF plays 3 times
  useEffect(() => {
    const gifDuration = 3000; // Assuming each GIF is 3 seconds long - adjust as needed
    const interval = setInterval(() => {
      nextSlide();
    }, gifDuration);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 w-full">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="text-white p-3 rounded-full flex items-center justify-center w-15 h-15"
          aria-label="Previous slide"
        >
          ←
        </button>

        {/* Slider Container */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={500}
                    height={400}
                    className="w-full"
                    priority
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="text-white p-3 rounded-full flex items-center justify-center w-10 h-10"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 