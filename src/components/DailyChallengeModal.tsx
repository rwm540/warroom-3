import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Award, 
  HelpCircle, 
  Sparkles,
  ArrowLeft,
  Share2,
  Calendar
} from 'lucide-react';
import { formatToPersianDigits } from '../utils/jalali';
import { playTacticalSound } from '../utils/epicBgmEngine';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAlert: (msg: string) => void;
  onAwardPoints?: (points: number) => void;
}

export default function DailyChallengeModal({
  isOpen,
  onClose,
  triggerAlert,
  onAwardPoints
}: DailyChallengeModalProps) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `warroom_daily_challenge_${todayKey}`;

  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('warroom_daily_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Notify global app layout to hide bottom navigation menu while modal is open
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: true } }));
      return () => {
        window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: false } }));
      };
    }
  }, [isOpen]);

  // Daily Challenge Question Data
  const dailyQuestion = {
    title: 'رمزگشایی مختصات دیده‌بانی شبانه',
    badge: 'چالش عملیاتی روز',
    points: 150,
    scenario: 'دیده‌بانان قرارگاه در شیار کوهستانی با استراق سمع امواج رادیویی دشمن متوجه تغییر الگوی گشت شبانه شده‌اند. برای عبور بدون تلفات ستون رزمندگان از کمینگاه دشمن، کارآمدترین تدبیر تاکتیکی چیست؟',
    options: [
      { id: 1, text: 'استفاده از منورهای هوایی و شلیک مستقیم به سمت کمینگاه جهت ایجاد وحشت' },
      { id: 2, text: 'سکوت کامل رادیویی، استفاده از شیارها و پستی‌بلندی‌ها در فواصل خاموشی منورهای دشمن', correct: true },
      { id: 3, text: 'حرکت با حداکثر سرعت در جاده اصلی برای خروج سریع‌تر از منطقه خطر' },
      { id: 4, text: 'توقف کامل عملیات و عقب‌نشینی به پایگاه اولیه بدون هماهنگی با قرارگاه مرکزی' }
    ],
    explanation: 'استفاده از پوشش طبیعی زمین، شیارها و سکوت مطلق رادیویی همزمان با حرکت در تاریکی میان شلیک منورها، اصل بنیادین غافلگیری در عملیات‌های چریکی و شبانه است.'
  };

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${formatToPersianDigits(pad(hours))}:${formatToPersianDigits(pad(minutes))}:${formatToPersianDigits(pad(seconds))}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      triggerAlert('لطفاً یکی از گزینه‌ها را انتخاب کنید.');
      return;
    }

    const option = dailyQuestion.options.find(o => o.id === selectedOption);
    const correct = !!option?.correct;

    setHasSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      playTacticalSound('win');
      setIsCompletedToday(true);
      localStorage.setItem(storageKey, 'true');

      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      localStorage.setItem('warroom_daily_streak', newStreak.toString());

      if (onAwardPoints) {
        onAwardPoints(dailyQuestion.points);
      }
      triggerAlert(`آفرین رزمنده! پاسخ صحیح بود. +${formatToPersianDigits(dailyQuestion.points)} امتیاز به کارنامه شما اضافه گردید.`);
    } else {
      playTacticalSound('click');
      triggerAlert('پاسخ نادرست است. راهنمایی را مطالعه نموده و مجدداً تلاش نمایید.');
    }
  };

  const handleResetForRetry = () => {
    setHasSubmitted(false);
    setSelectedOption(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-[#070d1e] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-white text-right dir-rtl overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-28 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  چالش و معمای روزانه
                </h3>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  {dailyQuestion.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                فرصت ویژه افزایش امتیاز و ثبت زنجیره افتخار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats strip: Countdown timer & Streak */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="bg-slate-900/80 border border-slate-800/90 p-2.5 rounded-2xl flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock size={13} className="text-amber-400" />
              مهلت تا چالش فردا:
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {timeLeft}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/90 p-2.5 rounded-2xl flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Flame size={13} className="text-rose-400" />
              زنجیره متوالی:
            </span>
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
              <span>{formatToPersianDigits(streakCount)}</span>
              <span>روز</span>
              <span>🔥</span>
            </span>
          </div>
        </div>

        {/* Main Content Body */}
        {isCompletedToday ? (
          /* COMPLETED STATE */
          <div className="py-4 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-emerald-400">
                چالش امروز با پیروزی تکمیل شد!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                امتیاز <strong className="text-amber-300 font-mono">+{formatToPersianDigits(dailyQuestion.points)}</strong> به حساب شما واریز شد و زنجیره رزمندگی شما تداوم یافت.
              </p>
            </div>

            {/* Explanation box */}
            <div className="bg-slate-900/80 border border-emerald-500/30 p-3.5 rounded-2xl text-right text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">
                نکته آموزنده تاکتیکی امروز:
              </span>
              <p>{dailyQuestion.explanation}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-2xl transition shadow-lg"
              >
                بازگشت به نقشه مراحل بازی
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION FORM */
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-slate-900/60 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs sm:text-sm text-amber-300">
                  {dailyQuestion.title}
                </h4>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-mono">
                  +{formatToPersianDigits(dailyQuestion.points)} امتیاز
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {dailyQuestion.scenario}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {dailyQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOption = opt.correct;
                let optionStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700';

                if (hasSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-amber-500/15 border-amber-500/80 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !hasSubmitted && setSelectedOption(opt.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 cursor-pointer select-none text-xs leading-relaxed ${optionStyle}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 border ${
                      isSelected ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold' : 'border-slate-700 text-slate-400'
                    }`}>
                      {formatToPersianDigits(idx + 1)}
                    </div>
                    <span className="flex-1">{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Error Message & Retry */}
            {hasSubmitted && !isCorrect && (
              <div className="bg-rose-950/60 border border-rose-800/80 p-3 rounded-2xl text-xs text-rose-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={15} />
                  <span>پاسخ شما نادرست بود!</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  نگران نباشید، می‌توانید دوباره متن معما را بررسی کرده و گزینه دیگری را انتخاب فرمایید.
                </p>
                <button
                  onClick={handleResetForRetry}
                  className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition"
                >
                  تلاش مجدد
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`w-full py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                  selectedOption !== null
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap size={16} />
                <span>ثبت پاسخ نهایی و دریافت {formatToPersianDigits(dailyQuestion.points)} امتیاز</span>
              </button>
            ) : null}
          </div>
        )}
      </motion.div>
    </div>
  );
}
