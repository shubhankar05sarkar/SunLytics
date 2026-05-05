"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl space-y-8"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          SunLytics
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
          Real-time Solar Power Prediction utilizing Random Forest Machine Learning architecture.
        </p>
        <div className="pt-12">
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 text-lg bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold backdrop-blur-md border border-white/10 transition-colors shadow-2xl"
            >
              Launch Dashboard →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
