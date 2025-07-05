// src/app/components/DiagramGallery.tsx
'use client';
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function DiagramGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/diagrams/diagrams.json')
      .then(res => res.json())
      .then(list => setImages(list.map((name: string) => `/diagrams/${name}`)));
  }, []);

  // Close modal on Esc key
  const escHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedImage(null);
  }, []);
  useEffect(() => {
    if (selectedImage) {
      window.addEventListener("keydown", escHandler);
      return () => window.removeEventListener("keydown", escHandler);
    }
  }, [selectedImage, escHandler]);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-400 font-mono">&lt;Architectures /&gt;</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4">
        {images.map((src, idx) => (
          <motion.div
            key={src}
            className="glass rounded-lg shadow-lg overflow-hidden relative group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00ff41" }}
          >
            <Image
              src={src}
              alt={`Diagram ${idx + 1}`}
              className="w-full h-64 object-contain bg-white cursor-pointer transition"
              width={256}
              height={192}
              onClick={() => setSelectedImage(src)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-10 text-black text-3xl flex items-center justify-center hover:bg-opacity-80 transition"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <Image
                src={selectedImage}
                alt="Enlarged diagram"
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-4 border-green-400 bg-white"
                width={1280}
                height={960}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}