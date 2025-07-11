'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
  categories: string[];
}

export default function MediumFeed() {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@azizr5050')
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setPosts(data.items);
          setError(null);
        } else {
          setError("Failed to load Medium posts.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch Medium feed.");
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-green-400 font-mono">&lt;MediumFeed /&gt;</h2>
      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="code-block p-4 sm:p-6 text-center text-green-400 font-mono loading-pulse">
            Loading Medium posts...
          </div>
        )}
        {error && (
          <div className="code-block p-4 sm:p-6 text-center text-red-400 font-mono">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-2 sm:px-4">
          <AnimatePresence>
        {posts.map((post, idx) => (
          <motion.a
                key={post.link}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
                className="group glass block p-4 sm:p-6 rounded-lg border border-green-400/20 hover:border-green-400 transition-all duration-300 shadow-lg max-w-sm w-full mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(0,255,65,0.2)"
                }}
          >
                <div className="flex items-center mb-3 sm:mb-4">
                  {post.thumbnail && (
                    <div className="flex-shrink-0">
                      <div className="flex justify-center">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full max-w-xs rounded-lg shadow"
                          width={64}
                          height={64}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                    <h3 className="text-sm sm:text-lg font-bold text-green-400 font-mono group-hover:underline line-clamp-2">{post.title}</h3>
                    <div className="text-xs text-gray-400 font-mono">{new Date(post.pubDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-gray-300 mb-2 font-sans text-sm sm:text-base line-clamp-3">{post.description.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                  {post.categories.map(cat => (
                    <span key={cat} className="bg-green-900/30 text-green-300 px-2 py-1 rounded-full text-xs font-mono">{cat}</span>
                  ))}
                </div>
          </motion.a>
        ))}
          </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
