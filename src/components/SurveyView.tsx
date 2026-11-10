import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVALUATION_QUESTIONS, RATING_SCALE } from '../data/questions';
import { realtimeSync } from '../services/realtimeSync';
import { CheckCircle2, ShieldCheck, AlertCircle, RotateCcw, Send, Sparkles } from 'lucide-react';

interface SurveyViewProps {
  onSuccessSubmit?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSuccessSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    setHasSubmitted(realtimeSync.hasDeviceSubmitted());
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    if (errorMessage) setErrorMessage(null);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / EVALUATION_QUESTIONS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all 5 questions
    const unanswered = EVALUATION_QUESTIONS.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบแบบประเมินให้ครบทั้ง 5 ข้อ (เหลืออีก ${unanswered.length} ข้อ)`);
      // Scroll to first unanswered
      const el = document.getElementById(`card-${unanswered[0].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await realtimeSync.submitResponse({
        answers,
        feedback: feedback.trim() || undefined,
        deviceId: 'device-' + Math.random().toString(36).substring(2, 9)
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setShowCelebration(true);
      setHasSubmitted(true);
      if (onSuccessSubmit) onSuccessSubmit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลได้';
      setErrorMessage('เกิดข้อผิดพลาด: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    realtimeSync.clearDeviceSubmission();
    setHasSubmitted(false);
    setShowCelebration(false);
    setAnswers({});
    setFeedback('');
    setErrorMessage(null);
  };

  // View when user already submitted
  if (hasSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            บันทึกแบบประเมินเรียบร้อยแล้ว
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            ขอบพระคุณสำหรับเวลาและความคิดเห็นอันมีค่ายิ่ง ข้อมูลของท่านได้ถูกส่งไปยังหน้าจอประมวลผลของผู้จัดอบรมเรียบร้อยแล้ว
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 text-left space-y-2 mb-6">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ระบบป้องกันการตอบซ้ำ (Device Lock)</span>
            </div>
            <p className="leading-relaxed">
              เครื่องนี้ได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว ระบบจะไม่อนุญาตให้ส่งซ้ำเพื่อรักษาความถูกต้องของผลประเมิน
            </p>
          </div>

          <button
            onClick={handleResetForTesting}
            className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-2 px-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ทำแบบประเมินใหม่อีกครั้ง (สำหรับการทดสอบระบบ)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 sm:py-6 space-y-5">
      
      {/* Intro Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>แบบประเมินความพึงพอใจการอบรม</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ไม่ระบุตัวตน</span>
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          โครงการฝึกอบรมเพื่อพัฒนาทักษะการทำงาน
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          โปรดเลือกคะแนนตามความคิดเห็นจริงของท่านตั้งแต่ 1 (น้อยที่สุด) ถึง 5 (มากที่สุด) เพื่อนำผลไปพัฒนาหลักสูตรในอนาคต
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-300">
              ความคืบหน้า: ตอบแล้ว {answeredCount} จาก {EVALUATION_QUESTIONS.length} ข้อ
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-num">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {EVALUATION_QUESTIONS.map((question) => {
          const selectedScore = answers[question.id];
          return (
            <div
              key={question.id}
              id={`card-${question.id}`}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-xs ${
                selectedScore
                  ? 'border-indigo-200 dark:border-indigo-900/50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-4">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {question.order}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {question.text}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {question.category}
                  </span>
                </div>
              </div>

              {/* Rating Scale Buttons (1 to 5) - Large touch targets */}
              <div className="grid grid-cols-5 gap-2">
                {RATING_SCALE.map((scale) => {
                  const isSelected = selectedScore === scale.score;
                  return (
                    <button
                      key={scale.score}
                      type="button"
                      onClick={() => handleSelectScore(question.id, scale.score)}
                      className={`min-h-[58px] sm:min-h-[64px] rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all active:scale-95 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg leading-none mb-1">{scale.emoji}</span>
                      <span className="text-sm font-bold font-num leading-none">{scale.score}</span>
                      <span className={`text-[10px] mt-1 leading-none truncate max-w-full ${
                        isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {scale.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Feedback Section (Optional) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <label htmlFor="feedback-text" className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">
            ข้อเสนอแนะและข้อคิดเห็นเพิ่มเติม (ไม่บังคับ)
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            สิ่งที่ท่านประทับใจ หรือสิ่งที่ต้องการให้ปรับปรุงสำหรับจัดอบรมในครั้งถัดไป
          </p>
          <textarea
            id="feedback-text"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."
            className="w-full p-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none transition-all"
          />
          <div className="text-right text-[11px] text-slate-400 mt-1">
            {feedback.length} ตัวอักษร
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] ${
            answeredCount === EVALUATION_QUESTIONS.length
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 cursor-pointer'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span>กำลังส่งแบบประเมิน...</span>
          ) : (
            <>
              <span>ส่งแบบประเมินความพึงพอใจ</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          เมื่อกดส่ง ข้อมูลจะอัปเดตไปยังหน้าจอประมวลผลของผู้จัดแบบเรียลไทม์ทันที
        </p>
      </form>
    </div>
  );
};
