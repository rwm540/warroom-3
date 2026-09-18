/**
 * اس‌یوپیابیس (Supabase) کلاینت — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * این ماژول کلاینت Supabase را به صورت Lazy از متغیرهای محیطی
 * (.env) می‌سازد. اگر متغیرها تنظیم نشده باشند، برنامه به صورت
 * کامل در «حالت محلی» (localStorage) اجرا می‌شود.
 *
 * متغیرهای محیطی (فایل .env):
 *    VITE_SUPABASE_URL=https://<project-ref>.supabase.co
 *    VITE_SUPABASE_PUBLIC_KEY=<کلید عمومی فرمت جدید sb_publishable_...>  (اولویت اول)
 *    VITE_SUPABASE_ANON_KEY=<کلید anon فرمت قدیم JWT>                    (پشتیبان)
 *
 * سپس اسکریپت Query.sql (و/یا supabase/schema.sql) را در SQL Editor
 * پروژه Supabase خود اجرا کنید.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = 'https://dewfcjxlfolwvxqofocc.supabase.co';
const defaultPublishableKey = 'sb_publishable_lKVXnauR3xtIlsqmKWuVog_HOtRK97j';
const runtimeEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;

const supabaseUrl = runtimeEnv?.VITE_SUPABASE_URL?.trim() || defaultUrl;
const supabasePublishableKey = runtimeEnv?.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
const supabasePublicKey = runtimeEnv?.VITE_SUPABASE_PUBLIC_KEY?.trim();
const supabaseAnonKey = runtimeEnv?.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * انتخاب کلید فعال:
 *  ۱) کلیدهای محیطی VITE_SUPABASE_PUBLISHABLE_KEY یا VITE_SUPABASE_PUBLIC_KEY
 *  ۲) کلید پیش‌فرض مشخص‌شده در پروژه اتاق جنگ
 *  ۳) کلید anon فرمت قدیم
 */
function pickActiveKey(): string {
  const candidate = supabasePublishableKey || supabasePublicKey;
  if (candidate && /^sb_(publishable|secret)_[A-Za-z0-9_-]{10,}$/.test(candidate)) {
    return candidate;
  }
  if (supabaseAnonKey) {
    const parts = supabaseAnonKey.split('.');
    if (parts.length === 3 && parts[2].length >= 20) {
      return supabaseAnonKey;
    }
  }
  return candidate || defaultPublishableKey;
}

const activeKey = pickActiveKey();

/** آیا اتصال به Supabase پیکربندی شده است؟ */
export const isSupabaseEnabled = Boolean(
  supabaseUrl &&
  activeKey &&
  supabaseUrl.startsWith('http') &&
  activeKey.length > 20
);

/** توضیح کلید فعال (برای عیب‌یابی در کنسول) */
export const supabaseKeyInfo = (() => {
  if (isSupabaseEnabled) {
    return activeKey.startsWith('sb_')
      ? 'Publishable Key (فرمت جدید)'
      : 'Anon Key (فرمت JWT)';
  }
  return '— (حالت محلی)';
})();

/** کلاینت سراسری Supabase (در حالت محلی null است) */
export const supabase: SupabaseClient | null = (() => {
  if (!isSupabaseEnabled) return null;
  try {
    const client = createClient(supabaseUrl!, activeKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.info(
      `%c[WarRoom ➜ Supabase] متصل شد به: ${supabaseUrl} | کلید: ${supabaseKeyInfo}`,
      'color:#22d3ee;font-weight:bold'
    );
    return client;
  } catch (err) {
    console.error('[WarRoom] خطا در ساخت کلاینت Supabase:', err);
    return null;
  }
})();

/**
 * صحت‌سنجی زنده اتصال (Health Check):
 * یک Select سبک روی جدول warroom_kv انجام می‌دهد.
 * در صورت خطای احراز هویت (کلید نامعتبر)، پیام رگبارنده چاپ می‌کند.
 */
export async function checkSupabaseHealth(): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { ok: false, message: 'Supabase پیکربندی نشده است — حالت محلی (localStorage).' };
  }
  try {
    const { error } = await supabase.from('warroom_kv').select('id').limit(1);
    if (error) {
      // ۴۰۱ = کلید نامعتبر / ۴۰۴ = جدول‌ها ساخته نشده‌اند (Query.sql اجرا نشده)
      const hint = error.code === '42P01'
        ? ' ⚠️ جدول‌ها وجود ندارند — فایل Query.sql را در SQL Editor Supabase اجرا کنید.'
        : error.message?.includes('JWT') || error.code?.startsWith('401')
          ? ' ⚠️ کلید API نامعتبر است — کلیدها را از Project Settings → API بررسی کنید.'
          : '';
      console.warn(`[WarRoom ➜ Supabase] Health Check ناموفق: ${error.message}.${hint}`, error);
      return { ok: false, message: error.message + hint };
    }
    console.info('%c[WarRoom ➜ Supabase] Health Check موفق — دیتابیس در دسترس است.', 'color:#34d399;font-weight:bold');
    return { ok: true, message: 'دیتابیس Supabase متصل و در دسترس است.' };
  } catch (err: any) {
    console.warn('[WarRoom ➜ Supabase] Health Check با خطا مواجه شد:', err);
    return { ok: false, message: err?.message || 'خطای شبکه' };
  }
}

/** نام باکت Storage برای رسانه‌ها (آواتار، فایل مأموریت‌ها و ...) */
export const WARROOM_STORAGE_BUCKET = 'warroom-media';

/**
 * آپلود فایل به باکت Storage و برگرداندن URL عمومی آن.
 * (برای تصاویر/ویدیوهای ویترین، بنرهای مأموریت و ...)
 */
export async function uploadToStorage(
  path: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
): Promise<{ publicUrl: string; path: string } | null> {
  if (!supabase) return null;
  const safePath = path.replace(/^\/+/, '');
  const { error } = await supabase.storage
    .from(WARROOM_STORAGE_BUCKET)
    .upload(safePath, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert ?? true,
      contentType: file.type || undefined
    });
  if (error) {
    console.warn('[WarRoom] آپلود فایل به Supabase Storage ناموفق بود:', error.message);
    return null;
  }
  const { data } = supabase.storage.from(WARROOM_STORAGE_BUCKET).getPublicUrl(safePath);
  return { publicUrl: data.publicUrl, path: safePath };
}

/** ساخت URL عمومی یک فایل موجود در باکت */
export function getStoragePublicUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  const base = (supabaseUrl || '').replace(/\/+$/, '');
  return `${base}/storage/v1/object/public/${WARROOM_STORAGE_BUCKET}/${clean}`;
}
