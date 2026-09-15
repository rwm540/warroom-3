import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { 
  battleMusicSynth, 
  getAudioContext,
  DEFAULT_SOUNDTRACKS 
} from '../utils/epicBgmEngine';
import { SoundtrackItem } from '../types';

/**
 * BackgroundMusic Component
 * 
 * Provides:
 * 1. Autonomous single-stream background playback
 * 2. User-controlled tactile audio toggle button (mute / unmute)
 *    requested by the user so visitors can mute/unmute at any moment.
 */
export default function BackgroundMusic() {
  const hasStartedRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    return localStorage.getItem('warroom_music_enabled') !== 'false';
  });

  useEffect(() => {
    // 1. Enable background audio by default only if user hasn't explicitly set a preference
    if (localStorage.getItem('warroom_music_enabled') === null) {
      localStorage.setItem('warroom_music_enabled', 'true');
    }

    // 2. Set default playback mode to 'random' if not already configured
    const currentMode = battleMusicSynth.getPlaybackMode();
    if (!currentMode) {
      battleMusicSynth.setPlaybackMode('random');
    }

    // 3. Set a comfortable ambient volume (35%)
    battleMusicSynth.setVolume(0.35);

    // 4. Function to start audio smoothly - strictly single stream
    const startAutonomousAudio = () => {
      const isMutedByUser = localStorage.getItem('warroom_music_enabled') === 'false';
      if (isMutedByUser) {
        setIsPlaying(false);
        return;
      }

      if (battleMusicSynth.getIsRunning()) {
        setIsPlaying(true);
        return;
      }

      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      battleMusicSynth.start();
      hasStartedRef.current = true;
      setIsPlaying(true);
    };

    // 5. Try to auto-start immediately if not muted
    startAutonomousAudio();

    // 6. Global interaction listeners to unlock browser autoplay policies on first gesture
    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('scroll', handleUserGesture);
    };

    const handleUserGesture = () => {
      const isMutedByUser = localStorage.getItem('warroom_music_enabled') === 'false';
      if (isMutedByUser) {
        removeGestureListeners();
        return;
      }
      startAutonomousAudio();
      if (battleMusicSynth.getIsRunning()) {
        setIsPlaying(true);
        removeGestureListeners();
      }
    };

    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('touchstart', handleUserGesture, { passive: true });
    window.addEventListener('click', handleUserGesture, { passive: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true });
    window.addEventListener('scroll', handleUserGesture, { passive: true });

    // 7. Listen for state changes dispatched by battleMusicSynth
    const handleStateChanged = (e: any) => {
      if (e.detail && typeof e.detail.isRunning === 'boolean') {
        setIsPlaying(e.detail.isRunning);
      }
    };
    window.addEventListener('warroom_music_state_changed' as any, handleStateChanged);

    // 8. Listen for Admin updates in the background
    const handleTracksUpdated = (e: CustomEvent<SoundtrackItem[]>) => {
      const isMutedByUser = localStorage.getItem('warroom_music_enabled') === 'false';
      if (!isMutedByUser && e.detail && e.detail.length > 0 && !battleMusicSynth.getIsRunning()) {
        startAutonomousAudio();
      }
    };
    window.addEventListener('warroom_soundtracks_updated' as any, handleTracksUpdated);

    return () => {
      removeGestureListeners();
      window.removeEventListener('warroom_music_state_changed' as any, handleStateChanged);
      window.removeEventListener('warroom_soundtracks_updated' as any, handleTracksUpdated);
    };
  }, []);

  const handleToggleSound = () => {
    if (isPlaying) {
      battleMusicSynth.stop();
      localStorage.setItem('warroom_music_enabled', 'false');
      setIsPlaying(false);
    } else {
      localStorage.setItem('warroom_music_enabled', 'true');
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      battleMusicSynth.start();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      id="tactical-bgm-controller"
      className="fixed bottom-20 md:bottom-5 left-3 md:left-5 z-40 select-none print:hidden pointer-events-auto"
    >
      <button
        id="btn-toggle-bgm-sound"
        type="button"
        onClick={handleToggleSound}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border shadow-xl transition-all duration-300 ${
          isPlaying 
            ? 'bg-[#081226]/90 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            : 'bg-[#0b0f1a]/85 border-slate-800 hover:border-slate-700 text-slate-400 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
        }`}
        title={isPlaying ? 'قطع صدای پس‌زمینه سایت' : 'پخش موسیقی پس‌زمینه'}
        aria-label={isPlaying ? 'قطع صدا' : 'وصل صدا'}
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <>
              <Volume2 size={16} className="text-emerald-400 animate-pulse" />
              {/* Equalizer animation mini bars */}
              <div className="flex items-end gap-0.5 mr-1.5 h-3">
                <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            </>
          ) : (
            <VolumeX size={16} className="text-rose-400/80" />
          )}
        </div>

        <span className="text-[11px] font-bold tracking-tight">
          {isPlaying ? (
            <span className="text-emerald-300">موسیقی: <strong className="text-emerald-400 font-mono">روشن</strong></span>
          ) : (
            <span className="text-slate-400">موسیقی: <strong className="text-rose-400/90 font-mono">خاموش</strong></span>
          )}
        </span>
      </button>
    </div>
  );
}
