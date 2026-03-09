"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-primary leading-none"
          style={{ fontSize: "clamp(8rem, 20vw, 25rem)" }}
        >
          404
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-heading tracking-tight text-white leading-[1.15] mt-4"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-white/40 mt-4 max-w-md"
        >
          The page you are looking for doesn&apos;t exist or has been moved
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <a
            href="/"
            className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-white font-heading tracking-wider text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Go home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
