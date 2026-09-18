import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * نسخه ساختار داده (Storage Schema Version)
 * ---------------------------------------------------------------
 * در صورت تغییر مدل داده یا پاک‌سازی داده‌های نمونه، این نسخه باید
 * افزایش یابد تا داده‌های قدیمی و خراب localStorage به‌صورت یک‌باره
 * حذف شده و همه مرورگرها با داده تازه شروع کنند.
 */
const WARROOM_SCHEMA_VERSION = 'v4-supabase-pure-auth';

// پاک‌سازی قطعی و بدون بازگشت هرگونه کلید قدیمی مربوط به کاربران از localStorage
const OBSOLETE_USER_KEYS = [
  'warroom_users',
  'users',
  'registeredUsers',
  'registrationData',
  'warroom_registered_users',
  'warroom_all_users',
  'warroom_users_cache'
];

(function cleanupObsoleteUserData() {
  try {
    OBSOLETE_USER_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    if (localStorage.getItem('warroom_schema_version') !== WARROOM_SCHEMA_VERSION) {
      const keysToRemove = Object.keys(localStorage).filter(
        (k) => k === 'warroom_users' || k === 'warroom_users_cache'
      );
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('warroom_schema_version', WARROOM_SCHEMA_VERSION);
      console.info('[WarRoom] داده‌های محلی کاربران پاک‌سازی شد — پایگاه داده ابری Supabase تنها منبع داده است.');
    }
  } catch (e) {
    console.warn('[WarRoom] Storage migration skipped:', e);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
