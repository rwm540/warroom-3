import React, { useState } from 'react';
import { 
  Shield, ArrowLeft, UserPlus, 
  LayoutDashboard, SlidersHorizontal 
} from 'lucide-react';
import { User, SiteSettings } from '../../types';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';
import boysBannerJpg from '../../assets/images/boys_registration_banner_1788362378043.jpg';
import girlsBannerJpg from '../../assets/images/girls_registration_banner_1788362396185.jpg';

interface AdventureHeroSectionProps {
  themeMode: 'girls' | 'boys';
  currentUser: User | null;
  onOpenRegister: () => void;
  onGoToDashboard?: () => void;
  siteSettings?: SiteSettings;
  onNavigate?: (tab: string) => void;
}

export default function AdventureHeroSection({
  themeMode,
  currentUser,
  onOpenRegister,
  onGoToDashboard,
  siteSettings,
}: AdventureHeroSectionProps) {
  const isGirls = themeMode === 'girls';
  const [logoError, setLogoError] = useState(false);

  // کاربر واردشده (ثبت‌نام/ورود انجام شده) → دکمه با نام او نمایش داده می‌شود
  const isLoggedIn = Boolean(currentUser);
  const honorific = currentUser?.gender === 'دختر' ? 'خانم' : 'آقای';

  const logoSrc = siteSettings?.heroImage || warroomLogoJpg;
  const girlsBannerSrc = siteSettings?.girlsBannerImage || girlsBannerJpg;
  const boysBannerSrc = siteSettings?.boysBannerImage || boysBannerJpg;
  const siteTitle = siteSettings?.heroTitle || 'اتاق جنگ';
  const badgeText = siteSettings?.badgeText || 'اتاق جنگ';

  const handleBannerAction = () => {
    if (currentUser) {
      // کاربر شناسایی شده → ورود مستقیم به پنل
      onGoToDashboard?.();
    } else {
      onOpenRegister();
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5 text-center">
      
      {/* 1. Main Logo Icon Centered (خالص و بدون بردر) */}
      <div className="pt-1 flex flex-col items-center justify-center">
        <div className="relative inline-flex flex-col items-center justify-center">
          {!logoError ? (
            <img 
              src={logoSrc} 
              alt="لوگوی رسمی"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 object-contain rounded-2xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center p-2">
              <Shield size={44} className={isGirls ? 'text-fuchsia-400' : 'text-blue-400'} />
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Image Registration Banner (دقیقاً مطابق اسکرین‌شات مرجع) */}
      <div 
        onClick={handleBannerAction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBannerAction();
          }
        }}
        className={`group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 p-1 sm:p-1.5 transition-all duration-300 cursor-pointer transform hover:scale-[1.008] active:scale-[0.992] shadow-2xl ${
          isGirls
            ? 'bg-[#150220] border-fuchsia-500/60 shadow-[0_0_40px_rgba(255,19,137,0.35)] hover:border-fuchsia-400'
            : 'bg-[#040c1e] border-blue-500/60 shadow-[0_0_40px_rgba(37,99,235,0.35)] hover:border-blue-400'
        }`}
      >
        {/* Banner Artwork Container */}
        <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden">
          <img 
            src={isGirls ? girlsBannerSrc : boysBannerSrc} 
            alt={isGirls ? "بنر ثبت‌نام دختران اتاق جنگ" : "بنر ثبت‌نام پسران اتاق جنگ"} 
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[75vh] object-cover object-center brightness-100 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        </div>
      </div>

    </div>
  );
}

