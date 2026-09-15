import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldAlert, 
  Tag, 
  User as UserIcon, 
  Lock,
  Phone,
  Mail,
  MapPin,
  Headphones,
  Home,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Globe
} from 'lucide-react';
import { User, SupportTicket, SupportReply, TicketType, TicketStatus } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface SupportViewProps {
  currentUser?: User | null;
  tickets?: SupportTicket[];
  setTickets?: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  replies?: SupportReply[];
  setReplies?: React.Dispatch<React.SetStateAction<SupportReply[]>>;
  triggerAlert?: (msg: string) => void;
  onNavigate?: (tab: string) => void;
}

export default function SupportView({
  currentUser,
  tickets = [],
  setTickets,
  replies = [],
  setReplies,
  triggerAlert,
  onNavigate
}: SupportViewProps) {
  // Guest contact form state
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestSubject, setGuestSubject] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  // Filter tickets for current user if logged in
  const userTickets = currentUser ? tickets.filter(t => t.user_id === currentUser.id) : [];

  const [selectedTicketId, setSelectedTicketId] = useState<string>(userTickets[0]?.id || '');
  const selectedTicket = userTickets.find(t => t.id === selectedTicketId) || userTickets[0];

  // Ticket creation modal / toggle
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  React.useEffect(() => {
    if (showNewModal) {
      window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: true } }));
      return () => {
        window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: false } }));
      };
    }
  }, [showNewModal]);
  const [newSubject, setNewSubject] = useState<string>('');
  const [newType, setNewType] = useState<TicketType>('technical');
  const [newMessage, setNewMessage] = useState<string>('');

  // Reply message text
  const [replyText, setReplyText] = useState<string>('');

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestContact.trim() || !guestMessage.trim()) return;

    setIsSent(true);
    if (triggerAlert) {
      triggerAlert('پیام شما با موفقیت به ستاد پشتیبانی ارسال شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.');
    }
    setTimeout(() => {
      setGuestName('');
      setGuestContact('');
      setGuestSubject('');
      setGuestMessage('');
      setIsSent(false);
    }, 4000);
  };

  const getCategoryLabel = (type: TicketType) => {
    switch (type) {
      case 'technical':
        return 'پشتیبانی فنی و سامانه';
      case 'content':
        return 'محتوا و آموزه‌ها';
      case 'judge':
        return 'داوری و امتیازدهی';
      case 'other':
      default:
        return 'عمومی و سایر موارد';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">در انتظار پاسخ</span>;
      case 'in_progress':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">پاسخ داده‌شده / در حال بررسی</span>;
      case 'closed':
        return <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">بسته شده</span>;
    }
  };

  // Create new ticket submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newSubject.trim() || !newMessage.trim() || !setTickets) return;

    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      user_id: currentUser.id,
      user_name: `${currentUser.first_name} ${currentUser.last_name}`,
      personal_code: currentUser.personal_code,
      subject: newSubject,
      message: newMessage,
      type: newType,
      status: 'open',
      created_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      updated_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setNewSubject('');
    setNewMessage('');
    setShowNewModal(false);
    if (triggerAlert) triggerAlert('تیکت جدید با موفقیت ارسال شد.');
  };

  // Send reply handler
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !replyText.trim() || !selectedTicket || !setReplies || !setTickets) return;

    const newReply: SupportReply = {
      id: `rep-${Date.now()}`,
      ticket_id: selectedTicket.id,
      user_id: currentUser.id,
      user_name: `${currentUser.first_name} ${currentUser.last_name}`,
      message: replyText,
      is_admin: false,
      created_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setReplies(prev => [...prev, newReply]);

    // Update ticket status to 'open' on user reply
    setTickets(prev => prev.map(t => 
      t.id === selectedTicket.id ? { ...t, status: 'open' } : t
    ));

    setReplyText('');
    if (triggerAlert) triggerAlert('پاسخ شما ارسال شد و تیکت به حالت باز تغییر یافت.');
  };

  const currentReplies = replies.filter(r => r.ticket_id === selectedTicket?.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 dir-rtl pb-16 max-w-6xl mx-auto px-2 md:px-4"
    >
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between bg-[#080d22]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
            <Headphones size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">ارتباط با ما و مرکز پشتیبانی</h2>
            <p className="text-[11px] text-cyan-300/80 font-bold">پاسخگویی سریع، ارسال پیام مستقیم و راهنمایی کاربران</p>
          </div>
        </div>
      </div>

      {/* Direct Contact Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#080d22] border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3 hover:border-cyan-400/60 transition">
          <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shrink-0">
            <Phone size={22} />
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold block">تلفن مستقیم پاسخگویی:</span>
            <span className="text-sm font-black text-white dir-ltr font-mono">۰۲۱ - ۸۸۹۹۷۷۶۶</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">شنبه تا چهارشنبه ۹ الی ۱۸</span>
          </div>
        </div>

        <div className="bg-[#080d22] border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-400/60 transition">
          <div className="p-3 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/40 shrink-0">
            <Mail size={22} />
          </div>
          <div>
            <span className="text-[10px] text-blue-400 font-bold block">پست الکترونیک رسمی:</span>
            <span className="text-xs font-bold text-white font-mono">support@warroom.ir</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">پاسخگویی زیر ۲۴ ساعت</span>
          </div>
        </div>

        <div className="bg-[#080d22] border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 hover:border-amber-400/60 transition">
          <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40 shrink-0">
            <MessageCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold block">شبکه‌های اجتماعی و پیام‌رسان:</span>
            <span className="text-xs font-bold text-white font-mono">@WarRoom_Support</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">ایتا، روبیکا و بله</span>
          </div>
        </div>

        <div className="bg-[#080d22] border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 hover:border-emerald-400/60 transition">
          <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shrink-0">
            <MapPin size={22} />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold block">نشانی ستاد مرکزی:</span>
            <span className="text-xs font-bold text-white">تهران، خیابان انقلاب، ستاد دانش‌آموزی</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">مرکز ارزیابی و مسابقات</span>
          </div>
        </div>
      </div>

      {/* Direct Customer Message Form */}
      <div className="bg-[#080d22] border border-cyan-500/30 rounded-3xl p-5 md:p-7 space-y-4 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Send className="text-cyan-400" size={20} />
            <h3 className="text-base font-black text-white">فرم ارتباط مستقیم مشتریان و ارسال پیام به ستاد</h3>
          </div>
          <span className="text-xs text-slate-400">پاسخ پیام شما به شماره همراه یا ایمیل درج‌شده ارسال خواهد شد</span>
        </div>

        {isSent ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-emerald-400 animate-bounce" />
            <h4 className="text-base font-black">پیام شما با موفقیت ثبت شد</h4>
            <p className="text-xs text-slate-300">
              با تشکر از ارتباط شما. کارشناسان پشتیبانی ستاد پس از بررسی پیام، در اسرع وقت پاسخ را ارسال خواهند کرد.
            </p>
          </div>
        ) : (
          <form onSubmit={handleGuestSubmit} className="space-y-4 dir-rtl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نام و نام خانوادگی *</label>
                <input 
                  type="text" 
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="مثال: علی محمدی"
                  className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شماره همراه یا ایمیل *</label>
                <input 
                  type="text" 
                  required
                  value={guestContact}
                  onChange={(e) => setGuestContact(e.target.value)}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا info@domain.com"
                  className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موضوع پیام</label>
                <input 
                  type="text" 
                  value={guestSubject}
                  onChange={(e) => setGuestSubject(e.target.value)}
                  placeholder="مثال: سوال درباره ثبت‌نام مسابقات"
                  className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">متن پیام یا توضیحات *</label>
              <textarea 
                rows={4}
                required
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="لطفاً پیام یا سوال خود را با جزئیات کامل بنویسید..."
                className="w-full bg-[#0c1432] border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-xs text-white outline-none transition resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center gap-2"
              >
                <Send size={16} />
                <span>ارسال پیام به کارشناسان ستاد</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logged in Formal Support Ticket Section */}
      {currentUser && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="text-amber-400" size={20} />
                سامانه ثبت و پیگیری تیکت‌های پشتیبانی کاربری
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تیکت‌های اختصاصی شما و پاسخ‌های رسمی تیم داوری و فنی
              </p>
            </div>

            <button
              onClick={() => setShowNewModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>ثبت تیکت جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ticket List */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400">تیکت‌های ثبت‌شده شما:</h4>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {userTickets.map(t => {
                  const isSelected = t.id === selectedTicket?.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`p-3.5 rounded-2xl border text-right cursor-pointer transition ${
                        isSelected 
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                          : 'bg-[#080d22] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-white truncate">{t.subject}</span>
                        {getStatusBadge(t.status)}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{getCategoryLabel(t.type)}</span>
                        <span>{t.created_at}</span>
                      </div>
                    </div>
                  );
                })}

                {userTickets.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    هنوز تیکتی ثبت نکرده‌اید.
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Chat / Detail */}
            <div className="lg:col-span-8 bg-[#080d22] border border-slate-800 rounded-3xl p-5 space-y-4">
              {selectedTicket ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-white">{selectedTicket.subject}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">کد پیگیری: {selectedTicket.id}</p>
                    </div>
                    {getStatusBadge(selectedTicket.status)}
                  </div>

                  {/* Messages list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto p-2 bg-[#050816] rounded-2xl border border-slate-800">
                    <div className="p-3 rounded-2xl bg-[#0c1432] border border-slate-700 text-right space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                        <span>{selectedTicket.user_name} (ارسال اولیه)</span>
                        <span>{selectedTicket.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap">{selectedTicket.message}</p>
                    </div>

                    {currentReplies.map(rep => (
                      <div
                        key={rep.id}
                        className={`p-3 rounded-2xl text-right space-y-1 ${
                          rep.is_admin 
                            ? 'bg-amber-950/30 border border-amber-500/40 mr-4' 
                            : 'bg-[#0c1432] border border-slate-700 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className={rep.is_admin ? 'text-amber-400' : 'text-cyan-400'}>
                            {rep.is_admin ? 'پاسخ ستاد پشتیبانی' : rep.user_name}
                          </span>
                          <span className="text-slate-400">{rep.created_at}</span>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap">{rep.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Send Reply Input */}
                  {selectedTicket.status !== 'closed' && (
                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="ارسال پاسخ جدید به تیکت..."
                        className="flex-1 bg-[#0c1432] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition shrink-0 flex items-center gap-1.5"
                      >
                        <Send size={15} />
                        <span>ارسال</span>
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500">
                  جهت مشاهده جزئیات یا ارسال پاسخ، یک تیکت از لیست انتخاب کنید.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewModal && currentUser && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
          <div className="bg-[#080d22] border border-amber-500/40 rounded-3xl p-4 sm:p-6 max-w-lg w-full dir-rtl space-y-4 shadow-2xl max-h-[85vh] sm:max-h-[88vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">ثبت تیکت جدید در ستاد</h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موضوع تیکت *</label>
                <input 
                  type="text" 
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="عنوان موضوع..."
                  className="w-full bg-[#0c1432] border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی موضوع</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TicketType)}
                  className="w-full bg-[#0c1432] border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="technical">پشتیبانی فنی و سامانه</option>
                  <option value="content">محتوا و آموزه‌ها</option>
                  <option value="judge">داوری و امتیازدهی</option>
                  <option value="other">عمومی و سایر موارد</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شرح پیام *</label>
                <textarea 
                  rows={4}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="جزئیات پیام خود را بنویسید..."
                  className="w-full bg-[#0c1432] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 font-bold text-xs"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs"
                >
                  ثبت و ارسال تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
