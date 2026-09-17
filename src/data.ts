import { User, Group, Mission, MissionSubmission, Training, Medal, UserMedal, SupportTicket, SupportReply, Announcement, News, AppNotification } from './types';

/**
 * داده‌های اولیه سامانه — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * ✅ تمام داده‌های پیش‌فرض/نمونه حذف شده‌اند.
 * 🛡️ هیچ «رمز عبوری» در کد یا حافظه مرورگر ذخیره نمی‌شود (نه متن ساده و نه هش).
 *    اعتبارنامه‌ها فقط روی سرور (بک‌اند امن) با هش scrypt نگه‌داری می‌شوند و
 *    تنها حساب مدیر کل توسط بک‌اند ساخته می‌شود؛ رمز نخستین ورود از متغیر
 *    محیطی WARROOM_ADMIN_INITIAL_PASSWORD تعیین و تغییر آن اجباری است.
 */
export const initialUsers: User[] = [];

export const initialGroups: Group[] = [];

export const initialMissions: Mission[] = [];

export const initialSubmissions: MissionSubmission[] = [];

export const initialTrainings: Training[] = [];

export const initialMedals: Medal[] = [];

export const initialUserMedals: UserMedal[] = [];

export const initialSupportTickets: SupportTicket[] = [];

export const initialSupportReplies: SupportReply[] = [];

export const initialAnnouncements: Announcement[] = [];

export const initialNews: News[] = [];

export const initialNotifications: AppNotification[] = [];
