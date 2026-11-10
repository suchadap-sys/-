/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SurveyResponse } from './types';
import { realtimeSync } from './services/realtimeSync';
import { Header } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { CodeExportView } from './components/CodeExportView';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'survey' | 'dashboard' | 'code'>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [surveyUrl, setSurveyUrl] = useState<string>('');

  // 1. Initialize view from URL query params (e.g. ?view=survey or ?view=dashboard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'survey') {
        setCurrentView('survey');
      } else if (viewParam === 'code') {
        setCurrentView('code');
      } else {
        setCurrentView('dashboard');
      }

      // Compute standalone survey URL for attendees
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const fullSurveyUrl = `${origin}${pathname}?view=survey`;
      setSurveyUrl(fullSurveyUrl);

      // Check dark mode preference
      const isDarkMode = document.documentElement.classList.contains('dark') || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // 2. Subscribe to real-time responses
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((data) => {
      setResponses(data);
    });
    return () => unsubscribe();
  }, []);

  // 3. Handle View Change & sync URL query parameter
  const handleViewChange = (view: 'survey' | 'dashboard' | 'code') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.pushState({}, '', url.toString());
    }
  };

  // 4. Dark mode toggle
  const handleToggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenQR={() => setIsQRModalOpen(true)}
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentView === 'survey' && (
          <SurveyView onSuccessSubmit={() => {}} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQR={() => setIsQRModalOpen(true)}
          />
        )}

        {currentView === 'code' && (
          <CodeExportView />
        )}
      </main>

      {/* Full-Screen & Presentation QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            ระบบประเมินความพึงพอใจและแดชบอร์ดสรุปผลแบบเรียลไทม์ · สอดคล้องกับเกณฑ์ 5 ระดับมาตรฐาน
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>ไม่เก็บข้อมูลส่วนตัวผู้ตอบ</span>
            <span>·</span>
            <button 
              onClick={() => handleViewChange('code')} 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ดูโค้ด & วิธีตั้งค่า Firebase
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
