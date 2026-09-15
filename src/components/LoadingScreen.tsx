import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RadarLoading from './RadarLoading';

interface LoadingScreenProps {
  onComplete: () => void;
  isGirls?: boolean;
}

export default function LoadingScreen({ onComplete, isGirls }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('در حال برقراری ارتباط امن با پایگاه داده...');

  useEffect(() => {
    // Total duration: ~2.5 seconds (steps of ~25ms with smooth increments)
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculated = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(calculated);

      if (calculated < 25) {
        setStatusText('در حال برقراری ارتباط امن با سرور و دیتابیس ابری...');
      } else if (calculated < 50) {
        setStatusText('پایش راداری و بارگذاری پروفایل رزمندگان...');
      } else if (calculated < 75) {
        setStatusText('همگام‌سازی ماموریت‌ها، امتیازات و اطلاعات اتاق جنگ...');
      } else if (calculated < 95) {
        setStatusText('آماده‌سازی رابط کاربری و تجهیزات عملیاتی...');
      } else {
        setStatusText('ورود به عرصه نبرد اتاق جنگ...');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 dir-rtl font-sans select-none overflow-hidden touch-none ${
          isGirls ? 'bg-[#0a0212] text-fuchsia-100' : 'bg-[#020804] text-emerald-100'
        }`}
      >
        {/* Atmosphere Background Glow */}
        {isGirls ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/20 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/20 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />
          </div>
        )}

        {/* Tactical Radar Display */}
        <div className="relative z-10 flex flex-col items-center">
          <RadarLoading
            size="md"
            label="سامانه اتاق جنگ هیس‌توری"
            subLabel={statusText}
            progress={progress}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


