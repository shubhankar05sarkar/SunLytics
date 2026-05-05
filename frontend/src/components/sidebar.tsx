"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/30 dark:border-slate-700/40 min-h-screen px-4 py-8 relative z-10 shadow-[5px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[5px_0_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center space-x-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border border-white/20">
          <span className="text-white font-black text-2xl">S</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white drop-shadow-sm">SunLytics</h1>
      </div>
      
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${isActive ? 'bg-white/70 dark:bg-slate-800/70 shadow-md border border-white/50 dark:border-slate-700/50 text-blue-700 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-semibold'}`}>
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {mounted && (
        <div className="mt-auto pt-6 border-t border-slate-300/50 dark:border-slate-700/50">
          <div className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-slate-700/50 p-1.5 rounded-2xl flex items-center justify-between shadow-inner">
            <button 
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-2.5 rounded-xl flex-1 flex justify-center transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700/90 text-amber-500 shadow-md border border-white/60 dark:border-slate-600/50' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('system')}
              title="System Default"
              className={`p-2.5 rounded-xl flex-1 flex justify-center transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-700/90 text-blue-600 shadow-md border border-white/60 dark:border-slate-600/50' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-2.5 rounded-xl flex-1 flex justify-center transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700/90 text-indigo-400 shadow-md border border-white/60 dark:border-slate-600/50' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
