import React from 'react';
import { motion } from 'motion/react';
import { Gift, Trophy, Sparkles, Gem, ShoppingBag, Smartphone, Gamepad, Camera, Tablet, Award } from 'lucide-react';
import { formatToPersianDigits } from '../../utils/jalali';

interface PrizesAwardsBannerProps {
  themeMode: 'girls' | 'boys';
  onExplorePrizes?: () => void;
}

export default function PrizesAwardsBanner({
  themeMode,
  onExplorePrizes
}: PrizesAwardsBannerProps) {
  const isGirls = themeMode === 'girls';

  const prizeHighlights = [
    { title: 'کنسول بازی Xbox Series X', count: '۵۰ دستگاه', icon: Gamepad },
    { title: 'تبلت‌های هوشمند دانش‌آموزی', count: '۲۰۰ دستگاه', icon: Tablet },
    { title: 'گوشی‌های هوشمند ماجراجو', count: '۳۰۰ دستگاه', icon: Smartphone },
    { title: 'دوربین‌های عکاسی دیجیتال', count: '۱۵۰ دستگاه', icon: Camera },
  ];

  return (
    <div className="w-full space-y-3">
      
      {/* Section Header */}
      <div className="text-center sm:text-right space-y-1">
        <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
          <Trophy size={20} className={isGirls ? 'text-pink-400' : 'text-blue-400'} />
          <span>جایزه‌ها</span>
        </h3>
        <p className="text-xs text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
          <Sparkles size={13} className={isGirls ? 'text-pink-400' : 'text-red-400'} />
          <span>کریستال جمع کن و جایزه ببر</span>
        </p>
      </div>

      {/* Main Big Prizes Showcase Card */}
      <div className={`relative rounded-3xl p-5 sm:p-7 overflow-hidden border transition-all ${
        isGirls
          ? 'girls-card-surface border-fuchsia-500/50 shadow-[0_0_35px_rgba(255,19,137,0.3)]'
          : 'boys-card-surface border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.25)]'
      }`}>
        
        {/* Ambient Cosmic Background Lighting */}
        <div className={`absolute -bottom-10 -left-10 w-72 h-72 blur-[90px] rounded-full pointer-events-none ${
          isGirls ? 'bg-[#ff1389]/25' : 'bg-[#dc2626]/20'
        }`} />
        <div className={`absolute -bottom-10 -right-10 w-72 h-72 blur-[90px] rounded-full pointer-events-none ${
          isGirls ? 'bg-[#7c3aed]/25' : 'bg-[#2563eb]/25'
        }`} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column (Visual Showcase: Gadgets & Glowing Crystals) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-sm h-52 sm:h-64 flex items-center justify-center">
              
              {/* Central Glowing Shield / Crystal Art Backdrop */}
              <div className={`absolute w-44 h-44 rounded-full blur-2xl ${
                isGirls ? 'bg-[#ff1389]/30' : 'bg-gradient-to-r from-red-600/30 to-blue-600/35'
              }`} />

              {/* Realistic Gadget Collage Illustration Box */}
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                
                {/* 1. Camera Card */}
                <motion.div 
                  whileHover={{ scale: 1.08, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`w-18 sm:w-22 h-24 sm:h-28 rounded-2xl p-2 shadow-2xl flex flex-col items-center justify-center -rotate-12 translate-y-3 border relative overflow-hidden group cursor-pointer ${
                    isGirls 
                      ? 'bg-gradient-to-b from-[#2d0538] via-[#1a0224] to-[#0d0013] border-fuchsia-500/40 shadow-[0_0_20px_rgba(255,19,137,0.4)]' 
                      : 'bg-gradient-to-b from-[#0f1d3d] via-[#091129] to-[#030614] border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full border border-dashed opacity-20 pointer-events-none" />
                  <div className="relative z-10 p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 mb-1">
                    <Camera size={22} className={isGirls ? 'text-pink-300' : 'text-cyan-300'} />
                  </div>
                  <span className="relative z-10 text-[9px] font-bold text-slate-200 text-center">دوربین عکاسی</span>
                  <span className="relative z-10 text-[7px] text-amber-300 font-mono">Digital 4K</span>
                </motion.div>

                {/* 2. Main Centerpiece: Xbox / Gaming Console */}
                <motion.div 
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`w-30 sm:w-40 h-40 sm:h-48 rounded-3xl p-3 shadow-2xl flex flex-col items-center justify-center relative border-2 overflow-hidden cursor-pointer ${
                    isGirls 
                      ? 'bg-gradient-to-b from-[#3a064f] via-[#20032e] to-[#0b0010] border-fuchsia-400 shadow-[0_0_35px_rgba(255,19,137,0.7)]' 
                      : 'bg-gradient-to-b from-[#14234b] via-[#0b142d] to-[#040816] border-blue-400 shadow-[0_0_35px_rgba(37,99,235,0.7)]'
                  }`}
                >
                  <div className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b ${
                    isGirls ? 'from-fuchsia-500/30' : 'from-blue-500/30'
                  } to-transparent pointer-events-none`} />

                  <div className="absolute -top-1 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-white/40">
                    <Trophy size={16} />
                  </div>

                  <div className="relative mt-3 p-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-inner">
                    <Gamepad size={34} className={isGirls ? 'text-pink-300 animate-pulse' : 'text-cyan-300 animate-pulse'} />
                  </div>

                  <span className="text-[11px] sm:text-xs font-black text-white mt-2 text-center drop-shadow-md">Xbox Series X</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-300 font-bold font-mono mt-0.5 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                    ۵۰ میلیارد ریال
                  </span>
                </motion.div>

                {/* 3. Tablet / Smartphone Card */}
                <motion.div 
                  whileHover={{ scale: 1.08, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`w-18 sm:w-22 h-26 sm:h-30 rounded-2xl p-2 shadow-2xl flex flex-col items-center justify-center rotate-12 translate-y-1 border relative overflow-hidden group cursor-pointer ${
                    isGirls 
                      ? 'bg-gradient-to-b from-[#2d0538] via-[#1a0224] to-[#0d0013] border-fuchsia-500/40 shadow-[0_0_20px_rgba(255,19,137,0.4)]' 
                      : 'bg-gradient-to-b from-[#0f1d3d] via-[#091129] to-[#030614] border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />
                  <div className="relative z-10 p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 mb-1">
                    <Smartphone size={22} className="text-amber-300" />
                  </div>
                  <span className="relative z-10 text-[9px] font-bold text-slate-200 text-center">گوشی و تبلت</span>
                  <span className="relative z-10 text-[7px] text-cyan-300 font-mono">Smart Pad</span>
                </motion.div>

              </div>

              {/* Floating Glowing Crystals Particles */}
              <motion.div 
                animate={{ y: [-4, 4, -4] }} 
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-4"
              >
                <div className="p-1.5 rounded-xl bg-pink-500/20 border border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                  <Gem size={16} />
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [4, -4, 4] }} 
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-3 left-4"
              >
                <div className="p-1.5 rounded-xl bg-blue-500/20 border border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(37,99,235,0.8)]">
                  <Gem size={18} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column (Text & Value Badges) */}
          <div className="lg:col-span-6 space-y-4 text-right">
            
            {/* Grand Prize Statement 1 */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-sm">
                <Award size={14} className="text-amber-400" />
                <span>جوایز کشوری و استانی</span>
              </div>
              <h4 className="text-base sm:text-xl font-black text-white leading-snug">
                {formatToPersianDigits(2000)} جایزه برای نفرات برتر کشور و استان، به ارزش{' '}
                <span className="text-amber-300 font-mono">{formatToPersianDigits(50)} میلیارد ریال</span>
              </h4>
            </div>

            {/* Shopping Discount Code Statement 2 */}
            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              isGirls 
                ? 'bg-[#1b0324]/80 border-fuchsia-900/50' 
                : 'bg-[#091126]/80 border-blue-900/50'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-black ${
                isGirls ? 'text-pink-300' : 'text-blue-300'
              }`}>
                <ShoppingBag size={15} className={isGirls ? 'text-pink-400' : 'text-blue-400'} />
                <span>{formatToPersianDigits(100)} هزار کد تخفیف فروشگاهی</span>
              </div>
              <p className="text-[11px] text-slate-300">
                برای کلیه ماجراجوها و رزمندگانی که مراحل را تکمیل نموده و کریستال‌های مسابقه را ذخیره نمایند.
              </p>
            </div>

            {/* Prize mini tags */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {prizeHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-[10px] border transition-colors ${
                      isGirls 
                        ? 'bg-[#150220]/70 border-fuchsia-900/40 hover:border-pink-500/50' 
                        : 'bg-[#060c1d]/70 border-blue-900/40 hover:border-blue-500/50'
                    }`}
                  >
                    <Icon size={14} className={isGirls ? 'text-pink-400' : 'text-blue-400'} />
                    <div className="text-right">
                      <span className="text-white font-bold block">{item.title}</span>
                      <span className="text-slate-400 font-mono">{item.count}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
