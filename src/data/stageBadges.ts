// نشان‌های تصویری (بج سپر) مراحل سفر — جایگزین آیکون‌های ساده قبلی
// هر iconName مرحله به تصویر بج اختصاصی خودش نگاشت می‌شود.
import stageBadgeStartBoots from '../assets/images/badges/stage_badge_start_boots.jpg';
import stageBadgeKnowledgeBook from '../assets/images/badges/stage_badge_knowledge_book.jpg';
import stageBadgeTacticalShield from '../assets/images/badges/stage_badge_tactical_shield.jpg';
import stageBadgeFirstAid from '../assets/images/badges/stage_badge_first_aid.jpg';
import stageBadgeRifleSquad from '../assets/images/badges/stage_badge_rifle_squad.jpg';
import stageBadgeCrescentMoon from '../assets/images/badges/stage_badge_crescent_moon.jpg';
import stageBadgeStarVictory from '../assets/images/badges/stage_badge_star_victory.jpg';

export const STAGE_BADGES: Record<string, string> = {
  // مرحله ۱ — آغاز مسیر: بستن بوت‌های رزمی پیش از حرکت
  flag: stageBadgeStartBoots,
  // مرحله ۲ — معرفت: کتاب و نور معرفت
  heart: stageBadgeKnowledgeBook,
  // مرحله ۳ — آمادگی: سپر تاکتیکی آینده‌نگر
  shield: stageBadgeTacticalShield,
  // مرحله ۴ — خدمت: جعبه کمک‌های اولیه و امدادرسانی
  service: stageBadgeFirstAid,
  // مرحله ۵ — همراهی: نشان رزم میدانی و هم‌افزایی جوخه‌ای
  users: stageBadgeRifleSquad,
  // مرحله ۶ — زیارت: هلال ماه و میثاق معنوی
  shrine: stageBadgeCrescentMoon,
  // مرحله ۷ — سفیر عشق: ستاره زرین پیروزی
  trophy: stageBadgeStarVictory
};

export function getStageBadge(iconName?: string): string {
  if (iconName && STAGE_BADGES[iconName]) return STAGE_BADGES[iconName];
  return stageBadgeStartBoots;
}
