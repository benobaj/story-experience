import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stories = [
  {
    id: 1,
    title: "Emma & James",
    subtitle: "Are Getting Married!",
    background: "bg-gradient-to-br from-purple-600 to-blue-500"
  },
  {
    id: 2,
    title: "The Story",
    subtitle: "How We Met",
    background: "bg-gradient-to-br from-pink-500 to-orange-400"
  },
  {
    id: 3,
    title: "Join Us",
    subtitle: "December 31, 2024",
    background: "bg-gradient-to-br from-blue-500 to-teal-400"
  }
];

const StoryExperience = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  // Minimum swipe distance for gesture detection
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distance = touchStart.current - touchEnd.current;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isDownSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (event.key === 'ArrowDown' && currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-black touch-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={`absolute inset-0 flex flex-col items-center justify-center ${stories[currentIndex].background}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center px-4 max-w-md mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {stories[currentIndex].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-2xl text-white/90"
            >
              {stories[currentIndex].subtitle}
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="fixed top-4 left-0 right-0 flex justify-center gap-2 z-50 px-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation hint - shows on mobile only */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 left-0 right-0 text-center text-white/50 text-sm px-4"
      >
        <p className="md:hidden">Swipe up or down to navigate</p>
        <p className="hidden md:block">Use ↑ and ↓ arrow keys to navigate</p>
      </motion.div>
    </div>
  );
};

export default StoryExperience;