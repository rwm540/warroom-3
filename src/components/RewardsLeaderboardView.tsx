import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Crown, 
  Medal, 
  Sparkles, 
  Flame, 
  Search, 
  ChevronUp, 
  Shield, 
  Star,
  Award,
  Zap,
  Home
} from 'lucide-react';
import { User, Group, Medal as MedalType, UserMedal } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface RewardsLeaderboardViewProps {
  users: User[];
  groups: Group[];
  medals?: MedalType[];
  userMedals?: UserMedal[];
  triggerAlert: (msg: string) => void;
  onNavigate?: (tab: string) => void;
}

export default function RewardsLeaderboardView({
  users,
  groups,
  medals = [],
  userMedals = [],
  triggerAlert,
  onNavigate
}: RewardsLeaderboardViewProps) {
  const [rankingType, setRankingType] = useState<'squads' | 'individuals'>('squads');
  const [searchQuery, setSearchQuery] = useState('');

  // Top Teams nationwide
  const allSquads = [
    { rank: 1, name: 'جوخه صاعقه ۱۲', leader: 'فرمانده امیرحسین راد', city: 'تهران', members: 6, score: 48500, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', badge: 'طلای کشوری' },
    { rank: 2, name: 'جوخه طوفان نور', leader: 'فرمانده زهرا کاظمی', city: 'اصفهان', members: 5, score: 43200, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', badge: 'نقره کشوری' },
    { rank: 3, name: 'جوخه الفجر خراسان', leader: 'فرمانده علی پورمند', city: 'مشهد', members: 6, score: 39800, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', badge: 'برنز کشوری' },
    { rank: 4, name: 'جوخه نصر شیراز', leader: 'فرمانده مریم سلیمانی', city: 'فارس', members: 4, score: 36400, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', badge: 'رتبه ۴ برتر' },
    { rank: 5, name: 'جوخه خیبر اهواز', leader: 'فرمانده محمد اکبری', city: 'خوزستان', members: 5, score: 34100, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', badge: 'رتبه ۵ برتر' },
    { rank: 6, name: 'جوخه ذوالفقار قم', leader: 'حسین جعفری', city: 'قم', members: 4, score: 31800, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
    { rank: 7, name: 'جوخه عاشورا تبریز', leader: 'مهدی پاکزاد', city: 'آذربایجان شرقی', members: 5, score: 29500, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80' },
    { rank: 8, name: 'جوخه سحر مازندران', leader: 'نرگس کمالی', city: 'مازندران', members: 4, score: 27900, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
    { rank: 9, name: 'جوخه فتح یزد', leader: 'رضا فلاحی', city: 'یزد', members: 6, score: 26300, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { rank: 10, name: 'جوخه پیشگامان البرز', leader: 'سارا صادقی', city: 'کرج', members: 5, score: 24700, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' }
  ];

  const top5Teams = allSquads.slice(0, 5);
  const remainingTeams = allSquads.slice(5).filter(t => 
    t.name.includes(searchQuery) || t.leader.includes(searchQuery) || t.city.includes(searchQuery)
  );

  return (
    <div className="space-y-6 dir-rtl pb-28 max-w-5xl mx-auto px-3 sm:px-6 pt-4 font-sans select-none">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1633] via-[#080d21] to-[#040612] border border-amber-500/40 p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <span className="bg-amber-950/80 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-600/40">
              WAR ROOM LEADERBOARD & PODIUM
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              جدول رده‌بندی و سکوی قهرمانی
            </h1>
            <p className="text-xs text-slate-300">
              رقابت ۵ تیم برتر ایران بر روی سکوی افتخار و رتبه‌بندی سایر جوخه‌های عملیاتی
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
              <Trophy size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 5 Podium Visual Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-amber-300 flex items-center gap-2">
            <Crown size={18} className="text-amber-400" />
            <span>سکوی افتخار ۵ تیم برتر کشور</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">به‌روزرسانی زنده امتیازات</span>
        </div>

        {/* Podium Layout: 2nd (Silver Left), 1st (Gold Center Elevated), 3rd (Bronze Right) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4">
          
          {/* 2nd Place - Silver Podium */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2 flex flex-col items-center">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-300 text-slate-950 font-mono mb-1">
                رتبه ۲
              </span>
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-2 border-slate-300 p-0.5 shadow-[0_0_15px_rgba(203,213,225,0.5)]">
                <img 
                  src={top5Teams[1].avatar} 
                  alt={top5Teams[1].name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="w-full bg-gradient-to-b from-slate-800 to-slate-900 border-t-2 border-slate-400 rounded-t-2xl p-2.5 text-center h-28 sm:h-36 flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] sm:text-xs font-black text-white line-clamp-1">{top5Teams[1].name}</h4>
                <span className="text-[9px] text-slate-400 block">{top5Teams[1].city}</span>
              </div>
              <div className="text-xs font-mono font-black text-slate-200">
                {formatToPersianDigits(top5Teams[1].score)}
              </div>
            </div>
          </div>

          {/* 1st Place - Gold Podium (Center Elevated) */}
          <div className="flex flex-col items-center -mt-6">
            <div className="relative mb-2 flex flex-col items-center">
              <div className="absolute -top-6 text-amber-400 animate-bounce">
                <Crown size={24} className="fill-amber-400" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-mono mb-1 shadow-lg">
                قهرمان ۱
              </span>
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 border-amber-400 p-1 shadow-[0_0_25px_rgba(245,158,11,0.8)] neon-box-cyan">
                <img 
                  src={top5Teams[0].avatar} 
                  alt={top5Teams[0].name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="w-full bg-gradient-to-b from-amber-950/90 via-amber-900/60 to-slate-900 border-t-2 border-amber-400 rounded-t-2xl p-3 text-center h-36 sm:h-44 flex flex-col justify-between shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-200 line-clamp-1">{top5Teams[0].name}</h4>
                <span className="text-[10px] text-amber-400/80 block">{top5Teams[0].city}</span>
              </div>
              <div className="text-sm font-mono font-black text-amber-300">
                {formatToPersianDigits(top5Teams[0].score)}
              </div>
            </div>
          </div>

          {/* 3rd Place - Bronze Podium */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2 flex flex-col items-center">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-700 text-white font-mono mb-1">
                رتبه ۳
              </span>
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-2 border-amber-600 p-0.5 shadow-[0_0_15px_rgba(217,119,6,0.5)]">
                <img 
                  src={top5Teams[2].avatar} 
                  alt={top5Teams[2].name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="w-full bg-gradient-to-b from-amber-950/40 to-slate-900 border-t-2 border-amber-600 rounded-t-2xl p-2.5 text-center h-24 sm:h-32 flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] sm:text-xs font-black text-white line-clamp-1">{top5Teams[2].name}</h4>
                <span className="text-[9px] text-slate-400 block">{top5Teams[2].city}</span>
              </div>
              <div className="text-xs font-mono font-black text-amber-500">
                {formatToPersianDigits(top5Teams[2].score)}
              </div>
            </div>
          </div>

        </div>

        {/* 4th & 5th Place Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[top5Teams[3], top5Teams[4]].map((team) => (
            <div
              key={team.rank}
              className="bg-[#080e22] border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-black text-xs flex items-center justify-center">
                  #{formatToPersianDigits(team.rank)}
                </span>
                <img 
                  src={team.avatar} 
                  alt={team.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                />
                <div>
                  <h4 className="text-xs font-black text-white">{team.name}</h4>
                  <span className="text-[10px] text-slate-400">{team.leader} • {team.city}</span>
                </div>
              </div>

              <div className="text-left font-mono text-cyan-300 font-black text-xs">
                {formatToPersianDigits(team.score)} <span className="text-[9px] text-slate-400 font-sans">امتیاز</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Remaining Teams (6th and below - Clean Scrollable List) */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-300">
            سایر جوخه‌های در حال رقابت (رتبه ۶ به بعد):
          </h3>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="جستجوی نام جوخه یا شهر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 px-3 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search size={14} className="absolute right-2.5 top-2.5 text-slate-500" />
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {remainingTeams.map((team) => (
            <div
              key={team.rank}
              className="bg-[#060b1c] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">
                  {formatToPersianDigits(team.rank)}
                </span>
                <img 
                  src={team.avatar} 
                  alt={team.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-800" 
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{team.name}</h4>
                  <span className="text-[10px] text-slate-400">{team.city} ({formatToPersianDigits(team.members)} رزمنده)</span>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-slate-300">
                {formatToPersianDigits(team.score)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
