import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Target, 
  Users, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Flag, 
  Sparkles,
  Trophy,
  Brain,
  Rocket,
  ArrowRight,
  Home,
  Info
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (tab: string) => void;
  siteSettings?: any;
  homeStats?: any;
}

export default function AboutView({ onNavigate, siteSettings, homeStats }: AboutViewProps) {
  const stats = [
    { label: 'رزمندگان و شرکت‌کنندگان', value: homeStats ? `+${Number(homeStats.activeParticipants).toLocaleString('fa-IR')}` : '+۱۰,۰۰۰', icon: Users, color: 'text-cyan-300' },
    { label: 'بازی‌ها و رویدادهای فعال', value: homeStats ? `${Number(homeStats.activeMissions).toLocaleString('fa-IR')} بازی` : '۱۲ بازی', icon: Target, color: 'text-amber-300' },
    { label: 'جوخه‌ها و گروه‌های دانش‌آموزی', value: homeStats ? `+${Number(homeStats.activeGroups).toLocaleString('fa-IR')} گروه` : '+۵۰۰ گروه', icon: ShieldAlert, color: 'text-red-300' },
    { label: 'مأموریت‌های تکمیل‌شده', value: '+۲۵,۰۰۰', icon: Trophy, color: 'text-emerald-300' },
  ];

  const features = [
    {
      title: 'شبیه‌سازی اتاق جنگ استراتژیک',
      desc: 'پلتفرم جامع شبیه‌سازی تصمیم‌گیری‌های پیچیده و رقابت‌های سناریومحور برای تقویت تفکر تحلیلی و حل مسئله.',
      icon: Brain,
      border: 'border-red-500',
      bg: 'bg-red-950'
    },
    {
      title: 'مدیریت و همکاری جوخه‌ای',
      desc: 'امکان تشکیل گروه‌ها، تعیین سرگروه و اعضا، تخصیص نقش‌های عملیاتی و همکاری تیمی در اجرای سناریوها.',
      icon: Users,
      border: 'border-cyan-500',
      bg: 'bg-cyan-950'
    },
    {
      title: 'داوری آنلاین و جدول رده‌بندی هوشمند',
      desc: 'ارزیابی دقیق پاسخ‌ها توسط ستاد داوری، ثبت امتیازات عملیاتی و به‌روزرسانی لحظه‌ای جدول برترین‌ها.',
      icon: Trophy,
      border: 'border-amber-500',
      bg: 'bg-amber-950'
    },
    {
      title: 'نقشه راه و کارگاه‌های آموزشی',
      desc: 'محتوای آموزشی چندرسانه‌ای، راهنمای گام‌به‌گام مراحل و اعطای مدال‌های افتخار اختصاصی به برندگان.',
      icon: Compass,
      border: 'border-emerald-500',
      bg: 'bg-emerald-950'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8 dir-rtl pb-16 max-w-6xl mx-auto px-2 md:px-4 text-slate-100"
    >
      {/* Navigation Header Bar with Clear Back Button - SOLID BLACK OPAQUE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080d1a] border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-950 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Info size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">درباره ما و پروژه اتاق جنگ</h1>
            <p className="text-xs text-amber-200 font-bold mt-0.5">معرفی اهداف، چشم‌انداز، رسالت و دستاوردهای سامانه</p>
          </div>
        </div>

        {/* Clear Return to Home Button */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            className="self-stretch sm:self-auto px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-amber-300 border border-amber-500 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Home size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black">بازگشت به صفحه اصلی</span>
            <ArrowRight size={14} className="text-amber-400 rotate-180" />
          </button>
        )}
      </div>
      
      {/* Hero Banner - SOLID OPAQUE */}
      <div className="relative overflow-hidden rounded-3xl bg-[#080d1a] border-2 border-cyan-500 p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-black shadow-md">
            <Sparkles size={14} className="animate-spin text-cyan-300" />
            <span>سامانه جامع بازی‌های استراتژیک و شبیه‌سازی اتاق جنگ</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            درباره <span className="text-cyan-300">پروژه اتاق جنگ استراتژیک</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-bold">
            {siteSettings?.aboutText || 'پلتفرم اتاق جنگ یک سامانه تعاملی، رقابتی و آموزشی است که با هدف پرورش تفکر استراتژیک، افزایش توان تحلیل مسئله و تقویت روحیه کار تیمی در میان نوجوانان و جوانان طراحی شده است. در این سامانه، کاربران در قالب جوخه‌های عملیاتی وارد سناریوهای واقعی و شبیه‌سازی‌شده می‌شوند.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('PortalSelector')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Rocket size={16} />
                <span>ورود به سامانه انتخاب بازی</span>
              </button>
            )}

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('Support')}
                className="px-5 py-2.5 rounded-xl bg-[#000000] hover:bg-slate-900 text-white border-2 border-slate-700 hover:border-cyan-400 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <span>ارتباط با ما و پشتیبانی</span>
                <ArrowRight size={14} className="rotate-180 text-cyan-400" />
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
              className="bg-[#080d1a] border-2 border-slate-700 rounded-2xl p-4 text-right space-y-2 relative overflow-hidden group hover:border-cyan-400 transition shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xl md:text-2xl font-black font-mono ${s.color}`}>
                  {s.value}
                </span>
                <div className="p-2 rounded-xl bg-black border border-slate-800">
                  <Icon size={18} className={s.color} />
                </div>
              </div>
              <p className="text-xs font-black text-slate-100">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Core Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#080d1a] border-2 border-red-500 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-2xl">
          <div className="p-3 rounded-2xl bg-red-950 border border-red-400 text-red-300 w-fit">
            <Flag size={24} />
          </div>
          <h3 className="text-lg font-black text-white">مأموریت و رسالت پروژه</h3>
          <p className="text-xs text-slate-100 leading-relaxed font-bold">
            ارتقای سطح آگاهی، قدرت سناریونویسی و مهارت‌های حل مسئله در مواجهه با چالش‌های پیچیده دنیای امروز. ما بر این باوریم که با شبیه‌سازی چالش‌های واقعی در بستر بازی و رقابت، می‌توان استعدادهای برتر مدیریت و تفکر استراتژیک را شناسایی و پرورش داد.
          </p>
        </div>

        <div className="bg-[#080d1a] border-2 border-amber-500 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-2xl">
          <div className="p-3 rounded-2xl bg-amber-950 border border-amber-400 text-amber-300 w-fit">
            <Target size={24} />
          </div>
          <h3 className="text-lg font-black text-white">چشم‌انداز آینده</h3>
          <p className="text-xs text-slate-100 leading-relaxed font-bold">
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
          <p className="text-xs text-slate-200 font-bold">
            امکانات منحصربه‌فرد برای شرکت‌کنندگان، سرگروه‌ها و داوران ستاد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className={`bg-[#080d1a] border-2 ${feat.border} rounded-2xl p-5 space-y-2.5 transition hover:scale-[1.01] shadow-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${feat.bg} border border-slate-700 text-white`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-white">{feat.title}</h4>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed pr-1 font-bold">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Values */}
      <div className="bg-[#080d1a] border-2 border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" size={20} />
          ارزش‌ها و اصول کلیدی پروژه
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {values.map((val, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#000000] border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

