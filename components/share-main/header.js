"use client";

import { motion } from "framer-motion";

export default function Header({ category, title, description }) {
  return (
    <section className="pt-8 pb-6 border-b border-slate-800/80">
      <motion.div
        className="max-w-3xl space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
          {category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {description}
        </p>
      </motion.div>
    </section>
  );
}