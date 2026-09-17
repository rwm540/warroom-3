import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Headphones, 
  Home, 
  ArrowRight,
  Sparkles,
  Share2,
  HelpCircle,
  MessageCircle,
  Building2,
  ChevronDown,
  Tag,
  User as UserIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { User, SupportTicket, TicketType } from '../types';
import { createSupportTicketInSupabase } from '../lib/supabaseData';

interface ContactViewProps {
  currentUser?: User | null;
  tickets?: SupportTicket[];
  setTickets?: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  onNavigate?: (tab: string) => void;
  triggerAlert?: (msg: string) => void;
  siteSettings?: any;
}

export default function ContactView({ 
  currentUser,
  tickets = [],
  setTickets,
  onNavigate, 
  triggerAlert, 
  siteSettings 
}: ContactViewProps) {
  const [fullName, setFullName] = useState(
    currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : ''
  );
  const [contactInfo, setContactInfo] = useState(
    currentUser?.phone || currentUser?.personal_code || ''
  );
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'technical' | 'content' | 'judge' | 'other'>('technical');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!fullName) {
        setFullName(`${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim());
      }
      if (!contactInfo) {
        setContactInfo(currentUser.phone || currentUser.personal_code || '');
      }
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactInfo.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const fullDateTimeStr = `${dateFormatted} - ${timeFormatted}`;

    const newTicketId = `tick-${Date.now().toString().slice(-6)}`;
    const newTicket: SupportTicket = {
      id: newTicketId,
      user_id: currentUser?.id || `guest-${Date.now().toString().slice(-6)}`,
      user_name: fullName.trim(),
      personal_code: currentUser?.personal_code || contactInfo.trim(),
      subject: subject.trim() || `تیکت پشتیبانی: ${getCategoryTitle(category)}`,
      message: message.trim(),
      type: category as TicketType,
      status: 'open',
      priority: 'normal',
      created_at: fullDateTimeStr,
      updated_at: fullDateTimeStr
    };

    // 1. Save directly to Supabase
    try {
      await createSupportTicketInSupabase(newTicket);
    } catch (err) {
      console.warn('Supabase ticket create warning:', err);
    }

    // 2. Update local state for immediate UI feedback across app & admin panel
    if (setTickets) {
      setTickets(prev => [newTicket, ...(prev || [])]);
    }

    setSubmittedTicket(newTicket);
    setIsSubmitting(false);

    if (triggerAlert) {
      triggerAlert(`تیکت پشتیبانی با شناسه ${newTicket.id} با موفقیت در سامانه ثبت شد.`);
    }
  };

  const handleResetForm = () => {
    setSubject('');
    setMessage('');
    setSubmittedTicket(null);
  };

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'technical': return 'پشتیبانی فنی و سامانه';
      case 'content': return 'محتوا و آموزه‌ها';
      case 'judge': return 'داوری و مسابقات';
      case 'other': 
      default: return 'عمومی و پیشنهادها';
    }
  };

  const contactMethods = [
    {
      title: 'تماس تلفنی مستقیم',
      desc: 'پاسخگویی تلفنی کارشناسان ستاد',
      val: siteSettings?.contactPhone || '۰۲۱-۸۸۹۹۷۷۶۶',
      subVal: 'خط ویژه پشتیبانی: ۰۲۱-۸۸۹۹۷۷۶۷',
      icon: Phone,
      color: 'text-cyan-300',
      border: 'border-cyan-500/80',
      bg: 'bg-cyan-950'
    },
    {
      title: 'کانال‌ها و پیام‌رسان‌ها',
      desc: 'ارتباط در پیام‌رسان‌های داخلی و خارجی',
      val: siteSettings?.telegram ? `@${siteSettings.telegram.replace('@', '')}` : '@WarRoom_Support',
      subVal: 'در ایتا، روبیکا، بله و تلگرام',
      icon: MessageCircle,
      color: 'text-amber-300',
      border: 'border-amber-500/80',
      bg: 'bg-amber-950'
    },
    {
      title: 'پست الکترونیک (ایمیل)',
      desc: 'ارسال نامه‌های رسمی و مکاتبات',
      val: siteSettings?.contactEmail || 'info@warroom.ir',
      subVal: 'پشتیبانی فنی: support@warroom.ir',
      icon: Mail,
      color: 'text-emerald-300',
      border: 'border-emerald-500/80',
      bg: 'bg-emerald-950'
    },
    {
      title: 'ساعات کاری و پاسخگویی',
      desc: 'زمان حضور کارشناسان در ستاد',
      val: 'شنبه تا چهارشنبه: ۸:۳۰ الی ۱۷:۰۰',
      subVal: 'پنج‌شنبه‌ها: ۸:۳۰ الی ۱۳:۰۰',
      icon: Clock,
      color: 'text-purple-300',
      border: 'border-purple-500/80',
      bg: 'bg-purple-950'
    }
  ];

  const socialChannels = [
    { name: 'کانال رسمی ایتا', handle: 'eitaa.com/WarRoom_ir', color: 'bg-orange-950 text-orange-200 border-orange-500/80' },
    { name: 'کانال روبیکا', handle: 'rubika.ir/WarRoom_official', color: 'bg-blue-950 text-blue-200 border-blue-500/80' },
    { name: 'پیام‌رسان بله', handle: 'ble.ir/WarRoom_bot', color: 'bg-emerald-950 text-emerald-200 border-emerald-500/80' },
    { name: 'صفحه آپارات و کلیپ‌ها', handle: 'aparat.com/WarRoom_tv', color: 'bg-red-950 text-red-200 border-red-500/80' },
  ];

  const faqs = [
    {
      q: 'چگونه می‌توانیم با بخش داوری یا پشتیبانی فنی تماس بگیریم؟',
      a: 'شما می‌توانید از طریق فرم تیکت همین صفحه، تماس تلفنی با شماره ۰۲۱-۸۸۹۹۷۷۶۶ یا ارسال پیام در پیام‌رسان ایتا با آی‌دی @WarRoom_Support مستقیماً با کارشناسان داوری در ارتباط باشید.'
    },
    {
      q: 'آیا تیکت‌های ارسالی مستقیماً توسط مدیران و ستاد داوری بررسی می‌شوند؟',
      a: 'بله، تمامی پیام‌ها و تیکت‌ها پس از ثبت در پایگاه داده ابری، مستقیماً در پنل مدیریت ستاد قابل مشاهده، تفکیک بر اساس وضعیت و پاسخگویی هستند.'
    },
    {
      q: 'زمان پاسخگویی به پیام‌ها و تیکت‌های پشتیبانی چقدر است؟',
      a: 'تیکت‌های ارسالی معمولاً ظرف کمتر از ۲ تا ۴ ساعت کاری توسط تیم پشتیبانی بررسی و پاسخ داده می‌شوند.'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080d1a] border-2 border-cyan-500/60 rounded-2xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Headphones size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">ارسال تیکت و ارتباط با پشتیبانی</h1>
            <p className="text-xs text-cyan-200 font-bold mt-0.5">ثبت رسمی درخواست‌ها، سوالات و پیگیری پاسخ کارشناسان ستاد</p>
          </div>
        </div>

        {/* Clear Return to Home Button */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            className="self-stretch sm:self-auto px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-cyan-300 border border-cyan-500 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Home size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black">بازگشت به صفحه اصلی</span>
            <ArrowRight size={14} className="text-cyan-400 rotate-180" />
          </button>
        )}
      </div>

      {/* Main Contact Grid - SOLID OPAQUE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <div 
              key={idx}
              className={`bg-[#080d1a] border-2 ${method.border} rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:scale-[1.02] transition shadow-xl`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${method.bg} border ${method.border} ${method.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{method.title}</h3>
                  <span className="text-[11px] text-slate-200 font-bold block">{method.desc}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700 space-y-1">
                <p className="text-xs font-black text-cyan-300 font-mono dir-ltr text-right">{method.val}</p>
                <p className="text-[11px] text-slate-200 font-medium">{method.subVal}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Form & Office Info Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Contact Form (7 cols) - SOLID BLACK OPAQUE */}
        <div className="lg:col-span-7 bg-[#080d1a] border-2 border-cyan-500/60 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-white">فرم رسمی ارسال تیکت پشتیبانی</h2>
                <p className="text-xs text-slate-200 font-bold mt-0.5">متصل به پایگاه داده ابری و بررسی مستقیم توسط ستاد مرکزی</p>
              </div>
            </div>
            <Sparkles size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {submittedTicket ? (
            <div className="p-6 md:p-8 rounded-2xl bg-[#032014] border-2 border-emerald-500 text-emerald-200 text-center space-y-4 my-4 shadow-xl">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400 animate-bounce" />
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">تیکت پشتیبانی شما با موفقیت ثبت شد</h3>
                <p className="text-xs text-emerald-300 font-bold">اطلاعات تیکت در پایگاه داده ابری ذخیره گردید و در نوبت بررسی قرار گرفت.</p>
              </div>

              <div className="bg-[#000000] border border-emerald-500/60 rounded-xl p-4 text-right space-y-2 text-xs text-slate-100 font-medium max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-300 font-bold">شناسه پیگیری:</span>
                  <span className="font-mono text-emerald-300 font-black">{submittedTicket.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-300 font-bold">نام فرستنده:</span>
                  <span className="text-white font-black">{submittedTicket.user_name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-300 font-bold">موضوع:</span>
                  <span className="text-white font-black">{submittedTicket.subject}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">زمان ثبت:</span>
                  <span className="text-cyan-300 font-mono font-bold">{submittedTicket.created_at}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-600 font-bold text-xs transition cursor-pointer"
                >
                  ارسال تیکت جدید
                </button>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('Home')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Home size={14} />
                    <span>بازگشت به صفحه اصلی</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <UserIcon size={14} className="text-cyan-400" />
                    <span>نام و نام خانوادگی فرستنده *</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: علی رضایی"
                    className="w-full bg-[#000000] border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 font-bold outline-none transition focus:bg-[#020617]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <Phone size={14} className="text-amber-400" />
                    <span>شماره تماس یا ایمیل جهت پاسخگویی *</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا ایمیل معتبر"
                    className="w-full bg-[#000000] border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 font-bold outline-none transition dir-ltr text-right focus:bg-[#020617]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <Tag size={14} className="text-emerald-400" />
                    <span>موضوع یا عنوان تیکت *</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: سوال در خصوص آزمون مرحله دوم"
                    className="w-full bg-[#000000] border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 font-bold outline-none transition focus:bg-[#020617]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-purple-400" />
                    <span>بخش و دپارتمان مربوطه *</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#000000] border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none transition"
                  >
                    <option value="technical" className="bg-black text-white font-bold">پشتیبانی فنی و سامانه</option>
                    <option value="judge" className="bg-black text-white font-bold">داوری و امتیازات مسابقات</option>
                    <option value="content" className="bg-black text-white font-bold">محتوا و آموزه‌ها</option>
                    <option value="other" className="bg-black text-white font-bold">عمومی و پیشنهادات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                  <MessageSquare size={14} className="text-cyan-400" />
                  <span>متن و شرح کامل تیکت *</span>
                </label>
                <textarea 
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="لطفاً شرح پیام، سوال، مشکل یا درخواست خود را با جزئیات کامل وارد کنید..."
                  className="w-full bg-[#000000] border-2 border-slate-700 focus:border-cyan-400 rounded-xl p-3.5 text-xs text-white placeholder-slate-400 font-medium outline-none transition resize-none focus:bg-[#020617]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#000000] border border-amber-500/60 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400 shrink-0" />
                <span className="font-bold">تیکت شما بلافاصله در دیتابیس ابری ذخیره شده و توسط ستاد بررسی و پاسخ داده خواهد شد.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl text-slate-950 font-black text-xs shadow-xl transition flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-cyan-800 cursor-not-allowed text-slate-300' 
                    : 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 active:scale-[0.99] cursor-pointer'
                }`}
              >
                <Send size={16} className={isSubmitting ? 'animate-spin' : ''} />
                <span>{isSubmitting ? 'در حال ثبت در پایگاه داده...' : 'ارسال قطعی تیکت به ستاد پشتیبانی'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Address, Map Location & Social Channels (5 cols) - SOLID BLACK */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Office Address Card */}
          <div className="bg-[#080d1a] border-2 border-slate-700 rounded-3xl p-6 space-y-4 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-950 border border-amber-500 text-amber-300">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">نشانی ستاد مرکزی و مراجعه حضوری</h3>
                <span className="text-[11px] text-slate-200 font-bold">مرکز ارتباطات، ارزیابی و مسابقات</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-100 leading-relaxed pr-1 font-bold">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>تهران، خیابان انقلاب اسلامی، میدان فردوسی، خیابان سپهبد قرنی، پلاک ۱۲۴، ساختمان ستاد مرکزی اتاق جنگ</span>
              </div>
              <p className="text-[11px] text-cyan-300 font-mono pt-1">کد پستی: ۱۴۱۵۵ - ۷۸۹۳۴</p>
            </div>

            {/* Simulated Map Visual Box */}
            <div className="relative h-36 rounded-2xl bg-[#000000] border-2 border-cyan-500/60 overflow-hidden flex items-center justify-center group">
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center p-3">
                <div className="p-2.5 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 animate-bounce">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-black text-white">موقعیت جغرافیایی ستاد مرکزی روی نقشه</span>
                <span className="text-[10px] text-cyan-300 font-black">دسترسی مستقیم از ایستگاه مترو فردوسی</span>
              </div>
            </div>
          </div>

          {/* Social & Messaging Channels Box */}
          <div className="bg-[#080d1a] border-2 border-slate-700 rounded-3xl p-6 space-y-3 shadow-2xl">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Share2 size={16} className="text-cyan-400" />
              کانال‌های رسمی اطلاع‌رسانی در پیام‌رسان‌ها
            </h3>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {socialChannels.map((chan, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-xl border-2 ${chan.color} flex items-center justify-between text-xs font-bold shadow-md`}
                >
                  <span className="text-white font-bold">{chan.name}</span>
                  <span className="font-mono text-[11px] dir-ltr text-cyan-300 font-black">{chan.handle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-[#080d1a] border-2 border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <HelpCircle size={18} className="text-amber-400" />
          سوالات متداول درباره نحوه ارسال تیکت و ارتباط با ستاد
        </h3>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="border-2 border-slate-700 rounded-2xl overflow-hidden bg-[#000000]"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs font-black text-white hover:bg-slate-900 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-slate-100 leading-relaxed border-t border-slate-800 bg-[#080d1a] font-bold">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

