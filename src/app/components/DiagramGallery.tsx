// src/app/components/DiagramGallery.tsx
'use client';
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function DiagramGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/diagrams/diagrams.json')
      .then(res => res.json())
      .then(list => setImages(list.map((name: string) => `/diagrams/${name}`)));
  }, []);

  // Close modal on Esc key
  const escHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedImage(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, []);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      setSelectedImage(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [goToPrevious, goToNext]);

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener("keydown", keyHandler);
      return () => window.removeEventListener("keydown", keyHandler);
    }
  }, [selectedImage, keyHandler]);

  const openModal = (src: string, index: number) => {
    setSelectedImage(src);
    setSelectedIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setSelectedImage(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const resetZoom = () => setZoom(1);

  // Mouse wheel zoom handler
  const handleWheel = useCallback((e: Event) => {
    e.preventDefault();
    const wheelEvent = e as WheelEvent;
    if (wheelEvent.deltaY < 0) {
      setZoom(prev => Math.min(prev + 0.3, 2.5));
    }
  }, []);

  // Double click to reset zoom
  const handleDoubleClick = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Mouse/Touch drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPan({ x: newX, y: newY });
    }
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      setPan({ x: newX, y: newY });
    }
  }, [isDragging, zoom, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const modalElement = document.querySelector('.modal-container');
      if (modalElement) {
        modalElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => modalElement.removeEventListener('wheel', handleWheel);
      }
    }
  }, [selectedImage, handleWheel]);

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
              onClick={() => openModal(src, idx)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Navigation Arrows */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white p-6 transition-all duration-200 z-10 group"
                aria-label="Previous image"
              >
                <svg className="w-12 h-12 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {selectedIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white p-6 transition-all duration-200 z-10 group"
                aria-label="Next image"
              >
                <svg className="w-12 h-12 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <motion.div
              className="relative max-w-4xl w-full p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-5 right-10 text-white text-3xl flex items-center justify-center hover:bg-black/50 rounded-full w-10 h-10 transition-all duration-200 z-10"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>

              {/* Image Counter */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-2 rounded-full text-sm z-10">
                {selectedIndex + 1} / {images.length}
              </div>

              {/* Image Container with Zoom */}
              <div className="flex items-center justify-center max-h-[80vh] max-w-full">
                <Image
                  src={images[selectedIndex]}
                  alt={`Diagram ${selectedIndex + 1}`}
                  className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-4 border-green-400 bg-white transition-transform duration-200 ${
                    zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                  }`}
                  style={{ 
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center'
                  }}
                  width={1280}
                  height={960}
                  onDoubleClick={handleDoubleClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}