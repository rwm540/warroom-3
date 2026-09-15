import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Info, 
  CreditCard,
  Building2,
  X,
  MessageCircle,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAbout: () => void;
  themeMode?: 'girls' | 'boys';
}

export default function Footer({ onNavigate, onOpenAbout, themeMode = 'boys' }: FooterProps) {
  const [activeTrustModal, setActiveTrustModal] = useState<'enamad' | 'zarinpal' | 'contact' | null>(null);
  const isGirls = themeMode === 'girls';

  return (
    <footer className={`mt-12 mb-2 md:mb-6 px-4 pt-8 pb-36 md:pb-14 border-t text-slate-200 dir-rtl rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden transition-colors duration-500 ${
      isGirls 
        ? 'border-fuchsia-500/30 bg-[#12021c]/95 shadow-[0_-10px_30px_rgba(255,19,137,0.15)]' 
        : 'border-blue-500/35 bg-[#050b1d]/95 shadow-[0_-10px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(37,99,235,0.15)]'
    }`}>
      
      {/* Background Accent Gradients */}
      <div className={`absolute top-0 right-1/4 w-72 h-72 blur-[100px] pointer-events-none rounded-full ${
        isGirls ? 'bg-fuchsia-600/15' : 'bg-blue-600/15'
      }`} />
      <div className={`absolute bottom-0 left-1/4 w-72 h-72 blur-[100px] pointer-events-none rounded-full ${
        isGirls ? 'bg-pink-600/15' : 'bg-red-600/15'
      }`} />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Top Grid: Brand Info + Contact Info */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 text-right pb-8 border-b ${
          isGirls ? 'border-fuchsia-500/20' : 'border-blue-500/20'
        }`}>
          
          {/* Col 1: About Platform & Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl p-[1px] ${
                isGirls 
                  ? 'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-800 shadow-[0_0_12px_rgba(255,19,137,0.5)]' 
                  : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-red-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              }`}>
                <div className={`w-full h-full rounded-[11px] flex items-center justify-center font-bold ${
                  isGirls ? 'bg-[#1a0229] text-fuchsia-400' : 'bg-[#060c22] text-blue-400'
                }`}>
                  <Shield size={22} className="animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-black text-white tracking-tight">سامانه ملی «اتاق جنگ»</h2>
                <p className={`text-[10px] font-semibold ${isGirls ? 'text-pink-400' : 'text-blue-400'}`}>
                  {isGirls ? 'پویش دختران پیشگام و مقتدر' : 'سامانه استراتژیک و ارزیابی اتاق جنگ'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تنها سامانه رسمی ارزیابی، مسابقه و آموزش‌های استراتژیک دانش‌آموزی کشور تحت نظارت قرارگاه مرکزی. این مجموعه با هدف توانمندسازی فکری، تفکر تفکیکی و ارتقای آمادگی نخبگان نوجوان فعالیت می‌کند.
            </p>

            {/* Quick Links Row */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={onOpenAbout}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <Info size={14} />
                <span>درباره ما و قوانین</span>
              </button>
              <span className="text-slate-700">•</span>
              <button 
                onClick={() => setActiveTrustModal('contact')}
                className={`text-xs font-bold flex items-center gap-1 transition ${
                  isGirls ? 'text-pink-400 hover:text-pink-300' : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                <Phone size={14} />
                <span>اطلاعات تماس</span>
              </button>
            </div>
          </div>

          {/* Col 2: Contact & Support Info */}
          <div className="space-y-3">
            <div className={`flex items-center gap-2 font-black text-xs border-b pb-2 ${
              isGirls ? 'text-pink-300 border-fuchsia-500/20' : 'text-blue-300 border-blue-500/20'
            }`}>
              <Phone size={16} className={isGirls ? 'text-pink-400' : 'text-blue-400'} />
              <span>ارتباط با دبیرخانه و پشتیبانی</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>تلفن پشتیبانی:</span>
                <span className="font-mono font-bold text-white text-xs dir-ltr">۰۲۱-۸۸۹۹۷۷۶۶</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span>ساعات پاسخگویی:</span>
                <span className="text-slate-300">شنبه تا چهارشنبه ۸:۰۰ الی ۱۶:۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span>پست الکترونیکی:</span>
                <span className={`font-mono ${isGirls ? 'text-pink-300' : 'text-blue-300'}`}>support@warroom.ir</span>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  نشانی: تهران، خیابان آزادی، مرکز فناوری و نوآوری‌های استراتژیک، پلاک ۱۱۰
                </span>
              </li>
            </ul>

            <div className="pt-1">
              <button
                onClick={() => onNavigate('Support')}
                className={`w-full font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-2 ${
                  isGirls 
                    ? 'girls-button-neon text-white border border-pink-400/40 shadow-[0_0_15px_rgba(255,19,137,0.3)]' 
                    : 'boys-button-tactical text-white border border-blue-400/40 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                }`}
              >
                <MessageCircle size={15} />
                <span>ارسال تیکت پشتیبانی آنلاین ۲۴/۷</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Trust Badges (eNamad & ZarinPal) + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Copyright text */}
          <div className="text-[11px] text-slate-400 font-medium text-center md:text-right space-y-1">
            <p className="text-slate-200 font-bold">
              © ۱۴۰۳ تمامی حقوق مادی و معنوی متعلق به قرارگاه مرکزی مسابقات استراتژیک «اتاق جنگ» می‌باشد.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              طراحی و توسعه یافته با استاندارد امنیتی AES-256 و پروتکل TLS 1.3
            </p>
          </div>

          {/* Official Electronic Badges: eNamad & ZarinPal */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            
            {/* eNamad Badge */}
            <button
              onClick={() => setActiveTrustModal('enamad')}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#080d22] border border-amber-500/40 hover:border-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.15)] text-right"
              title="برای مشاهده تاییدیه نماد اعتماد الکترونیکی کلیک کنید"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition">
                <Building2 size={18} />
                <span className="text-[8px] font-black mt-0.5">اینماد</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">نماد اعتماد الکترونیکی</span>
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-[9px] text-amber-300/80 font-mono font-bold block mt-0.5">وزارت صنعت، معدن و تجارت</span>
              </div>
            </button>

            {/* ZarinPal Badge */}
            <button
              onClick={() => setActiveTrustModal('zarinpal')}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#080d22] border border-cyan-500/40 hover:border-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.15)] text-right"
              title="برای مشاهده تاییدیه درگاه ایمن زرین‌پال کلیک کنید"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex flex-col items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition">
                <CreditCard size={18} />
                <span className="text-[8px] font-black mt-0.5">زرین‌پال</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">درگاه پرداخت زرین‌پال</span>
                  <Lock size={12} className="text-emerald-400" />
                </div>
                <span className="text-[9px] text-cyan-300/80 font-mono font-bold block mt-0.5">پرداخت ایمن ۲۵۶ بیتی</span>
              </div>
            </button>

          </div>

        </div>

      </div>

      {/* TRUST & VERIFICATION MODALS */}
      {activeTrustModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
          <div className="bg-[#080d24] border border-cyan-500/50 rounded-3xl p-4 sm:p-6 max-w-sm w-full text-right shadow-[0_0_50px_rgba(6,182,212,0.4)] relative space-y-4 my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveTrustModal(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={18} />
            </button>

            {activeTrustModal === 'enamad' && (
              <>
                <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">نماد اعتماد الکترونیکی (اینماد)</h3>
                    <span className="text-[10px] text-amber-300 font-mono">احراز هویت و صلاحیت قانونی</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">نام کسب‌وکار:</span>
                    <span className="font-bold text-white">سامانه ملی اتاق جنگ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">شماره مجوز اینماد:</span>
                    <span className="font-mono text-amber-400 font-bold">۱۴۰۳/۹۸۷۴۲۱</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">وضعیت نماد:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      تأیید شده و فعال (۵ ستاره)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">مرجع صدور:</span>
                    <span className="text-slate-200">وزارت صنعت، معدن و تجارت</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
                >
                  تایید و بستن
                </button>
              </>
            )}

            {activeTrustModal === 'zarinpal' && (
              <>
                <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500 flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">درگاه پرداخت اینترنتی زرین‌پال</h3>
                    <span className="text-[10px] text-cyan-300 font-mono">تضمین امنیت تراکنش‌ها</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">عنوان درگاه:</span>
                    <span className="font-bold text-white">زرین‌پال (تایید شده و معتبر)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">شناسه اختصاصی درگاه:</span>
                    <span className="font-mono text-cyan-300 font-bold">۹۸۷۴۳۲۰۱</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">سطح امنیت:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Lock size={12} />
                      رمزنگاری امن داده‌ها
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">وضعیت اتصال:</span>
                    <span className="text-emerald-400 font-bold">مستقیم به شبکه شتاب</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition"
                >
                  تایید و بستن
                </button>
              </>
            )}

            {activeTrustModal === 'contact' && (
              <>
                <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 border border-amber-500 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">اطلاعات کامل ارتباط با دبیرخانه</h3>
                    <span className="text-[10px] text-slate-400">ستاد مرکزی مسابقات اتاق جنگ</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <p>
                    <strong>تلفن مستقیم:</strong> <span className="font-mono font-bold text-amber-400 text-sm">۰۲۱-۸۸۹۹۷۷۶۶</span>
                  </p>
                  <p>
                    <strong>کانال ایتا:</strong> <span className="font-mono text-amber-300">@WarRoom_ir</span>
                  </p>
                  <p>
                    <strong>کانال روبیکا:</strong> <span className="font-mono text-rose-400">@WarRoom_ir</span>
                  </p>
                  <p>
                    <strong>آدرس:</strong> تهران، خیابان آزادی، مرکز نوآوری و فناوری‌های استراتژیک، پلاک ۱۱۰
                  </p>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  بستن
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </footer>
  );
}
