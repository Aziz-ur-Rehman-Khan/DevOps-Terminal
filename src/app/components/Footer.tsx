'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Content {
  contact: {
    github: string;
    linkedin: string;
    email: string;
  };
}

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function Footer() {
  const [contact, setContact] = useState<Content['contact'] | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    fetch('/content.json')
      .then(res => res.json())
      .then((content: Content) => setContact(content.contact));
  }, []);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = [...Array(10)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <motion.footer 
      className="glass border-t border-gray-800 text-gray-400 py-8 text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          className="font-mono text-sm mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-green-400">$</span> echo "Thanks for visiting!"
        </motion.div>
        
        <motion.div
          className="text-gray-300 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Thanks for visiting!
        </motion.div>

        <motion.div
          className="flex justify-center items-center space-x-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.a
            href={contact?.github || "https://github.com/Aziz-ur-Rehman-Khan"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-mono text-sm">[GitHub]</span>
          </motion.a>
          <motion.a
            href={contact?.linkedin || "https://www.linkedin.com/in/aziz-ur-rehman-khan"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-mono text-sm">[LinkedIn]</span>
          </motion.a>
          <motion.a
            href={`mailto:${contact?.email || "azizurehmankhan.dev@gmail.com"}`}
            className="text-gray-400 hover:text-green-400 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-mono text-sm">[Email]</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="font-mono text-xs text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} Aziz ur Rehman Khan. All rights reserved.
        </motion.div>

        <motion.div
          className="mt-4 font-mono text-xs text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
        >
          Built with Next.js, TypeScript & Framer Motion
        </motion.div>
      </div>
    </motion.footer>
  );
}
