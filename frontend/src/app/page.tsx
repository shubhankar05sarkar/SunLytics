"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, CloudSun } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col justify-center items-center max-w-7xl mx-auto min-h-[90vh] relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-white/40 dark:border-slate-700/40 p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/10 dark:shadow-black/50 text-center max-w-4xl relative overflow-hidden"
      >
        {/* Decorative background gradients inside the card */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-8 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>v2.0 Enterprise Release</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            Intelligent Solar <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 drop-shadow-sm">
              Power Forecasting.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium mb-10 drop-shadow-sm">
            Optimize your solar plant efficiency with enterprise-grade machine learning models. Get real-time predictions based on irradiation, temperature, and temporal data.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/dashboard" className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 border border-blue-400/30">
              <span>Open Live Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
