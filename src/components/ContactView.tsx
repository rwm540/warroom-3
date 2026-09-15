import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Globe, 
  CheckCircle2, 
  Headphones, 
  Home, 
  ArrowLeft, 
  Sparkles,
  Share2,
  HelpCircle,
  MessageCircle,
  Building2,
  ChevronDown
} from 'lucide-react';

interface ContactViewProps {
  onNavigate?: (tab: string) => void;
  triggerAlert?: (msg: string) => void;
  siteSettings?: any;
}

export default function ContactView({ onNavigate, triggerAlert, siteSettings }: ContactViewProps) {
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactInfo.trim() || !message.trim()) return;

    setIsSubmitted(true);
    if (triggerAlert) {
      triggerAlert('پیام شما با موفقیت به بخش پشتیبانی و ارتباط با مشتریان ارسال گردید.');
    }

    setTimeout(() => {
      setFullName('');
      setContactInfo('');
      setSubject('');
      setMessage('');
      setIsSubmitted(false);
    }, 5000);
  };

  const contactMethods = [
    {
      title: 'تماس تلفنی مستقیم',
      desc: 'پاسخگویی تلفنی کارشناسان ستاد',
      val: siteSettings?.contactPhone || '۰۲۱-۸۸۹۹۷۷۶۶',
      subVal: 'خط ویژه پشتیبانی: ۰۲۱-۸۸۹۹۷۷۶۷',
      icon: Phone,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20'
    },
    {
      title: 'کانال‌ها و پیام‌رسان‌ها',
      desc: 'ارتباط در پیام‌رسان‌های داخلی و خارجی',
      val: siteSettings?.telegram ? `@${siteSettings.telegram.replace('@', '')}` : '@WarRoom_Support',
      subVal: 'در ایتا، روبیکا، بله و تلگرام',
      icon: MessageCircle,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20'
    },
    {
      title: 'پست الکترونیک (ایمیل)',
      desc: 'ارسال نامه‌های رسمی و مکاتبات',
      val: siteSettings?.contactEmail || 'info@warroom.ir',
      subVal: 'پشتیبانی فنی: support@warroom.ir',
      icon: Mail,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    },
    {
      title: 'ساعات کاری و پاسخگویی',
      desc: 'زمان حضور کارشناسان در ستاد',
      val: 'شنبه تا چهارشنبه: ۸:۳۰ الی ۱۷:۰۰',
      subVal: 'پنج‌شنبه‌ها: ۸:۳۰ الی ۱۳:۰۰',
      icon: Clock,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20'
    }
  ];

  const socialChannels = [
    { name: 'کانال رسمی ایتا', handle: 'eitaa.com/WarRoom_ir', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    { name: 'کانال روبیکا', handle: 'rubika.ir/WarRoom_official', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { name: 'پیام‌رسان بله', handle: 'ble.ir/WarRoom_bot', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { name: 'صفحه آپارات و کلیپ‌ها', handle: 'aparat.com/WarRoom_tv', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  ];

  const faqs = [
    {
      q: 'چگونه می‌توانیم با بخش داوری یا پشتیبانی فنی تماس بگیریم؟',
      a: 'شما می‌توانید از طریق فرم زیر، تماس تلفنی با شماره ۰۲۱-۸۸۹۹۷۷۶۶ یا ارسال پیام در پیام‌رسان ایتا با آی‌دی @WarRoom_Support مستقیماً با کارشناسان داوری در ارتباط باشید.'
    },
    {
      q: 'آیا امکان مراجعه حضوری به ستاد مرکزی وجود دارد؟',
      a: 'بله، مراجعه حضوری جهت هماهنگی‌های گروهی و جلسات مربیان با هماهنگی قبلی تلفنی در ساعات کاری ستاد امکان‌پذیر می‌باشد.'
    },
    {
      q: 'زمان پاسخگویی به پیام‌ها و فرم ارتباط چقدر است؟',
      a: 'پیام‌های ارسالی از طریق فرم سایت یا پیام‌رسان‌ها معمولاً ظرف کمتر از ۲ تا ۴ ساعت کاری توسط تیم پشتیبانی بررسی و پاسخ داده می‌شوند.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 dir-rtl pb-16 max-w-6xl mx-auto px-2 md:px-4"
    >
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between bg-[#080d22]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
            <Headphones size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">صفحه اختصاصی ارتباط با ما</h2>
            <p className="text-[11px] text-cyan-300/80 font-bold">راهنمایی، راه‌های ارتباطی و پاسخگویی به مشتریان و مخاطبان</p>
          </div>
        </div>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <div 
              key={idx}
              className={`bg-[#080d22] border ${method.border} rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:scale-[1.02] transition shadow-md`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${method.bg} border ${method.border} ${method.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{method.title}</h3>
                  <span className="text-[10px] text-slate-400 block">{method.desc}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <p className="text-xs font-black text-cyan-300 font-mono dir-ltr text-right">{method.val}</p>
                <p className="text-[10px] text-slate-400 font-medium">{method.subVal}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Form & Office Info Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#080d22] border border-cyan-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">فرم ارسال پیام مستقیم به ستاد</h3>
                <p className="text-[11px] text-slate-400">پیشنهادات، انتقادات، سوالات و درخواست‌های همکاری</p>
              </div>
            </div>
            <Sparkles size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-center space-y-3 my-6">
              <CheckCircle2 size={42} className="mx-auto text-emerald-400 animate-bounce" />
              <h4 className="text-lg font-black text-white">پیام شما با موفقیت ثبت شد</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                با تشکر از پیام شما. کارشناسان پشتیبانی و ارتباط با مشتریان در اسرع وقت پیام شما را بررسی کرده و پاسخ را از طریق شماره تماس یا ایمیل ارسالی اطلاع خواهند داد.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">نام و نام خانوادگی *</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد حسینی"
                    className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">شماره همراه یا ایمیل *</label>
                  <input 
                    type="text" 
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا email@example.com"
                    className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">موضوع پیام</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="عنوان خلاصه پیام..."
                    className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">بخش مربوطه</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  >
                    <option value="general">ارتباط عمومی و سوالات</option>
                    <option value="support">پشتیبانی فنی و ثبت‌نام</option>
                    <option value="judging">داوری و مسابقات</option>
                    <option value="cooperation">پیشنهاد همکاری و مربی‌گری</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">متن پیام یا توضیحات کامل *</label>
                <textarea 
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="لطفاً شرح پیام یا سوال خود را با جزئیات کامل وارد کنید..."
                  className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl p-3.5 text-xs text-white outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>ارسال نهایی پیام به کارشناسان ستاد</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Address, Map Location & Social Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Office Address Card */}
          <div className="bg-[#080d22] border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">نشانی ستاد مرکزی و مراجعه حضوری</h3>
                <span className="text-[10px] text-slate-400">مرکز ارتباطات، ارزیابی و مسابقات</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed pr-1">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>تهران، خیابان انقلاب اسلامی، میدان فردوسی، خیابان سپهبد قرنی، پلاک ۱۲۴، ساختمان ستاد مرکزی اتاق جنگ</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono pt-1">کد پستی: ۱۴۱۵۵ - ۷۸۹۳۴</p>
            </div>

            {/* Simulated Map Visual Box */}
            <div className="relative h-36 rounded-2xl bg-[#050816] border border-cyan-500/20 overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:14px_14px]" />
              <div className="relative z-10 flex flex-col items-center gap-1 text-center p-3">
                <div className="p-2.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-black text-white">موقعیت جغرافیایی ستاد مرکزی روی نقشه</span>
                <span className="text-[9px] text-cyan-300/80">دسترسی راحت از ایستگاه مترو فردوسی (۵ دقیقه پیاده)</span>
              </div>
            </div>
          </div>

          {/* Social & Messaging Channels Box */}
          <div className="bg-[#080d22] border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Share2 size={16} className="text-cyan-400" />
              کانال‌های اطلاع‌رسانی در شبکه اجتماعی
            </h3>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {socialChannels.map((chan, i) => (
                <div 
                  key={i}
                  className={`p-2.5 rounded-xl border ${chan.color} flex items-center justify-between text-xs font-bold`}
                >
                  <span>{chan.name}</span>
                  <span className="font-mono text-[10px] dir-ltr">{chan.handle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-[#080d22] border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <HelpCircle size={18} className="text-amber-400" />
          سوالات متداول درباره نحوه ارتباط با ما
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0a0f26]"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs font-black text-white hover:bg-slate-900/50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#050816]/50">
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
