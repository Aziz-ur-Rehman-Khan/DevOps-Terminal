'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingTerminal from "./components/FloatingTerminal";
import ParticleSystem from "./components/ParticleSystem";
import TypewriterText from "./components/TypewriterText";
import GlitchText from "./components/GlitchText";
import { usePathname } from "next/navigation";

interface Contact {
  email: string;
  github: string;
  linkedin: string;
  phone: string;
  medium: string;
  location: string;
}

interface Project {
  name: string;
  position: string;
  description: string;
  link: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Hero {
  name: string;
  title: string;
  subtitle: string;
  description: string;
}

interface About {
  heading: string;
  content: string;
}

interface Content {
  hero: Hero;
  about: About;
  skills: string[];
  projects: Project[];
  education: Education[];
  contact: Contact;
}

export default function Home() {
  const [content, setContent] = useState<Content | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    fetch('/content.json')
      .then(res => res.json())
      .then(setContent)
      .catch(err => {
        console.error("Failed to fetch content.json", err);
      });
  }, []);

  useEffect(() => {
    if (window.location.hash === "#contact") {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [pathname]);

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-green-400 font-mono text-xl"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading system...
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Particle System */}
      <ParticleSystem />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ["-100vh", "100vh"]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 pt-24">
        {/* Hero Section with Terminal Aesthetic */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Terminal-style typing animation */}
            <div className="mb-8 mt-16">
              <motion.div
                className="font-mono text-green-400 text-lg md:text-xl mb-4 text-left max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <TypewriterText 
                  text={`> ${content.hero.name}@portfolio:~$ whoami`}
                  speed={100}
                  delay={500}
                  className="font-mono text-green-400"
                  onComplete={() => setIsTypingComplete(true)}
                />
              </motion.div>
              
              <AnimatePresence>
                {isTypingComplete && (
                  <motion.div
                    className="font-mono text-gray-300 text-sm md:text-base text-left max-w-2xl mx-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="mb-2">Name: {content.hero.name}</div>
                    <div className="mb-2">Title: {content.hero.title}</div>
                    <div className="mb-2">Status: Available for opportunities</div>
                    <div className="mb-4">Location: Remote / Worldwide</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main title with glitch effect */}
            <motion.div
              className="mb-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <GlitchText
                text={content.hero.name}
                className="text-4xl md:text-6xl font-bold text-green-400 hover-glow cursor-pointer"
                intensity={0.3}
                frequency={0.02}
              />
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              <GlitchText
                text={content.hero.subtitle}
                className="text-xl md:text-2xl font-semibold text-purple-400"
                intensity={0.2}
                frequency={0.01}
              />
            </motion.div>

            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
            >
              {content.hero.description}
            </motion.p>
          </motion.div>
        </section>

        {/* About Section with Code Block Style */}
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="code-block p-4 sm:p-8 mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-green-400 mb-4">{/* about.js */}</div>
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlitchText
                  text={content.about.heading}
                  className="text-2xl font-bold text-blue-400"
                  intensity={0.1}
                  frequency={0.003}
                />
              </motion.div>
              <p className="text-gray-300 leading-relaxed">{content.about.content}</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section with Interactive Tags */}
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlitchText
                text="<Skills />"
                className="text-3xl font-bold text-purple-400"
                intensity={0.15}
                frequency={0.005}
              />
            </motion.div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {content.skills.map((skill: string, idx: number) => (
                <motion.div
                  key={skill}
                  className="glass px-3 sm:px-4 py-2 rounded-full border border-green-400/30 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1, 
                    borderColor: "rgb(0, 255, 65)",
                    boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-green-400 font-mono text-xs sm:text-sm">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Projects Section with Hover Effects */}
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlitchText
                text="Projects"
                className="text-3xl font-bold text-blue-400"
                intensity={0.15}
                frequency={0.005}
              />
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.projects.map((project: Project, idx: number) => (
                <motion.a
                  key={project.name}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block glass p-6 rounded-lg border border-gray-700 hover:border-green-400 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 10px 30px rgba(0, 255, 65, 0.2)"
                  }}
                >
                  <div className="relative">
                    <h3 className="text-xl font-semibold text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-purple-300 italic text-sm mb-3 font-mono">
                      {project.position}
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex items-center text-green-400 text-sm font-mono">
                      <span>View Project</span>
                      <motion.span
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlitchText
                text="<Education />"
                className="text-3xl font-bold text-purple-400"
                intensity={0.15}
                frequency={0.005}
              />
            </motion.div>
            <div className="grid md:grid-cols-1 gap-6">
              {content.education.map((edu: Education, idx: number) => (
                <motion.div
                  key={idx}
                  className="glass p-6 rounded-lg border border-gray-700 hover:border-green-400 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 30px rgba(0, 255, 65, 0.2)"
                  }}
                >
                  <h3 className="text-xl font-semibold text-green-400 mb-2">{edu.degree}</h3>
                  <p className="text-gray-300 mb-2">{edu.institution}</p>
                  <p className="text-gray-400 text-sm font-mono">{edu.year}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="py-16 px-4 scroll-mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="code-block p-4 sm:p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-green-400 mb-4">{/* contact.js */}</div>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlitchText
                  text="Get In Touch"
                  className="text-2xl font-bold text-blue-400"
                  intensity={0.1}
                  frequency={0.003}
                />
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-purple-400 font-mono text-sm sm:text-base">Email:</span>
                  <a href={`mailto:${content.contact.email}`} className="text-green-400 hover-glow text-sm sm:text-base break-all sm:break-normal">
                    {content.contact.email}
                  </a>
                </motion.div>
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-purple-400 font-mono text-sm sm:text-base">GitHub:</span>
                  <a href={content.contact.github} className="text-green-400 hover-glow text-sm sm:text-base break-all sm:break-normal" target="_blank" rel="noopener noreferrer">
                    github.com
                  </a>
                </motion.div>
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-purple-400 font-mono text-sm sm:text-base">LinkedIn:</span>
                  <a href={content.contact.linkedin} className="text-green-400 hover-glow text-sm sm:text-base break-all sm:break-normal" target="_blank" rel="noopener noreferrer">
                    linkedin.com
                  </a>
                </motion.div>
                {content.contact.medium && (
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-purple-400 font-mono text-sm sm:text-base">Medium:</span>
                    <a href={content.contact.medium} className="text-green-400 hover-glow text-sm sm:text-base break-all sm:break-normal" target="_blank" rel="noopener noreferrer">
                      medium.com
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Floating Terminal */}
      <FloatingTerminal />
    </main>
  );
}
