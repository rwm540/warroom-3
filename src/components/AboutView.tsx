import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Target, 
  Users, 
  Award, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Flag, 
  Sparkles,
  Trophy,
  Brain,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (tab: string) => void;
  siteSettings?: any;
  homeStats?: any;
}

export default function AboutView({ onNavigate, siteSettings, homeStats }: AboutViewProps) {
  const stats = [
    { label: 'رزمندگان و شرکت‌کنندگان', value: homeStats ? `+${Number(homeStats.activeParticipants).toLocaleString('fa-IR')}` : '+۱۰,۰۰۰', icon: Users, color: 'text-cyan-400' },
    { label: 'بازی‌ها و رویدادهای فعال', value: homeStats ? `${Number(homeStats.activeMissions).toLocaleString('fa-IR')} بازی` : '۱۲ بازی', icon: Target, color: 'text-amber-400' },
    { label: 'جوخه‌ها و گروه‌های دانش‌آموزی', value: homeStats ? `+${Number(homeStats.activeGroups).toLocaleString('fa-IR')} گروه` : '+۵۰۰ گروه', icon: ShieldAlert, color: 'text-red-400' },
    { label: 'مأموریت‌های تکمیل‌شده', value: '+۲۵,۰۰۰', icon: Trophy, color: 'text-emerald-400' },
  ];

  const features = [
    {
      title: 'شبیه‌سازی اتاق جنگ استراتژیک',
      desc: 'پلتفرم جامع شبیه‌سازی تصمیم‌گیری‌های پیچیده و رقابت‌های سناریومحور برای تقویت تفکر تحلیلی و حل مسئله.',
      icon: Brain,
      border: 'border-red-500/30',
      bg: 'bg-red-950/20'
    },
    {
      title: 'مدیریت و همکاری جوخه‌ای',
      desc: 'امکان تشکیل گروه‌ها، تعیین سرگروه و اعضا، تخصیص نقش‌های عملیاتی و همکاری تیمی در اجرای سناریوها.',
      icon: Users,
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20'
    },
    {
      title: 'داوری آنلاین و جدول رده‌بندی هوشمند',
      desc: 'ارزیابی دقیق پاسخ‌ها توسط ستاد داوری، ثبت امتیازات عملیاتی و به‌روزرسانی لحظه‌ای جدول برترین‌ها.',
      icon: Trophy,
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20'
    },
    {
      title: 'نقشه راه و کارگاه‌های آموزشی',
      desc: 'محتوای آموزشی چندرسانه‌ای، راهنمای گام‌به‌گام مراحل و اعطای مدال‌های افتخار اختصاصی به برندگان.',
      icon: Compass,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    }
  ];

  const values = [
    'تقویت روحیه کار گروهی و مسئولیت‌پذیری اجتماعی',
    'ارتقای مهارت تحلیل سیاسی، اجتماعی و استراتژیک',
    'ایجاد محیط رقابتی سالم و انگیزشی برای جوانان و نوجوانان',
    'شفافیت کامل در داوری و اعطای امتیازات مأموریت‌ها'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 dir-rtl pb-16 max-w-6xl mx-auto px-2 md:px-4"
    >
      {/* Navigation Header Bar */}
      <div className="flex items-center justify-between bg-[#080d22]/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">درباره ما و پروژه اتاق جنگ</h2>
            <p className="text-[11px] text-amber-300/80 font-bold">معرفی اهداف، چشم‌انداز و دستاوردهای سامانه</p>
          </div>
        </div>
      </div>
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0f26] via-[#0d163a] to-[#121c48] border border-cyan-500/30 p-6 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles size={14} className="animate-spin text-cyan-400" />
            <span>سامانه جامع بازی‌های استراتژیک و اتاق جنگ</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            درباره <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-red-400">پروژه اتاق جنگ استراتژیک</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {siteSettings?.aboutText || 'پلتفرم اتاق جنگ یک سامانه تعاملی، رقابتی و آموزشی است که با هدف پرورش تفکر استراتژیک، افزایش توان تحلیل مسئله و تقویت روحیه کار تیمی در میان نوجوانان و جوانان طراحی شده است. در این سامانه، کاربران در قالب جوخه‌های عملیاتی وارد سناریوهای واقعی و شبیه‌سازی‌شده می‌شوند.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('PortalSelector')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center gap-2"
              >
                <Rocket size={16} />
                <span>ورود به سامانه انتخاب بازی</span>
              </button>
            )}

            {onNavigate && (
              <button
                onClick={() => onNavigate('Support')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-2"
              >
                <span>ارتباط با ما و پشتیبانی</span>
                <ArrowRight size={14} className="rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div 
              key={idx}
              className="bg-[#080d22] border border-cyan-500/20 rounded-2xl p-4 text-right space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xl md:text-2xl font-black font-mono ${s.color}`}>
                  {s.value}
                </span>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <Icon size={18} className={s.color} />
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Core Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#080d22] border border-red-500/30 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 w-fit">
            <Flag size={24} />
          </div>
          <h3 className="text-lg font-black text-white">مأموریت و رسالت پروژه</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ارتقای سطح آگاهی، قدرت سناریونویسی و مهارت‌های حل مسئله در مواجهه با چالش‌های پیچیده دنیای امروز. ما بر این باوریم که با شبیه‌سازی چالش‌های واقعی در بستر بازی و رقابت، می‌توان استعدادهای برتر مدیریت و تفکر استراتژیک را شناسایی و پرورش داد.
          </p>
        </div>

        <div className="bg-[#080d22] border border-amber-500/30 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 w-fit">
            <Target size={24} />
          </div>
          <h3 className="text-lg font-black text-white">چشم‌انداز آینده</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            تبدیل شدن به برترین پلتفرم بازی‌های استراتژیک دانش‌آموزی و دانشجویی در کشور، ایجاد شبکه علمی و عملیاتی مربیان و داوران باتجربه، و گسترش بازی‌های بومی در سطح ملی و بین‌المللی.
          </p>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="space-y-4">
        <div className="text-right space-y-1">
          <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
            <Zap className="text-cyan-400" size={20} />
            قابلیت‌ها و امکانات برجسته سامانه
          </h3>
          <p className="text-xs text-slate-400">
            امکانات منحصربه‌فرد برای شرکت‌کنندگان، سرگروه‌ها و داوران ستاد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className={`bg-[#080d22] border ${feat.border} rounded-2xl p-5 space-y-2.5 transition hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${feat.bg} border ${feat.border} text-white`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-white">{feat.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pr-1">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Values */}
      <div className="bg-[#080d22] border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" size={20} />
          ارزش‌ها و اصول کلیدی پروژه
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {values.map((val, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
