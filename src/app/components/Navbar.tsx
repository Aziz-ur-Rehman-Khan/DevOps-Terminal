'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MatrixRain = dynamic(() => import('./MatrixRain'), { ssr: false });

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/", label: "home" },
    { href: "/architectures", label: "architectures" },
    { href: "/medium", label: "medium" },
    { href: "/resume", label: "resume" }
  ];

  return (
    <motion.nav 
      className="bg-black/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Terminal-style header */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="font-mono text-sm text-gray-400">
            aziz@portfolio:~$
          </div>
          <motion.div 
            className="font-mono text-xs text-green-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {currentTime}
          </motion.div>
        </motion.div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="group relative font-mono text-sm text-gray-300 hover:text-green-400 transition-colors duration-300 focus-ring"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
            <div className="w-4 h-0.5 bg-green-400"></div>
            <div className="w-4 h-0.5 bg-green-400"></div>
            <div className="w-4 h-0.5 bg-green-400"></div>
          </div>
        </motion.button>
      </div>

      {/* Matrix rain background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <MatrixRain />
      </div>
    </motion.nav>
  );
}
