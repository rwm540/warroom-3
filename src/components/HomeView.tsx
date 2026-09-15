import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Group } from '../types';
import { 
  initialHomeAnnouncements, 
  homeStatsData, 
  faqsData, 
  HomeAnnouncement,
  HomeStats,
  FaqItem
} from '../data/home';

import NotificationPanel from './home/NotificationPanel';
import AdventureHeroSection from './home/AdventureHeroSection';
import PrizesAwardsBanner from './home/PrizesAwardsBanner';
import SocialMessengersWidgets from './home/SocialMessengersWidgets';
import AboutSection from './home/AboutSection';
import StatsStrip from './home/StatsStrip';
import FaqAccordion from './home/FaqAccordion';
import Footer from './home/Footer';
import { Shield, BookOpen, Sparkles, X, CheckCircle, Gem, Trophy } from 'lucide-react';

interface HomeViewProps {
  currentUser: User | null;
  groups: Group[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register_individual' | 'register_group') => void;
  onLogout: () => void;
  onOpenSquadModal: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  triggerAlert: (msg: string) => void;
  siteSettings?: any;
  homeAnnouncements?: HomeAnnouncement[];
  homeStats?: HomeStats;
  faqs?: FaqItem[];
  campaignTheme?: 'girls' | 'boys';
  onChangeCampaign?: () => void;
}

export default function HomeView({
  currentUser,
  groups,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenSquadModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  triggerAlert,
  siteSettings,
  homeAnnouncements,
  homeStats,
  faqs,
  campaignTheme = 'boys',
  onChangeCampaign
}: HomeViewProps) {
  // Theme Switching State: 'girls' (feminine pastel/pink) vs 'boys' (masculine cyan/blue/amber)
  const [themeMode, setThemeMode] = useState<'girls' | 'boys'>(() => {
    if (campaignTheme) return campaignTheme;
    if (currentUser?.gender === 'دختر') return 'girls';
    const saved = localStorage.getItem('hisstory_theme_mode');
    return (saved === 'girls' || saved === 'boys') ? saved : 'boys';
  });

  useEffect(() => {
    if (campaignTheme) {
      setThemeMode(campaignTheme);
    }
  }, [campaignTheme]);

  const handleThemeChange = (mode: 'girls' | 'boys') => {
    setThemeMode(mode);
    localStorage.setItem('hisstory_theme_mode', mode);
    triggerAlert(mode === 'girls' ? 'پوسته ویژه دختران فعال شد.' : 'پوسته ویژه پسران فعال شد.');
  };

  // Notification Panel Drawer state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>(() => {
    return homeAnnouncements || initialHomeAnnouncements;
  });

  // Modal states
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (showGuideModal) {
      window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: true } }));
      return () => {
        window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: false } }));
      };
    }
  }, [showGuideModal]);

  // Keep state updated if props change
  useEffect(() => {
    if (homeAnnouncements) {
      setAnnouncements(homeAnnouncements);
    }
  }, [homeAnnouncements]);

  const isGirls = themeMode === 'girls';

  const handleStartMission = () => {
    setActiveTab('Journey');
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 font-sans p-0 md:p-4 lg:p-6 flex justify-center ${
      isGirls ? 'girls-atmosphere-bg text-pink-50' : 'boys-atmosphere-bg text-slate-100'
    }`}>
      
      {/* Dynamic Background Ambient Aura - GPU Accelerated */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
        {isGirls ? (
          <>
            <div className="absolute top-0 inset-x-0 h-[35vh] bg-gradient-to-b from-[#020005] via-[#090112]/70 to-transparent" />
            <div className="absolute -bottom-24 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] blur-[80px] rounded-full bg-[radial-gradient(circle,rgba(255,19,137,0.35)_0%,transparent_70%)] transform-gpu will-change-transform" />
            <div className="absolute -bottom-24 -right-20 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] blur-[85px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.38)_0%,transparent_70%)] transform-gpu will-change-transform" />
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] blur-[90px] rounded-full bg-[radial-gradient(circle,rgba(74,13,103,0.3)_0%,transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-[#010206] via-[#020512]/60 to-transparent" />
            {/* Bottom-left Crimson-Red Aura matching reference wallpaper */}
            <div className="absolute -bottom-24 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] blur-[80px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.35)_0%,transparent_70%)] transform-gpu will-change-transform" />
            {/* Bottom-right Electric Cobalt-Blue Aura matching reference wallpaper */}
            <div className="absolute -bottom-24 -right-20 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] blur-[85px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.38)_0%,transparent_70%)] transform-gpu will-change-transform" />
            {/* Deep Indigo convergence */}
            <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] blur-[90px] rounded-full bg-[radial-gradient(circle,rgba(55,27,110,0.3)_0%,transparent_70%)]" />
            {/* Fine Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />
          </>
        )}
      </div>

      {/* Responsive Container: Mobile-Optimized + Full Desktop Experience */}
      <div className={`w-full max-w-[500px] md:max-w-6xl min-h-screen md:min-h-0 relative shadow-[0_0_70px_rgba(0,0,0,0.95)] border-x md:border md:rounded-3xl flex flex-col pb-10 md:pb-8 overflow-hidden z-10 transition-colors duration-500 ${
        isGirls 
          ? 'girls-card-surface border-fuchsia-500/35 shadow-[0_0_80px_rgba(255,19,137,0.22)]' 
          : 'boys-card-surface border-blue-500/35 shadow-[0_0_80px_rgba(37,99,235,0.22)]'
      }`}>
        
        <div className="relative z-10 flex-1 flex flex-col">

          {/* Main Landing Content with Scroll Animations */}
          <div className="p-3 sm:p-5 md:p-6 space-y-6 sm:space-y-8">
            
            {/* 1. Adventure Hero Section */}
            <motion.section 
              aria-label="بخش معرفی مسابقه و بنر ثبت‌نام"
              className="transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.1, margin: "-20px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdventureHeroSection 
                themeMode={themeMode}
                currentUser={currentUser}
                siteSettings={siteSettings}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenRegister={() => onOpenAuth('register_individual')}
                onGoToDashboard={() => {
                  if (currentUser?.role === 'admin') {
                    setActiveTab('Admin');
                  } else {
                    setActiveTab('Dashboard');
                  }
                  if (currentUser) {
                    triggerAlert(`ورود مستقیم به پنل: ${currentUser.first_name} ${currentUser.last_name}`);
                  }
                }}
              />
            </motion.section>

            {/* 2. Dedicated Banner for Prizes & Awards */}
            <motion.section 
              aria-label="جوایز و هدایای مسابقه"
              className="transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.12, margin: "-20px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <PrizesAwardsBanner 
                themeMode={themeMode}
                onExplorePrizes={() => setActiveTab('RewardsLeaderboard')}
              />
            </motion.section>

            {/* 3. Social Media Widgets: Local Messengers + Stages & Guide */}
            <motion.section 
              aria-label="شبکه‌های اجتماعی و پیام‌رسان‌های بله و ایتا"
              className="transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.12, margin: "-20px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <SocialMessengersWidgets 
                themeMode={themeMode}
                onOpenStages={() => setActiveTab('Journey')}
                onOpenGuide={() => setShowGuideModal(true)}
                triggerAlert={triggerAlert}
              />
            </motion.section>

            {/* 4. About Us Section */}
            <motion.section 
              aria-label="درباره ما"
              className="transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15, margin: "-20px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AboutSection onOpenMore={() => setActiveTab('About')} />
            </motion.section>

            {/* 5. Footer at the Very Bottom */}
            <motion.footer 
              className="transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15, margin: "-20px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Footer 
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAbout={() => setActiveTab('About')}
                themeMode={themeMode}
              />
            </motion.footer>

          </div>

        </div>

        {/* Notification Panel Drawer */}
        <NotificationPanel 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          announcements={announcements}
        />

        {/* Competition Guide & Rules Modal */}
        {showGuideModal && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
            <div className={`border rounded-3xl p-4 sm:p-6 max-w-md w-full text-right relative space-y-4 shadow-2xl my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto ${
              isGirls 
                ? 'bg-[#150718] border-pink-500/50 shadow-pink-900/40 text-pink-50' 
                : 'boys-card-surface border-blue-500/50 shadow-[0_0_35px_rgba(37,99,235,0.35)] text-slate-100'
            }`}>
              
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-700/50 pb-3">
                <div className={`p-2 rounded-xl ${isGirls ? 'bg-pink-950 text-pink-400' : 'bg-blue-950 text-blue-400 border border-blue-500/40'}`}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">راهنما و قوانین ماجراجویی اتاق جنگ</h3>
                  <span className={`text-[10px] font-mono ${isGirls ? 'text-pink-300' : 'text-blue-300'}`}>پرونده بزرگ هفت‌خوان</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pl-1">
                <div className={`p-3 rounded-2xl space-y-1 border ${
                  isGirls ? 'bg-slate-900/60 border-slate-800' : 'bg-[#081228]/80 border-blue-900/50'
                }`}>
                  <strong className="text-white flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span>۱. ساختار هفت مرحله مسابقه:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    مسابقه شامل ۷ مرحله داستانی به سبک کارآگاهی است. با اتمام هر مرحله کریستال‌های امتیاز آزاد شده و مرحله بعدی باز می‌شود.
                  </p>
                </div>

                <div className={`p-3 rounded-2xl space-y-1 border ${
                  isGirls ? 'bg-slate-900/60 border-slate-800' : 'bg-[#081228]/80 border-blue-900/50'
                }`}>
                  <strong className="text-white flex items-center gap-1.5">
                    <Gem size={14} className={isGirls ? 'text-pink-400' : 'text-blue-400'} />
                    <span>۲. کریستال‌ها و رده‌بندی:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    کریستال‌ها بر اساس دقت در پاسخ، حل چالش‌ها و سرعت عمل تعلق می‌گیرد. برترین‌های کشور و استان مشمول جوایز ۵۰ میلیارد ریالی خواهند شد.
                  </p>
                </div>

                <div className={`p-3 rounded-2xl space-y-1 border ${
                  isGirls ? 'bg-slate-900/60 border-slate-800' : 'bg-[#081228]/80 border-blue-900/50'
                }`}>
                  <strong className="text-white flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-400" />
                    <span>۳. جوایز و کدهای تخفیف:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    علاوه بر کنسول‌های بازی، تبلت و تلفن هوشمند، بیش از ۱۰۰ هزار کد تخفیف فروشگاهی به کلیه شرکت‌کنندگان اهدا می‌گردد.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    setActiveTab('Journey');
                  }}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 ${
                    isGirls 
                      ? 'girls-button-neon text-white shadow-[0_0_20px_rgba(255,19,137,0.4)]' 
                      : 'boys-button-tactical text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  <span>ورود به نقشه مراحل مسابقه</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
