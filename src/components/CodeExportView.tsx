import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen, Settings, ExternalLink, ShieldAlert, Rocket, Database } from 'lucide-react';
import { realtimeSync } from '../services/realtimeSync';

export const CodeExportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'index' | 'dashboard' | 'guide' | 'connect'>('guide');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Firebase Config Form State
  const initialConfig = realtimeSync.getFirebaseConfig();
  const [dbUrl, setDbUrl] = useState<string>(initialConfig.databaseURL || '');
  const [apiKey, setApiKey] = useState<string>(initialConfig.apiKey || '');
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled || false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleCopy = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    });
  };

  const handleDownload = (code: string, fileName: string) => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    realtimeSync.updateFirebaseConfig({
      apiKey,
      databaseURL: dbUrl.trim(),
      enabled: isEnabled
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          โค้ดแยก 2 ไฟล์ & คู่มือการตั้งค่า Firebase Realtime Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          โค้ดแบบ Standalone แยกเป็น 2 ไฟล์อิสระ (HTML + Vanilla JS + Firebase Web SDK) พร้อมนำไป Deploy หรือเปิดรันได้ทันที
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>คู่มือตั้งค่า Firebase & Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('index')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'index'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ไฟล์ที่ 1: index.html (หน้าตอบมือถือ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ไฟล์ที่ 2: dashboard.html (หน้าจอโปรเจกเตอร์)</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>เชื่อมต่อ Firebase Realtime Database ของคุณ</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ขั้นตอนที่ 1: สร้างโปรเจกต์บน Firebase Console (ฟรี 100%)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a> แล้วกดปุ่ม <strong>"Add project"</strong> (เพิ่มโปรเจกต์) ตั้งชื่อโปรเจกต์ตามที่ต้องการ เช่น <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">training-survey-2026</code> จากนั้นกด Continue จนสร้างเสร็จ
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                1. ในเมนูด้านซ้ายของ Firebase Console เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong>
              </p>
              <p>
                2. คลิกปุ่ม <strong>"Create Database"</strong> (สร้างฐานข้อมูล)
              </p>
              <p>
                3. เลือกตำแหน่งเซิร์ฟเวอร์ (Realtime Database Location) แนะนำให้เลือก <strong>Singapore (asia-southeast1)</strong> หรือ <strong>United States (us-central1)</strong> เพื่อการตอบสนองที่รวดเร็ว
              </p>
              <p>
                4. ในหน้าถัดไป เลือกระหว่าง Locked mode หรือ Test mode (เราจะเข้าไปตั้งค่า Rules ในขั้นตอนถัดไป) แล้วกด <strong>Enable</strong>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ขั้นตอนที่ 3: ตั้งค่า Security Rules (ให้อ่านและบันทึกได้โดยไม่ต้องล็อกอิน)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ไปที่แท็บ <strong>"Rules"</strong> ใน Realtime Database แล้วคัดลอกโค้ดด้านล่างนี้ไปวางแทนที่ จากนั้นกด <strong>"Publish"</strong>:
            </p>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
{`{
  "rules": {
    "responses": {
      // อนุญาตให้ Dashboard อ่านข้อมูลทั้งหมดได้แบบเรียลไทม์
      ".read": true,
      // อนุญาตให้ผู้เข้าอบรมส่งคำตอบใหม่ได้โดยไม่ต้องล็อกอิน
      ".write": true,
      "$response_id": {
        // ตรวจสอบว่ามีข้อมูลคำตอบ answers ครบถ้วน
        ".validate": "newData.hasChildren(['answers', 'timestamp'])"
      }
    }
  }
}`}
              </pre>
              <button
                onClick={() => handleCopy(`{\n  "rules": {\n    "responses": {\n      ".read": true,\n      ".write": true,\n      "$response_id": {\n        ".validate": "newData.hasChildren(['answers', 'timestamp'])"\n      }\n    }\n  }\n}`, 'rules')}
                className="absolute top-3 right-3 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              >
                {copiedFile === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'rules' ? 'คัดลอกแล้ว' : 'คัดลอก Rules'}</span>
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ขั้นตอนที่ 4: คัดลอก Firebase Config มาวางในไฟล์
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                1. คลิกไอคอนรูปฟันเฟือง ⚙️ ข้างคำว่า <strong>Project Overview</strong> &gt; เลือก <strong>Project settings</strong>
              </p>
              <p>
                2. เลื่อนลงมาที่หัวข้อ <strong>"Your apps"</strong> คลิกไอคอน <strong>&lt;/&gt;</strong> (Web) เพื่อสร้าง Web App
              </p>
              <p>
                3. ตั้งชื่อ App เช่น <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">training-web</code> แล้วคลิก <strong>Register app</strong>
              </p>
              <p>
                4. คัดลอกออบเจกต์ <code className="text-indigo-600 font-mono">firebaseConfig</code> ที่ได้ ไปวางแทนที่บรรทัด <code className="text-indigo-600 font-mono">const firebaseConfig = ...</code> ในทั้ง 2 ไฟล์ (<code className="font-mono">index.html</code> และ <code className="font-mono">dashboard.html</code>)
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ขั้นตอนที่ 5: วิธี Deploy ออนไลน์ฟรี 100%
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-indigo-500" />
                  <span>วิธีที่ A: GitHub Pages (ง่ายที่สุด)</span>
                </h4>
                <p className="text-xs leading-relaxed">
                  1. สร้าง Repository บน GitHub (Public หรือ Private)<br />
                  2. อัปโหลดไฟล์ <code className="font-mono">index.html</code> และ <code className="font-mono">dashboard.html</code> เข้าไป<br />
                  3. ไปที่ <strong>Settings &gt; Pages</strong> เลือก Branch <strong>main</strong> แล้วกด Save<br />
                  4. จะได้ URL พร้อมใช้งานทันที เช่น <code className="font-mono text-indigo-600">https://username.github.io/repo/</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-emerald-500" />
                  <span>วิธีที่ B: Firebase Hosting</span>
                </h4>
                <p className="text-xs leading-relaxed">
                  1. ติดตั้ง Firebase CLI: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">npm install -g firebase-tools</code><br />
                  2. สั่ง <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">firebase login</code> และ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">firebase init hosting</code><br />
                  3. นำไฟล์ทั้ง 2 ไปวางในโฟลเดอร์ public แล้วสั่ง <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">firebase deploy</code><br />
                  4. รวดเร็ว รองรับผู้เข้าใช้งานนับพันคนพร้อมกันฟรี
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INDEX.HTML (SURVEY) */}
      {activeTab === 'index' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📄 ไฟล์ที่ 1: index.html</span>
                <span className="text-xs font-normal text-slate-500">(หน้าแบบสอบถามสำหรับผู้เข้าอบรมตอบผ่านมือถือ)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ขนาดเบา ออกแบบปุ่มใหญ่สำหรับจอมือถือ รองรับการส่งข้อมูลเข้า Firebase Realtime Database อัตโนมัติ
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(STANDALONE_INDEX_CODE, 'index.html')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedFile === 'index.html' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'index.html' ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>

              <button
                onClick={() => handleDownload(STANDALONE_INDEX_CODE, 'index.html')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 sm:p-6 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono max-h-[600px] overflow-y-auto overflow-x-auto leading-relaxed border border-slate-800">
              {STANDALONE_INDEX_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: DASHBOARD.HTML */}
      {activeTab === 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📄 ไฟล์ที่ 2: dashboard.html</span>
                <span className="text-xs font-normal text-slate-500">(หน้าแดชบอร์ดแสดงผลขึ้นจอโปรเจกเตอร์)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                รับข้อมูลเรียลไทม์ผ่าน onValue ของ Firebase Realtime Database, กราฟ Chart.js, สรุปเกณฑ์ 5 ระดับ, ปุ่ม Export CSV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(STANDALONE_DASHBOARD_CODE, 'dashboard.html')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedFile === 'dashboard.html' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'dashboard.html' ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>

              <button
                onClick={() => handleDownload(STANDALONE_DASHBOARD_CODE, 'dashboard.html')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 sm:p-6 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono max-h-[600px] overflow-y-auto overflow-x-auto leading-relaxed border border-slate-800">
              {STANDALONE_DASHBOARD_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CONNECT FIREBASE IN CURRENT APP */}
      {activeTab === 'connect' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ตั้งค่าเชื่อมต่อ Firebase Realtime Database ในเว็บแอปนี้
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              หากท่านมี Firebase Realtime Database URL อยู่แล้ว สามารถกรอก URL เพื่อทดสอบการรับส่งข้อมูลผ่าน Firebase จริงบนหน้านี้ได้ทันที
            </p>
          </div>

          <form onSubmit={handleSaveFirebaseConfig} className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enable-firebase"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="enable-firebase" className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                เปิดใช้งานการซิงค์ผ่าน Firebase Realtime Database
              </label>
            </div>

            <div>
              <label htmlFor="db-url" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Database URL (เช่น https://my-project-default-rtdb.asia-southeast1.firebasedatabase.app)
              </label>
              <input
                type="text"
                id="db-url"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                placeholder="https://YOUR_DATABASE_NAME.asia-southeast1.firebasedatabase.app"
                className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกการเชื่อมต่อ</span>
              </button>

              {savedSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ บันทึกการตั้งค่าเรียบร้อยแล้ว
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
              * หากไม่เปิดใช้งาน ระบบจะทำงานผ่าน Local Multi-Tab Synchronizer และ LocalStorage ให้คุณทดสอบเปิดหลายแท็บพร้อมกันได้ทันทีแบบไม่ต้องเชื่อมต่อภายนอก
            </p>
          </form>
        </div>
      )}

    </div>
  );
};

// Raw standalone code strings for instant 1-click copy & download
const STANDALONE_INDEX_CODE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"><\/script>
  
  <style>
    body { font-family: 'Prompt', -apple-system, sans-serif; }
    .score-btn.active {
      transform: scale(1.05);
      border-color: #4f46e5;
      background-color: #4f46e5;
      color: #ffffff;
      box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.35);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-12">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">✍️</div>
        <div>
          <h1 class="text-sm font-semibold text-slate-900 leading-tight">แบบประเมินความพึงพอใจ</h1>
          <p class="text-xs text-slate-500">โครงการสัมมนาและฝึกอบรม</p>
        </div>
      </div>
      <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">ไม่ระบุตัวตน</span>
    </div>
  </header>

  <main class="max-w-md mx-auto px-4 pt-4">
    <!-- Already Submitted Banner -->
    <div id="already-submitted-card" class="hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center mb-6">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-3">✓</div>
      <h2 class="text-lg font-bold text-slate-900 mb-1">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
      <p class="text-sm text-slate-600 mb-4">ท่านได้ทำแบบประเมินสำหรับเครื่องนี้แล้ว ขอบพระคุณสำหรับความคิดเห็น</p>
      <button id="btn-retest" type="button" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline">
        ทำแบบประเมินใหม่ (สำหรับทดสอบ)
      </button>
    </div>

    <!-- Survey Form -->
    <form id="survey-form" class="space-y-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <p class="text-xs text-slate-500 leading-relaxed">
          กรุณาเลือกคะแนนตามความพึงพอใจจริง (1 = น้อยที่สุด, 5 = มากที่สุด) ข้อมูลจะถูกส่งไปยังจอสรุปผลของผู้จัดทันที
        </p>
      </div>

      <!-- Question 1 -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs question-card" data-qid="q1">
        <div class="flex items-start gap-2 mb-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">1</span>
          <p class="text-sm font-medium text-slate-900">เนื้อหาและหลักสูตรตรงกับความต้องการและนำไปประยุกต์ใช้ได้จริง</p>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q1" data-val="1"><span>😞</span><span class="font-bold">1</span><span class="text-[10px] text-slate-400">น้อยสุด</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q1" data-val="2"><span>🙁</span><span class="font-bold">2</span><span class="text-[10px] text-slate-400">น้อย</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q1" data-val="3"><span>😐</span><span class="font-bold">3</span><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q1" data-val="4"><span>😊</span><span class="font-bold">4</span><span class="text-[10px] text-slate-400">มาก</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q1" data-val="5"><span>🤩</span><span class="font-bold">5</span><span class="text-[10px] text-slate-400">มากสุด</span></button>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs question-card" data-qid="q2">
        <div class="flex items-start gap-2 mb-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">2</span>
          <p class="text-sm font-medium text-slate-900">วิทยากรมีความรู้ความสามารถและเทคนิคการถ่ายทอดที่เข้าใจง่าย</p>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q2" data-val="1"><span>😞</span><span class="font-bold">1</span><span class="text-[10px] text-slate-400">น้อยสุด</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q2" data-val="2"><span>🙁</span><span class="font-bold">2</span><span class="text-[10px] text-slate-400">น้อย</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q2" data-val="3"><span>😐</span><span class="font-bold">3</span><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q2" data-val="4"><span>😊</span><span class="font-bold">4</span><span class="text-[10px] text-slate-400">มาก</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q2" data-val="5"><span>🤩</span><span class="font-bold">5</span><span class="text-[10px] text-slate-400">มากสุด</span></button>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs question-card" data-qid="q3">
        <div class="flex items-start gap-2 mb-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
          <p class="text-sm font-medium text-slate-900">การจัดสรรเวลาและการมีส่วนร่วมในกิจกรรมมีความเหมาะสม</p>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q3" data-val="1"><span>😞</span><span class="font-bold">1</span><span class="text-[10px] text-slate-400">น้อยสุด</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q3" data-val="2"><span>🙁</span><span class="font-bold">2</span><span class="text-[10px] text-slate-400">น้อย</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q3" data-val="3"><span>😐</span><span class="font-bold">3</span><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q3" data-val="4"><span>😊</span><span class="font-bold">4</span><span class="text-[10px] text-slate-400">มาก</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q3" data-val="5"><span>🤩</span><span class="font-bold">5</span><span class="text-[10px] text-slate-400">มากสุด</span></button>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs question-card" data-qid="q4">
        <div class="flex items-start gap-2 mb-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">4</span>
          <p class="text-sm font-medium text-slate-900">สื่อ เอกสารประกอบ และสถานที่/ระบบการอบรมมีคุณภาพ</p>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q4" data-val="1"><span>😞</span><span class="font-bold">1</span><span class="text-[10px] text-slate-400">น้อยสุด</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q4" data-val="2"><span>🙁</span><span class="font-bold">2</span><span class="text-[10px] text-slate-400">น้อย</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q4" data-val="3"><span>😐</span><span class="font-bold">3</span><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q4" data-val="4"><span>😊</span><span class="font-bold">4</span><span class="text-[10px] text-slate-400">มาก</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q4" data-val="5"><span>🤩</span><span class="font-bold">5</span><span class="text-[10px] text-slate-400">มากสุด</span></button>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs question-card" data-qid="q5">
        <div class="flex items-start gap-2 mb-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">5</span>
          <p class="text-sm font-medium text-slate-900">ความพึงพอใจในภาพรวมต่อการจัดอบรมครั้งนี้</p>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q5" data-val="1"><span>😞</span><span class="font-bold">1</span><span class="text-[10px] text-slate-400">น้อยสุด</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q5" data-val="2"><span>🙁</span><span class="font-bold">2</span><span class="text-[10px] text-slate-400">น้อย</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q5" data-val="3"><span>😐</span><span class="font-bold">3</span><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q5" data-val="4"><span>😊</span><span class="font-bold">4</span><span class="text-[10px] text-slate-400">มาก</span></button>
          <button type="button" class="score-btn flex flex-col items-center py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-xs" data-qid="q5" data-val="5"><span>🤩</span><span class="font-bold">5</span><span class="text-[10px] text-slate-400">มากสุด</span></button>
        </div>
      </div>

      <!-- Feedback -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <label for="feedback" class="block text-sm font-medium text-slate-900 mb-1">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)</label>
        <textarea id="feedback" rows="3" class="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden" placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."></textarea>
      </div>

      <div id="validation-error" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
        ⚠️ กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่ง
      </div>

      <button id="btn-submit" type="submit" class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
        <span>ส่งแบบประเมินความพึงพอใจ</span><span>🚀</span>
      </button>
    </form>
  </main>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
    import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

    // ⚙️ นำค่า Firebase Config ของคุณมาวางตรงนี้:
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_DATABASE_NAME.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID"
    };

    const isFirebaseConfigured = firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('YOUR_DATABASE_NAME');
    let db = null;
    if (isFirebaseConfigured) {
      try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
      } catch (e) { console.warn(e); }
    }

    const answers = { q1: null, q2: null, q3: null, q4: null, q5: null };
    const STORAGE_KEY = 'training_survey_submitted_device';
    const form = document.getElementById('survey-form');
    const alreadyCard = document.getElementById('already-submitted-card');
    const errorEl = document.getElementById('validation-error');
    const btnSubmit = document.getElementById('btn-submit');
    const btnRetest = document.getElementById('btn-retest');

    function checkPrevious() {
      if (localStorage.getItem(STORAGE_KEY)) {
        form.classList.add('hidden');
        alreadyCard.classList.remove('hidden');
      } else {
        form.classList.remove('hidden');
        alreadyCard.classList.add('hidden');
      }
    }
    checkPrevious();

    btnRetest.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('active'));
      Object.keys(answers).forEach(k => answers[k] = null);
      document.getElementById('feedback').value = '';
      checkPrevious();
    });

    document.querySelectorAll('.score-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        answers[qid] = parseInt(btn.dataset.val, 10);
        document.querySelectorAll(\`.score-btn[data-qid="\${qid}"]\`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        errorEl.classList.add('hidden');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const unanswered = Object.keys(answers).filter(k => answers[k] === null);
      if (unanswered.length > 0) {
        errorEl.classList.remove('hidden');
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerText = 'กำลังส่งข้อมูล...';
      const feedback = document.getElementById('feedback').value.trim();
      const payload = {
        answers: { ...answers },
        feedback: feedback || null,
        timestamp: Date.now(),
        submittedAt: new Date().toISOString()
      };

      try {
        if (isFirebaseConfigured && db) {
          const newRef = push(ref(db, 'responses'));
          await set(newRef, payload);
        } else {
          const list = JSON.parse(localStorage.getItem('training_survey_responses_v1') || '[]');
          list.unshift({ id: 'resp-' + Date.now(), ...payload });
          localStorage.setItem('training_survey_responses_v1', JSON.stringify(list));
          if (window.BroadcastChannel) {
            new BroadcastChannel('training_survey_broadcast').postMessage({ type: 'SYNC_RESPONSES', payload: list });
          }
        }

        if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        localStorage.setItem(STORAGE_KEY, 'submitted_' + Date.now());

        setTimeout(() => {
          checkPrevious();
          btnSubmit.disabled = false;
          btnSubmit.innerText = 'ส่งแบบประเมินความพึงพอใจ 🚀';
        }, 500);
      } catch (err) {
        alert('เกิดข้อผิดพลาด: ' + err.message);
        btnSubmit.disabled = false;
        btnSubmit.innerText = 'ส่งแบบประเมินความพึงพอใจ 🚀';
      }
    });
  <\/script>
</body>
</html>`;

const STANDALONE_DASHBOARD_CODE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แดชบอร์ดสรุปผลความพึงพอใจการอบรม (Realtime)</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>

  <style>
    body { font-family: 'Prompt', -apple-system, sans-serif; }
    .font-num { font-family: 'Plus Jakarta Sans', monospace; font-variant-numeric: tabular-nums; }
    .projector-mode { background-color: #090d16 !important; color: #f8fafc !important; }
    .projector-mode .dash-card { background-color: #111827 !important; border-color: #1f2937 !important; }
    .projector-mode .dash-text-muted { color: #94a3b8 !important; }
  </style>
</head>
<body id="dash-body" class="bg-slate-50 text-slate-800 min-h-screen">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs dash-card">
    <div class="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">📊</div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">แดชบอร์ดสรุปความพึงพอใจการอบรม</h1>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">เรียลไทม์</span>
          </div>
          <p class="text-xs text-slate-500 dash-text-muted">ผลการประเมินอัปเดตอัตโนมัติทันทีที่มีผู้ส่งคำตอบ</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button id="btn-show-qr" class="px-3.5 py-2 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
          <span>📱</span><span>แสดง QR ให้สแกนตอบ</span>
        </button>
        <button id="btn-toggle-theme" class="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
          <span>🖥️</span><span>โหมดจอโปรเจกเตอร์</span>
        </button>
        <button id="btn-export-csv" class="px-3.5 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5">
          <span>📥</span><span>ดาวน์โหลด CSV</span>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
    <!-- KPI Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card">
        <div class="text-xs text-slate-500 dash-text-muted mb-2">จำนวนผู้ตอบทั้งหมด</div>
        <div class="flex items-baseline gap-2">
          <span id="stat-count" class="text-3xl font-extrabold font-num text-slate-900">0</span>
          <span class="text-xs text-slate-500">คน</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card">
        <div class="text-xs text-slate-500 dash-text-muted mb-2">คะแนนเฉลี่ยรวม (X̄)</div>
        <div class="flex items-baseline gap-2">
          <span id="stat-mean" class="text-3xl font-extrabold font-num text-indigo-600">0.00</span>
          <span class="text-xs text-slate-500">/ 5.00</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card">
        <div class="text-xs text-slate-500 dash-text-muted mb-2">ส่วนเบี่ยงเบนมาตรฐาน (S.D.)</div>
        <div class="flex items-baseline gap-2">
          <span id="stat-sd" class="text-3xl font-extrabold font-num text-slate-900">0.00</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card">
        <div class="text-xs text-slate-500 dash-text-muted mb-2">ระดับการแปลผล 5 ระดับ</div>
        <span id="stat-level" class="inline-block px-3 py-1 rounded-lg text-sm font-bold bg-indigo-100 text-indigo-700">รอข้อมูล</span>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 dash-card">
        <h2 class="text-sm sm:text-base font-bold text-slate-900 mb-4">คะแนนเฉลี่ยจำแนกรายข้อ (5 ด้าน)</h2>
        <div class="h-64 sm:h-72 w-full"><canvas id="questionChart"></canvas></div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card flex flex-col">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-sm font-bold text-slate-900">สัดส่วนการให้คะแนน (1-5 ดาว)</h2>
          <span class="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">กราฟวงกลม</span>
        </div>
        <p class="text-xs text-slate-500 dash-text-muted mb-2">กระจายตามระดับ 1 ถึง 5 ดาวจากทุกข้อคำถาม</p>
        <div class="h-48 w-full flex items-center justify-center my-1"><canvas id="distributionPieChart"></canvas></div>
        <div id="distribution-container" class="space-y-1.5 flex-1 mt-2 pt-2 border-t border-slate-100"></div>
      </div>
    </div>

    <!-- Live Feedback -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 dash-card">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold text-slate-900">ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม</h2>
        <span id="feedback-count" class="text-xs font-num font-semibold text-slate-500">0 ข้อความ</span>
      </div>
      <div id="feedback-container" class="space-y-3 max-h-80 overflow-y-auto"></div>
    </div>
  </main>

  <!-- QR Modal -->
  <div id="qr-modal" class="hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative">
      <button id="btn-close-qr" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
      <h3 class="text-lg font-bold text-slate-900 mb-2">สแกน QR Code เพื่อตอบแบบประเมิน</h3>
      <div class="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 mb-3">
        <div id="qrcode-box" class="flex justify-center"></div>
      </div>
      <div id="survey-url-display" class="text-xs text-slate-500 break-all p-2 rounded bg-slate-50 font-mono mb-3"></div>
      <button id="btn-copy-url" class="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-medium">คัดลอกลิงก์</button>
    </div>
  </div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

    // ⚙️ นำค่า Firebase Config ของคุณมาวางตรงนี้:
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_DATABASE_NAME.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID"
    };

    const isFirebaseConfigured = firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('YOUR_DATABASE_NAME');
    const QUESTIONS = [
      { id: 'q1', shortLabel: 'เนื้อหาหลักสูตร' },
      { id: 'q2', shortLabel: 'วิทยากรการสอน' },
      { id: 'q3', shortLabel: 'เวลาและกิจกรรม' },
      { id: 'q4', shortLabel: 'สื่อและระบบ' },
      { id: 'q5', shortLabel: 'ภาพรวมการอบรม' },
    ];

    let currentResponses = [];
    let chartInstance = null;
    let pieChartInstance = null;

    function getInterpretation(mean) {
      if (mean >= 4.51) return { label: 'มากที่สุด', color: '#4f46e5', bg: 'bg-indigo-100 text-indigo-700' };
      if (mean >= 3.51) return { label: 'มาก', color: '#10b981', bg: 'bg-emerald-100 text-emerald-700' };
      if (mean >= 2.51) return { label: 'ปานกลาง', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700' };
      if (mean >= 1.51) return { label: 'น้อย', color: '#f97316', bg: 'bg-orange-100 text-orange-700' };
      return { label: 'น้อยที่สุด', color: '#ef4444', bg: 'bg-rose-100 text-rose-700' };
    }

    function updateDashboard(responses) {
      currentResponses = responses;
      document.getElementById('stat-count').innerText = responses.length;
      if (responses.length === 0) return;

      let allSum = 0, allCount = 0;
      const allScores = [];
      const scoreDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      const qStats = QUESTIONS.map(q => {
        const scores = [];
        responses.forEach(r => {
          if (r.answers && r.answers[q.id]) {
            const v = parseInt(r.answers[q.id], 10);
            scores.push(v);
            allScores.push(v);
            allSum += v;
            allCount++;
            scoreDist[v] = (scoreDist[v] || 0) + 1;
          }
        });
        const mean = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { ...q, mean: Number(mean.toFixed(2)), interp: getInterpretation(mean) };
      });

      const overallMean = allCount > 0 ? (allSum / allCount) : 0;
      let overallSD = 0;
      if (allScores.length > 1) {
        const variance = allScores.reduce((a, b) => a + Math.pow(b - overallMean, 2), 0) / (allScores.length - 1);
        overallSD = Math.sqrt(variance);
      }

      document.getElementById('stat-mean').innerText = overallMean.toFixed(2);
      document.getElementById('stat-sd').innerText = overallSD.toFixed(2);
      const interp = getInterpretation(overallMean);
      const levelEl = document.getElementById('stat-level');
      levelEl.innerText = interp.label;
      levelEl.className = \`inline-block px-3 py-1 rounded-lg text-sm font-bold \${interp.bg}\`;

      // Chart.js Bar
      const ctx = document.getElementById('questionChart').getContext('2d');
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: qStats.map(q => q.shortLabel),
          datasets: [{ data: qStats.map(q => q.mean), backgroundColor: qStats.map(q => q.interp.color), borderRadius: 8 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 5 } }
        }
      });

      // Chart.js Doughnut / Pie Chart
      const pieCanvas = document.getElementById('distributionPieChart');
      if (pieCanvas) {
        const pieCtx = pieCanvas.getContext('2d');
        if (pieChartInstance) pieChartInstance.destroy();
        pieChartInstance = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['5 ดาว', '4 ดาว', '3 ดาว', '2 ดาว', '1 ดาว'],
            datasets: [{
              data: [scoreDist[5] || 0, scoreDist[4] || 0, scoreDist[3] || 0, scoreDist[2] || 0, scoreDist[1] || 0],
              backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#f97316', '#ef4444'],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '62%'
          }
        });
      }

      // Legend
      const distBox = document.getElementById('distribution-container');
      distBox.innerHTML = '';
      const cMap = { 5: '#4f46e5', 4: '#10b981', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };
      const lMap = { 5: 'มากที่สุด', 4: 'มาก', 3: 'ปานกลาง', 2: 'น้อย', 1: 'น้อยที่สุด' };
      for (let s = 5; s >= 1; s--) {
        const count = scoreDist[s] || 0;
        const pct = allCount > 0 ? ((count / allCount) * 100).toFixed(0) : 0;
        distBox.innerHTML += \`
          <div class="flex items-center justify-between text-xs py-0.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: \${cMap[s]}"></span>
              <span class="font-medium text-slate-700">\${s} ดาว (\${lMap[s]})</span>
            </div>
            <div class="font-num text-slate-500">
              <span class="font-bold text-slate-800">\${count} ครั้ง</span>
              <span class="text-[11px] text-slate-400">(\${pct}%)</span>
            </div>
          </div>\`;
      }

      // Feedback
      const fbBox = document.getElementById('feedback-container');
      const feedbacks = responses.filter(r => r.feedback && r.feedback.trim().length > 0);
      document.getElementById('feedback-count').innerText = feedbacks.length + ' ข้อความ';
      fbBox.innerHTML = feedbacks.map(f => \`<div class="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100">"\${f.feedback}"</div>\`).join('') || '<div class="text-center py-6 text-xs text-slate-400">ยังไม่มีข้อเสนอแนะ</div>';
    }

    // CSV
    document.getElementById('btn-export-csv').addEventListener('click', () => {
      const BOM = '\\uFEFF';
      const headers = ['ลำดับ', 'วันเวลาที่ตอบ', ...QUESTIONS.map(q => q.shortLabel), 'ข้อเสนอแนะ'];
      const rows = currentResponses.map((r, i) => [i + 1, \`"\${new Date(r.timestamp || Date.now()).toLocaleString('th-TH')}"\`, ...QUESTIONS.map(q => r.answers ? r.answers[q.id] || '' : ''), \`"\${(r.feedback || '').replace(/"/g, '""')}"\`].join(','));
      const blob = new Blob([BOM + [headers.join(','), ...rows].join('\\r\\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = \`ผลการประเมิน_\${Date.now()}.csv\`; a.click();
    });

    // Projector mode
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('projector-mode');
    });

    // QR
    const qrModal = document.getElementById('qr-modal');
    const surveyUrl = window.location.href.replace('dashboard.html', 'index.html');
    document.getElementById('survey-url-display').innerText = surveyUrl;
    new QRCode(document.getElementById('qrcode-box'), { text: surveyUrl, width: 220, height: 220 });
    document.getElementById('btn-show-qr').onclick = () => qrModal.classList.remove('hidden');
    document.getElementById('btn-close-qr').onclick = () => qrModal.classList.add('hidden');
    document.getElementById('btn-copy-url').onclick = () => { navigator.clipboard.writeText(surveyUrl); alert('คัดลอกลิงก์แล้ว'); };

    if (isFirebaseConfigured) {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        onValue(ref(db, 'responses'), (snap) => {
          const val = snap.val();
          updateDashboard(val ? Object.keys(val).map(k => ({ id: k, ...val[k] })).reverse() : []);
        });
      } catch (e) { console.warn(e); }
    } else {
      const initial = JSON.parse(localStorage.getItem('training_survey_responses_v1') || '[]');
      updateDashboard(initial);
      if (window.BroadcastChannel) {
        new BroadcastChannel('training_survey_broadcast').onmessage = (e) => {
          if (e.data?.type === 'SYNC_RESPONSES') updateDashboard(e.data.payload || []);
        };
      }
    }
  <\/script>
</body>
</html>`;
