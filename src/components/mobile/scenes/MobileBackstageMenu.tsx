import React, { useState } from 'react';
import {
  X,
  Disc,
  Radio,
  Calendar,
  BookOpen,
  Send,
  User,
  Sparkles,
  Eye,
} from 'lucide-react';
import type { NavDestination, StoryboardScene } from '../../../types/navigation';
import { HowlerEngine } from '../../../audio/howlerEngine';

interface MobileBackstageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (dest: NavDestination) => void;
  onSelectScene: (scene: StoryboardScene) => void;
  isSecretBackstageUnlocked?: boolean;
}

export const MobileBackstageMenu: React.FC<MobileBackstageMenuProps> = ({
  isOpen,
  onClose,
  onSelectNav,
  onSelectScene,
  isSecretBackstageUnlocked = false,
}) => {
  const [testSFXActive, setTestSFXActive] = useState(false);

  if (!isOpen) return null;

  const handleDestination = (dest: NavDestination, scene?: StoryboardScene) => {
    HowlerEngine.triggerLightPulseSound();
    onClose();
    if (scene) {
      onSelectScene(scene);
    } else {
      onSelectNav(dest);
    }
  };

  const handleSecretPyro = () => {
    setTestSFXActive(true);
    HowlerEngine.triggerPyroDropSound();
    setTimeout(() => setTestSFXActive(false), 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between p-6 select-none overflow-y-auto animate-fade-in"
      role="dialog"
      aria-label="Backstage Control Menu"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/50 bg-zinc-900 flex items-center justify-center shadow-[0_0_15px_rgba(240,124,34,0.4)]">
            <span className="text-xs font-black font-mono text-amber-400">PRAXX</span>
          </div>
          <div>
            <h2 className="text-sm font-bold font-['Syne'] text-white tracking-widest uppercase">
              DJ PRAXX
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              {isSecretBackstageUnlocked ? 'SECRET BACKSTAGE ACCESS' : 'NAVIGATE EXPERIENCE'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            HowlerEngine.triggerLightPulseSound();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white active:scale-95 transition-transform"
          aria-label="Close Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Secret Diagnostic Notification if unlocked via Long-Press */}
      {isSecretBackstageUnlocked && (
        <div className="my-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>[ SECRET BACKSTAGE CONTROLS UNLOCKED ]</span>
          </div>
          <button
            onClick={handleSecretPyro}
            className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-amber-500 text-black font-bold active:scale-95 transition-transform ${
              testSFXActive ? 'scale-110 ring-2 ring-white' : ''
            }`}
          >
            FIRE PYRO SFX
          </button>
        </div>
      )}

      {/* Main Nav Links (Storyboard 17) */}
      <div className="flex flex-col gap-3 my-auto py-4">
        {[
          {
            id: 'stage',
            label: 'STAGE',
            icon: Disc,
            desc: 'Main Stage Reveal & Crowd Arena',
            action: () => handleDestination('stage', '06_main_stage'),
          },
          {
            id: 'music',
            label: 'MUSIC (RADIO)',
            icon: Radio,
            desc: 'High-Res Vinyl Player & Sessions',
            action: () => handleDestination('music', '10_praxx_radio'),
          },
          {
            id: 'events',
            label: 'EVENTS',
            icon: Calendar,
            desc: 'Moments That Matter Archive',
            action: () => handleDestination('events', '12_event_archive'),
          },
          {
            id: 'story',
            label: 'STORY',
            icon: BookOpen,
            desc: 'Behind The Sound Biography',
            action: () => handleDestination('story', '14_biography_entrance'),
          },
          {
            id: 'book',
            label: 'BOOK',
            icon: Send,
            desc: 'Production Console & Inquiries',
            action: () => handleDestination('book', '17_booking'),
          },
          {
            id: 'artist',
            label: 'ARTIST PROFILE',
            icon: User,
            desc: 'Parth Chavda • Philosophy',
            action: () => handleDestination('more', '16_artist_profile'),
          },
          {
            id: 'universe',
            label: 'SOUND UNIVERSE',
            icon: Sparkles,
            desc: '3D Orbiting Genre Cosmos',
            action: () => handleDestination('music', '11_sound_universe'),
          },
          {
            id: 'exit',
            label: 'EXIT VENUE',
            icon: Eye,
            desc: 'The Night Concludes',
            action: () => handleDestination('more', '19_exit_experience'),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-white/5 hover:border-amber-500/40 hover:bg-zinc-900 active:scale-98 transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-amber-500/20 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold font-['Syne'] text-white group-hover:text-amber-300 tracking-wider">
                    {item.label}
                  </span>
                  <p className="text-[11px] text-zinc-400 font-['Space_Grotesk']">
                    {item.desc}
                  </p>
                </div>
              </div>
              <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-2 text-center">
        <div className="text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase">
          MUSIC • PEOPLE • MOMENTS • FOREVER
        </div>
        <div className="text-[9px] font-mono text-zinc-600">
          DJ PRAXX LIVE PRODUCTION OS • MOBILE PORTAL v2.4
        </div>
      </div>
    </div>
  );
};
