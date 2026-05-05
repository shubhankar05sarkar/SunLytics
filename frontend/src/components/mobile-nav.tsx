"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MobileNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-white/30 dark:border-slate-700/40 z-50 px-6 py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <nav className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-600 dark:text-slate-300'}`}>
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center p-2 rounded-xl transition-all text-slate-600 dark:text-slate-300 hover:scale-110"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6 mb-1 text-amber-500" /> : <Moon className="w-6 h-6 mb-1 text-slate-700" />}
            <span className="text-[10px] font-bold">Theme</span>
          </button>
        )}
      </nav>
    </div>
  );
}
