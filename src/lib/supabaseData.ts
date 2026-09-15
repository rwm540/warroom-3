/**
 * لایه همگام‌سازی داده مستقیم با Supabase — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * کلیه داده‌ها مستقیماً و منحصراً در پایگاه داده ابری Supabase ذخیره
 * و بارگذاری می‌شوند و هیچ داده‌ای در localStorage ذخیره نمی‌شود.
 */
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { supabase, isSupabaseEnabled } from './supabaseClient';

export { isSupabaseEnabled };

/* ------------------------------------------------------------------ */
/* ابزار هش رمز عبور (SHA-256 با Web Crypto)                           */
/* ------------------------------------------------------------------ */
export async function sha256Hex(input: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return input;
  }
}

export const HASH_PATTERN = /^[0-9a-f]{64}$/i;
// Empty string SHA-256 hash (sha256Hex(""))
export const EMPTY_STRING_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

/** حافظه موقت امن برای رمزهای عبور کاربران جهت جلوگیری از پاک‌شدن تصادفی در فرانت‌اند */
export const userPasswordCache = new Map<string, string>();

export function setUserPasswordInCache(userId: string, passwordHash: string): void {
  if (userId && passwordHash && passwordHash !== EMPTY_STRING_HASH) {
    userPasswordCache.set(userId, passwordHash);
  }
}

export function getUserPasswordFromCache(userId: string): string | undefined {
  return userPasswordCache.get(userId);
}

/** نرمال‌سازی ردیف قبل از ارسال به Supabase */
async function normalizeRowForDb(table: string, row: Record<string, any>): Promise<Record<string, any>> {
  if (table === 'warroom_users') {
    const userId = row.id || row.data?.id;
    const rawPass = row?.data?.password;
    let finalPassword = '';

    // ۱. اگر رمز جدید غیرخالی از سمت کاربر/فرم ارسال شده است:
    if (typeof rawPass === 'string' && rawPass.trim().length > 0 && rawPass !== EMPTY_STRING_HASH) {
      const trimmed = rawPass.trim();
      if (HASH_PATTERN.test(trimmed)) {
        finalPassword = trimmed;
      } else {
        finalPassword = await sha256Hex(trimmed);
      }
      if (userId && finalPassword !== EMPTY_STRING_HASH) {
        userPasswordCache.set(userId, finalPassword);
      }
    } 
    // ۲. در غیر این صورت، از کش موجود استفاده کن تا رمز پاک نشود
    else if (userId && userPasswordCache.has(userId)) {
      finalPassword = userPasswordCache.get(userId) || '';
    } 
    // ۳. اگر در کش نبود، بررسی مستقیم دیتابیس برای حفظ رمز قبلی
    else if (isSupabaseEnabled && supabase && userId) {
      try {
        const { data } = await supabase.from('warroom_users').select('data').eq('id', userId).maybeSingle();
        const existingPass = data?.data?.password;
        if (existingPass && existingPass !== EMPTY_STRING_HASH) {
          finalPassword = existingPass;
          userPasswordCache.set(userId, finalPassword);
        }
      } catch {
        // ignore
      }
    }

    return { 
      ...row, 
      data: { 
        ...row.data, 
        password: finalPassword 
      } 
    };
  }
  return row;
}

/* ------------------------------------------------------------------ */
/* هوک ۱: مجموعه‌های موجودیت‌دار — ذخیره و بازیابی مستقیم در Supabase   */
/* ------------------------------------------------------------------ */
export function useSyncedCollection<T extends { id: string }>(options: {
  storageKey?: string;
  table: string;
  initial: T[];
}): [T[], Dispatch<SetStateAction<T[]>>] {
  const { table, initial } = options;

  const [value, setValue] = useState<T[]>(initial);

  const dbLoadedRef = useRef(false);
  const pendingSkipRef = useRef(true);
  const prevRef = useRef<T[]>(value);

  // ۱. بارگذاری اولیه داده‌ها از جدول Supabase
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) {
      dbLoadedRef.current = true;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase!.from(table).select('data');
        if (error) throw error;
        if (cancelled) return;
        const rows = ((data || []) as any[])
          .map(r => (r && typeof r === 'object' && 'data' in r ? (r.data as T) : null))
          .filter((r): r is T => Boolean(r && typeof r === 'object'));
        
        if (rows.length > 0) {
          if (table === 'warroom_users') {
            rows.forEach((r: any) => {
              if (r && r.id && r.password && r.password !== EMPTY_STRING_HASH) {
                userPasswordCache.set(r.id, r.password);
              }
            });
          }
          pendingSkipRef.current = true;
          setValue(rows);
        } else if (table !== 'warroom_users' && initial && initial.length > 0) {
          // اگر جدول خالی بود، داده‌های پیش‌فرض را در Supabase ثبت کن (به‌جز جدول کاربران)
          const rowsToInsert = await Promise.all(
            initial.map(r => normalizeRowForDb(table, { id: r.id, data: r }))
          );
          await supabase!.from(table).upsert(rowsToInsert);
        } else {
          setValue([]);
        }
        dbLoadedRef.current = true;
      } catch (err) {
        console.warn(`[WarRoom Supabase] بارگذاری ${table} ناموفق:`, err);
        dbLoadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table]);

  // ۲. ارسال فوری تغییرات (Upsert / Delete) به Supabase
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;

    if (!isSupabaseEnabled || !supabase) return;
    if (pendingSkipRef.current) {
      pendingSkipRef.current = false;
      return;
    }
    if (!dbLoadedRef.current) return;

    const prevMap = new Map(prev.map(r => [r.id, r]));
    const nextIds = new Set(value.map(r => r.id));

    const changed = value.filter(r => {
      const p = prevMap.get(r.id);
      return !p || JSON.stringify(p) !== JSON.stringify(r);
    });
    const removedIds = prev.filter(r => !nextIds.has(r.id)).map(r => r.id);

    (async () => {
      try {
        if (changed.length > 0) {
          const rows = await Promise.all(
            changed.map(r => normalizeRowForDb(table, { id: r.id, data: r }))
          );
          const { error } = await supabase!.from(table).upsert(rows);
          if (error) console.warn(`[WarRoom Supabase] Upsert ${table} ناموفق:`, error.message);
        }
        if (removedIds.length > 0) {
          const { error } = await supabase!.from(table).delete().in('id', removedIds);
          if (error) console.warn(`[WarRoom Supabase] Delete ${table} ناموفق:`, error.message);
        }
      } catch (err) {
        console.warn(`[WarRoom Supabase] همگام‌سازی ${table} با خطا مواجه شد:`, err);
      }
    })();
  }, [value, table]);

  return [value, setValue];
}

/* ------------------------------------------------------------------ */
/* ذخیره و بازیابی نشان‌شده‌های کاربری (Bookmarks) در Supabase         */
/* ------------------------------------------------------------------ */
const savedPostsTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export function persistSavedPostsToDb(userId: string | undefined, ids?: string[]): void {
  if (!isSupabaseEnabled || !supabase || !userId) return;
  const key = `saved_posts_${userId}`;
  const list = ids || [];
  
  if (savedPostsTimers[key]) clearTimeout(savedPostsTimers[key]);
  savedPostsTimers[key] = setTimeout(() => {
    supabase!
      .from('warroom_kv')
      .upsert({ id: key, value: { postIds: list } })
      .then(({ error }) => {
        if (error) console.warn(`[WarRoom Supabase] همگام‌سازی نشان‌شده‌های ${userId} ناموفق:`, error.message);
      });
  }, 500);
}

export async function loadSavedPostsFromDb(userId: string | undefined): Promise<string[]> {
  if (!isSupabaseEnabled || !supabase || !userId) return [];

  try {
    const { data } = await supabase!
      .from('warroom_kv')
      .select('value')
      .eq('id', `saved_posts_${userId}`)
      .maybeSingle();
    const remote: string[] = Array.isArray((data?.value as any)?.postIds)
      ? ((data!.value as any).postIds as string[])
      : [];
    return remote;
  } catch (err) {
    console.warn('[WarRoom Supabase] بارگذاری ذخیره‌ها از Supabase ناموفق بود:', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* هوک ۲: تنظیمات و مقادیر تکی (ذخیره مستقیم در جدول warroom_kv)       */
/* ------------------------------------------------------------------ */
export function useSyncedSetting<T extends Record<string, any>>(options: {
  storageKey?: string;
  settingKey: string;
  initial: T | (() => T);
}): [T, Dispatch<SetStateAction<T>>] {
  const { settingKey, initial } = options;

  const [value, setValue] = useState<T>(() => {
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  const dbLoadedRef = useRef(false);
  const pendingSkipRef = useRef(true);
  const firstRunRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // بارگذاری اولیه از Supabase (جدول warroom_kv)
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) {
      dbLoadedRef.current = true;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase!
          .from('warroom_kv')
          .select('value')
          .eq('id', settingKey)
          .maybeSingle();
        if (error) throw error;
        if (cancelled) return;
        if (data?.value && typeof data.value === 'object') {
          pendingSkipRef.current = true;
          setValue(prev => ({ ...prev, ...data.value }));
        } else {
          // اگر مقدار در Supabase وجود نداشت، مقدار اولیه را در Supabase ثبت کن
          const initVal = typeof initial === 'function' ? (initial as () => T)() : initial;
          await supabase!.from('warroom_kv').upsert({ id: settingKey, value: initVal });
        }
        dbLoadedRef.current = true;
      } catch (err) {
        console.warn(`[WarRoom Supabase] بارگذاری تنظیم «${settingKey}» از دیتابیس ناموفق بود.`, err);
        dbLoadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [settingKey]);

  // ذخیره مستقیم در Supabase با تاخیر کم
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (pendingSkipRef.current) {
      pendingSkipRef.current = false;
      return;
    }
    if (!isSupabaseEnabled || !supabase) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      supabase!
        .from('warroom_kv')
        .upsert({ id: settingKey, value })
        .then(({ error }) => {
          if (error) console.warn(`[WarRoom Supabase] ذخیره تنظیم «${settingKey}» در دیتابیس ناموفق:`, error.message);
        });
    }, 400);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [value, settingKey]);

  return [value, setValue];
}

