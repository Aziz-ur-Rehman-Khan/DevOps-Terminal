'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiTerminal } from "react-icons/fi";

export default function FloatingTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [outputHistory, setOutputHistory] = useState<string[]>([]);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/content.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Error loading content:', err));
  }, []);

  const commands = {
    help: "Available commands: help, about, skills, projects, contact, clear, exit",
    about: content?.about?.content || "Loading...",
    skills: content?.skills?.join('\n') || "Loading...",
    projects: content?.projects?.map((p: any) => `${p.name}: ${p.description}`).join('\n\n') || "Loading...",
    contact: content?.contact ? 
      `Email: ${content.contact.email}\nGitHub: ${content.contact.github}\nLinkedIn: ${content.contact.linkedin}\nPhone: ${content.contact.phone}\nMedium: ${content.contact.medium}\nLocation: ${content.contact.location}` : 
      "Loading...",
    clear: () => {
      setCommandHistory([]);
      setOutputHistory([]);
      return "";
    },
    exit: () => {
      setIsOpen(false);
      return "Terminal closed";
    }
  };

  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    const output = commands[command as keyof typeof commands];
    
    if (typeof output === "function") {
      return output();
    } else if (output) {
      return output;
    } else {
      return `Command not found: ${command}. Type 'help' for available commands.`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    const output = executeCommand(currentCommand);
    
    setCommandHistory(prev => [...prev, currentCommand]);
    setOutputHistory(prev => [...prev, output]);
    setCurrentCommand("");
  };

  return (
    <>
      {/* Floating terminal button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 glass p-4 rounded-full border border-green-400/30 hover:border-green-400 transition-all duration-300"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="text-green-400 font-mono text-lg">
          <FiTerminal className="w-5 h-5" />
        </div>
      </motion.button>

      {/* Terminal window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl h-96 glass rounded-lg border border-green-400/30 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal header */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 font-mono text-sm">Terminal</div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Terminal content */}
              <div className="p-4 h-full overflow-y-auto">
                <div className="font-mono text-sm text-gray-300 space-y-2">
                  <div className="text-green-400">
                    Welcome to the interactive terminal!
                  </div>
                  <div className="text-gray-500">
                    Type 'help' to see available commands.
                  </div>
                  
                  {/* Command history */}
                  {commandHistory.map((cmd, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-green-400">
                        <span className="text-gray-500">aziz@portfolio:~$</span> {cmd}
                      </div>
                      {outputHistory[index] && (
                        <div className="text-gray-300 ml-4">
                          {outputHistory[index]}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Current command input */}
                  <form onSubmit={handleSubmit} className="flex items-center">
                    <span className="text-green-400 mr-2">
                      <span className="text-gray-500">aziz@portfolio:~$</span>
                    </span>
                    <input
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      className="flex-1 bg-transparent text-gray-300 outline-none font-mono"
                      placeholder="Enter command..."
                      autoFocus
                    />
                    <motion.span
                      className="text-green-400 ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 