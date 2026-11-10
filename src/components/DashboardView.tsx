import React, { useState } from 'react';
import { SurveyResponse } from '../types';
import { calculateStats, RATING_SCALE } from '../data/questions';
import { realtimeSync, exportToCSV } from '../services/realtimeSync';
import { 
  Users, 
  Award, 
  BarChart3, 
  Download, 
  QrCode, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  RotateCcw, 
  MessageSquare, 
  Check, 
  Info,
  Layers,
  ChevronDown,
  PieChart
} from 'lucide-react';
import { PieDonutChart } from './PieDonutChart';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQR: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ responses, onOpenQR }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showDemoMenu, setShowDemoMenu] = useState<boolean>(false);
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string>('all');
  const [distChartType, setDistChartType] = useState<'pie' | 'bar'>('pie');

  const summary = calculateStats(responses);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(responses);
  };

  const handleAddDemoResponse = (count = 1) => {
    for (let i = 0; i < count; i++) {
      realtimeSync.addDemoResponse();
    }
    setShowDemoMenu(false);
  };

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดเพื่อเริ่มรอบใหม่ใช่หรือไม่?')) {
      realtimeSync.resetAllResponses();
    }
    setShowDemoMenu(false);
  };

  const handleLoadSample = () => {
    realtimeSync.loadSampleResponses();
    setShowDemoMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Projector Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              แดชบอร์ดสรุปผลความพึงพอใจการอบรม
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              เรียลไทม์
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ข้อมูลอัปเดตอัตโนมัติทันทีที่มีผู้ส่งแบบสอบถามผ่านมือถือ
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenQR}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>แสดง QR Code ขึ้นจอ</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'ย่อหน้าต่าง' : 'เต็มจอโปรเจกเตอร์'}</span>
          </button>

          {/* Quick Demo & Management Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
            >
              <span>จัดการข้อมูล</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 text-xs">
                <button
                  onClick={() => handleAddDemoResponse(1)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>จำลองการตอบ +1 คน</span>
                </button>
                <button
                  onClick={() => handleAddDemoResponse(5)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>จำลองการตอบ +5 คน</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={handleLoadSample}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                  <span>โหลดข้อมูลตัวอย่างเริ่มต้น (5 คน)</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ล้างข้อมูลทั้งหมด (เริ่มใหม่)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Strip (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">จำนวนผู้ตอบทั้งหมด</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-nums text-slate-900 dark:text-white">
                {summary.totalResponses}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">คน</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              สแกนตอบจากสมาร์ทโฟน
            </div>
          </div>
        </div>

        {/* Metric 2: Overall Mean Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">คะแนนเฉลี่ยรวม (X̄)</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-nums text-indigo-600 dark:text-indigo-400">
                {summary.overallMean > 0 ? summary.overallMean.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 5.00</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              ค่าเฉลี่ยจากคำถามทั้งหมด 5 ข้อ
            </div>
          </div>
        </div>

        {/* Metric 3: Standard Deviation (S.D.) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">ส่วนเบี่ยงเบนมาตรฐาน (S.D.)</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-nums text-slate-900 dark:text-white">
                {summary.overallSD > 0 ? summary.overallSD.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">เกณฑ์กระจาย</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              {summary.overallSD < 0.8 ? 'ความเห็นเป็นไปในทิศทางเดียวกันสูง' : 'มีความคิดเห็นที่หลากหลาย'}
            </div>
          </div>
        </div>

        {/* Metric 4: 5-Level Interpretation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">ระดับการแปลผล</span>
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className={`inline-block px-3.5 py-1.5 rounded-xl font-bold text-sm sm:text-base border ${summary.overallInterpretation.bgColor} ${summary.overallInterpretation.borderColor} ${summary.overallInterpretation.textColor}`}>
              ระดับ: {summary.overallInterpretation.label}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {summary.overallInterpretation.description}
            </p>
          </div>
        </div>

      </div>

      {/* Main Visualizations: Question Bars & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2 Cols: Question-by-Question Comparison */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                คะแนนเฉลี่ยจำแนกรายข้อ (5 ด้าน)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                เปรียบเทียบคะแนนเฉลี่ย ส่วนเบี่ยงเบนมาตรฐาน (S.D.) และระดับการแปลผล
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono-nums">
              สเกลเต็ม 5.00 คะแนน
            </span>
          </div>

          {/* Bar Cards List */}
          <div className="space-y-4">
            {summary.questions.map((q) => {
              const widthPct = Math.min(100, Math.max(0, (q.mean / 5) * 100));
              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {q.order}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {q.text}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-nums">
                        S.D. = {q.sd.toFixed(2)}
                      </span>
                      <span className="text-base font-extrabold font-mono-nums text-indigo-600 dark:text-indigo-400">
                        {q.mean.toFixed(2)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${q.interpretation.bgColor} ${q.interpretation.borderColor} ${q.interpretation.textColor}`}>
                        {q.interpretation.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Scale */}
                  <div className="relative pt-1">
                    <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-indigo-600"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    {/* Tick markers 1, 2, 3, 4, 5 */}
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-0.5 font-mono-nums">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* Breakdown pill badges */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>การกระจาย:</span>
                    {[5, 4, 3, 2, 1].map((s) => (
                      <span key={s} className="font-mono-nums">
                        {s}⭐ {q.distribution[s] || 0} คน ({q.percentages[s]}%)
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 Col: Overall Score Breakdown with Pie / Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                สัดส่วนการให้คะแนนภาพรวม
              </h2>
              {/* Chart View Toggle (Pie vs Bar) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDistChartType('pie')}
                  title="กราฟวงกลม"
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${
                    distChartType === 'pie'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>วงกลม</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDistChartType('bar')}
                  title="กราฟแท่ง"
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${
                    distChartType === 'bar'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>แท่ง</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              กระจายตามระดับ 1 ถึง 5 ดาวจากทุกข้อคำถาม
            </p>

            {distChartType === 'pie' ? (
              <PieDonutChart
                scoreBreakdown={summary.scoreBreakdown}
                scorePercentages={summary.scorePercentages}
                totalVotes={Object.values(summary.scoreBreakdown).reduce((a, b) => a + b, 0)}
                overallMean={summary.overallMean}
              />
            ) : (
              <div className="space-y-4 my-3">
                {RATING_SCALE.slice().reverse().map((scale) => {
                  const count = summary.scoreBreakdown[scale.score] || 0;
                  const pct = summary.scorePercentages[scale.score] || 0;
                  return (
                    <div key={scale.score} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                          <span className="text-sm">{scale.emoji}</span>
                          <span>{scale.score} ดาว ({scale.label})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono-nums text-slate-600 dark:text-slate-300">
                          <span className="font-bold">{count} ครั้ง</span>
                          <span className="text-slate-400">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Standard Interpretation Rubric Box */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              เกณฑ์การแปลผลคะแนนเฉลี่ย (ตามหลักวิชาการ):
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono-nums">
              <div>4.51 – 5.00: มากที่สุด</div>
              <div>3.51 – 4.50: มาก</div>
              <div>2.51 – 3.50: ปานกลาง</div>
              <div>1.51 – 2.50: น้อย</div>
              <div className="col-span-2">1.00 – 1.50: น้อยที่สุด</div>
            </div>
          </div>
        </div>

      </div>

      {/* Live Feedback Stream Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม ({summary.latestFeedback.length} ข้อความ)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            เรียงจากล่าสุด
          </span>
        </div>

        {summary.latestFeedback.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
            ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้ตอบแบบสอบถาม
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {summary.latestFeedback.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  “{fb.text}”
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-700/40 pt-2">
                  <span className="font-mono-nums flex items-center gap-1 font-semibold text-amber-500">
                    ⭐ ให้เฉลี่ย {fb.averageScore}
                  </span>
                  <span>{new Date(fb.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
