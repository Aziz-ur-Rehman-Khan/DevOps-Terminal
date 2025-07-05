'use client';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: number;
  frequency?: number;
}

export default function GlitchText({ 
  text, 
  className = "", 
  intensity = 0.1,
  frequency = 0.05 
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < frequency) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 100);

    return () => clearInterval(glitchInterval);
  }, [frequency]);

  const glitchVariants = {
    normal: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    glitch: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 2, -2, 0],
      opacity: [1, 0.8, 0.9, 0.7, 1],
    },
  };

  return (
    <div className="relative inline-block">
      {/* Main text */}
      <motion.span
        className={`relative z-10 ${className}`}
        variants={glitchVariants}
        animate={isGlitching ? "glitch" : "normal"}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>

      {/* Glitch layers */}
      <motion.span
        className={`absolute inset-0 text-red-400 ${className}`}
        style={{ opacity: intensity }}
        variants={glitchVariants}
        animate={isGlitching ? "glitch" : "normal"}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        {text}
      </motion.span>

      <motion.span
        className={`absolute inset-0 text-blue-400 ${className}`}
        style={{ opacity: intensity }}
        variants={glitchVariants}
        animate={isGlitching ? "glitch" : "normal"}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {text}
      </motion.span>
    </div>
  );
} 