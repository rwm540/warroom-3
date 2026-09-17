import React from 'react';
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

  const girlsBannerSrc = siteSettings?.girlsBannerImage || girlsBannerJpg;
  const boysBannerSrc = siteSettings?.boysBannerImage || boysBannerJpg;

  const handleBannerAction = () => {
    if (currentUser) {
      // کاربر شناسایی شده → ورود مستقیم به پنل
      onGoToDashboard?.();
    } else {
      onOpenRegister();
    }
  };

  return (
    <div className="w-full text-center space-y-3">
      
      {/* 🛡️ Logo Image */}
      <div className="flex justify-center items-center py-1">
        <img 
          src={warroomLogoJpg} 
          alt="لوگوی اتاق جنگ" 
          className={`w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full object-cover cursor-pointer transition-all duration-300 hover:scale-105 select-none bg-transparent ${
            isGirls 
              ? 'drop-shadow-[0_0_15px_rgba(255,19,137,0.4)]' 
              : 'drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]'
          }`}
          onClick={handleBannerAction}
        />
      </div>

      {/* Interactive Clean Image Registration Banner */}
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
        className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer transform hover:scale-[1.008] active:scale-[0.992] transition-all duration-300"
      >
        {/* Banner Artwork Container - Layout Stable Offline & Online */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl min-h-[160px] sm:min-h-[220px] bg-slate-900/40">
          <img 
            src={isGirls ? girlsBannerSrc : boysBannerSrc} 
            alt={isGirls ? "بنر ثبت‌نام دختران اتاق جنگ" : "بنر ثبت‌نام پسران اتاق جنگ"} 
            referrerPolicy="no-referrer"
            loading="eager"
            className="w-full h-auto max-h-[75vh] object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        </div>
      </div>

    </div>
  );
}

