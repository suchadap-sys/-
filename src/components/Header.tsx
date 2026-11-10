import React from 'react';
import { QrCode, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentView: 'survey' | 'dashboard' | 'code';
  onViewChange: (view: 'survey' | 'dashboard' | 'code') => void;
  onOpenQR: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenQR,
  isDark,
  onToggleDark
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            ⭐
          </div>
          <button
            onClick={() => onViewChange('dashboard')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
          >
            ระบบประเมินความพึงพอใจการอบรม
          </button>
        </div>

        {/* Zone 2: Navigation Links / View Switchers */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onViewChange('survey')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'survey'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📱 หน้าแบบสอบถามมือถือ
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'dashboard'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📊 หน้าแดชบอร์ดจอภาพ
          </button>

          <button
            onClick={() => onViewChange('code')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'code'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💻 โค้ด 2 ไฟล์ & ติดตั้ง Firebase
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDark}
            aria-label="สลับธีม สว่าง/มืด"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenQR}
            className="px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code ตอบแบบสอบถาม</span>
            <span className="sm:hidden">QR สแกน</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 px-2 py-2 text-xs">
        <button
          onClick={() => onViewChange('survey')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            currentView === 'survey'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          📱 แบบสอบถาม
        </button>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            currentView === 'dashboard'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          📊 แดชบอร์ด
        </button>
        <button
          onClick={() => onViewChange('code')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            currentView === 'code'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          💻 โค้ด & คู่มือ
        </button>
      </div>
    </header>
  );
};
