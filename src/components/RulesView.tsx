import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Home, 
  Lock,
  Flame,
  Award
} from 'lucide-react';

interface RulesViewProps {
  onNavigate?: (tab: string) => void;
  siteSettings?: any;
}

export default function RulesView({ onNavigate }: RulesViewProps) {
  const ruleCategories = [
    {
      title: '۱. قوانین عمومی و شرایط ثبت‌نام',
      icon: Users,
      color: 'text-cyan-300',
      border: 'border-cyan-500',
      bg: 'bg-cyan-950',
      items: [
        'کلیه شرکت‌کنندگان ملزم به ثبت اطلاعات واقعی، کدملی و مشخصات هویتی صحیح در هنگام ثبت‌نام می‌باشند.',
        'هر کاربر مجاز به عضویت در یک جوخه عملیاتی در طول هر دوره از مسابقات است.',
        'مسئولیت حفظ محرمانگی نام کاربری و کلمه عبور بر عهده شخص کاربر می‌باشد.'
      ]
    },
    {
      title: '۲. قوانین جوخه‌ها و کار تیمی',
      icon: ShieldCheck,
      color: 'text-amber-300',
      border: 'border-amber-500',
      bg: 'bg-amber-950',
      items: [
        'تعداد اعضای هر جوخه طبق ضوابط بازی بین ۳ تا ۵ نفر تعیین می‌شود.',
        'سرگروه جوخه مسئولیت هماهنگی، ارسال پاسخ‌های نهایی مأموریت و مکاتبات با ستاد داوری را بر عهده دارد.',
        'خروج یا جابجایی اعضا در حین اجرای بازی تنها با تایید ستاد پشتیبانی امکان‌پذیر است.'
      ]
    },
    {
      title: '۳. قوانین ارسال پاسخ‌ها و مهلت مأموریت‌ها',
      icon: Clock,
      color: 'text-emerald-300',
      border: 'border-emerald-500',
      bg: 'bg-emerald-950',
      items: [
        'تمامی پاسخ‌ها و سناریوها باید پیش از اتمام تایمر معکوس هر مرحله در سامانه ثبت شوند.',
        'پاسخ‌های ارسالی پس از اتمام زمان مهلت به عنوان تأخیری ثبت شده و شامل کسر امتیاز خواهند بود.',
        'فرمت فایل‌های ارسالی باید مطابق دستورالعمل مشخص‌شده در مأموریت (PDF، صوت، ویدیو یا متن) باشد.'
      ]
    },
    {
      title: '۴. ضوابط داوری، امتیازدهی و اعتراضات',
      icon: Scale,
      color: 'text-purple-300',
      border: 'border-purple-500',
      bg: 'bg-purple-950',
      items: [
        'ارزیابی و نمره‌دهی پاسخ‌ها بر اساس سنجه‌های تحلیلی، خلاقیت، استدلال منطقی و سرعت عمل انجام می‌شود.',
        'در صورت وجود هرگونه ابهام، کاربران می‌توانند ظرف مدت ۲۴ ساعت پس از اعلام نتایج از طریق تیکت پشتیبانی اعتراض خود را ثبت نمایند.',
        'آرای هیئت داوران ستاد پس از بازبینی نهایی قطعی و لازم‌الاجرا خواهد بود.'
      ]
    },
    {
      title: '۵. اصول اخلاق حرفه‌ای و امنیت اطلاعات',
      icon: Lock,
      color: 'text-red-300',
      border: 'border-red-500',
      bg: 'bg-red-950',
      items: [
        'هرگونه کپی‌برداری غیرمجاز یا تبادل پاسخ میان جوخه‌های مختلف منجر به کسر امتیاز یا حذف خواهد شد.',
        'رعایت ادب و احترام به سایر رقبا و داوران در بخش پیام‌ها و تیکت‌ها الزامی است.',
        'استفاده از روش‌های نامتعارف و دستکاری در داده‌های سامانه به منزله تخلف انضباطی تلقی می‌گردد.'
      ]
    },
    {
      title: '۶. جوایز و اهدای نشان‌های افتخار',
      icon: Trophy,
      color: 'text-yellow-300',
      border: 'border-yellow-500',
      bg: 'bg-yellow-950',
      items: [
        'نشان‌های افتخار و مدال‌های مأموریت به برترین جوخه‌ها و رزمندگان اهدا خواهد شد.',
        'جوایز نقدی و لوح‌های تقدیر در مراسم اختتامیه رسمی ستاد تقدیم نفرات برتر می‌گردد.'
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8 dir-rtl pb-16 max-w-6xl mx-auto px-2 md:px-4 text-slate-100"
    >
      {/* Top Header Navigation Bar with Clear Back Button - SOLID BLACK OPAQUE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080d1a] border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">قوانین و مقررات رسمی سامانه</h1>
            <p className="text-xs text-emerald-200 font-bold mt-0.5">ضوابط برگزاری رویدادها، داوری مأموریت‌ها و آیین‌نامه انضباطی اتاق جنگ</p>
          </div>
        </div>

        {/* Clear Return to Home Button */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            className="self-stretch sm:self-auto px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-emerald-300 border border-emerald-500 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Home size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black">بازگشت به صفحه اصلی</span>
            <ArrowRight size={14} className="text-emerald-400 rotate-180" />
          </button>
        )}
      </div>

      {/* Rules Notice Banner - SOLID OPAQUE */}
      <div className="bg-[#080d1a] border-2 border-cyan-500 rounded-3xl p-6 md:p-8 space-y-3 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-base sm:text-lg font-black text-white">منشور اخلاقی و انضباطی مسابقات</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-bold">
          تمامی شرکت‌کنندگان، مربیان و سرگروه‌ها با عضویت و حضور در سامانه متعهد به رعایت کامل مفاد این آیین‌نامه می‌باشند. هدف ما ایجاد بستری عادلانه، پویا، آموزشی و شفاف برای شکوفایی خلاقیت‌ها و ارتقای مهارت‌های استراتژیک نوجوانان و جوانان عزیز کشورمان است.
        </p>
      </div>

      {/* Categorized Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ruleCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div 
              key={idx}
              className={`bg-[#080d1a] border-2 ${cat.border} rounded-3xl p-6 space-y-4 shadow-2xl transition`}
            >
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <div className={`p-3 rounded-2xl ${cat.bg} border ${cat.border} ${cat.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">{cat.title}</h3>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2.5 text-xs text-slate-100 font-bold leading-relaxed">
                    <CheckCircle2 size={16} className={`${cat.color} shrink-0 mt-0.5`} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card - SOLID BLACK */}
      <div className="bg-[#080d1a] border-2 border-slate-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-right">
          <h3 className="text-sm font-black text-white">سوالی درباره قوانین و ضوابط دارید؟</h3>
          <p className="text-xs text-slate-200 font-bold">می‌توانید با بخش پشتیبانی ستاد تماس حاصل فرمایید یا تیکت ارسال کنید.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('Support')}
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>ارسال تیکت به ستاد</span>
              <ArrowRight size={14} className="rotate-180" />
            </button>
          )}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('Home')}
              className="px-5 py-2.5 rounded-xl bg-[#000000] hover:bg-slate-900 text-white border-2 border-slate-700 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Home size={14} className="text-cyan-400" />
              <span>صفحه اصلی</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
