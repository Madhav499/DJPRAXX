import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  type NavDestination,
  type StoryboardScene,
} from '../../types/navigation';
import type { EventItem } from '../scenes/12_EventArchiveScene';
import type { BookingFormData } from './scenes/MobileBookingScene';
import { PocketRig } from './navigation/PocketRig';
import { MobileAudioUI } from './audio/MobileAudioUI';
import { MobileBackstageMenu } from './scenes/MobileBackstageMenu';
import { HowlerEngine } from '../../audio/howlerEngine';

// Mobile Scene Components
import { MobileLoadingScene } from './scenes/MobileLoadingScene';
import { MobileSoundGateScene } from './scenes/MobileSoundGateScene';
import { MobileVoidScene } from './scenes/MobileVoidScene';
import { MobileEntranceScene } from './scenes/MobileEntranceScene';
import { MobileMainStageScene } from './scenes/MobileMainStageScene';
import { MobilePocketRigDetailScene } from './scenes/MobilePocketRigDetailScene';
import { MobileDJBoothScene } from './scenes/MobileDJBoothScene';
import { MobileRadioScene } from './scenes/MobileRadioScene';
import { MobileSoundUniverseScene } from './scenes/MobileSoundUniverseScene';
import { MobileEventArchiveScene } from './scenes/MobileEventArchiveScene';
import { MobileEventDetailScene } from './scenes/MobileEventDetailScene';
import { MobileBiographyEntranceScene } from './scenes/MobileBiographyEntranceScene';
import { MobileBiographyChapterScene } from './scenes/MobileBiographyChapterScene';
import { MobileArtistProfileScene } from './scenes/MobileArtistProfileScene';
import { MobileBookingScene } from './scenes/MobileBookingScene';
import { MobileBookingSuccessScene } from './scenes/MobileBookingSuccessScene';
import { MobileExitScene } from './scenes/MobileExitScene';

interface MobileExperienceProps {
  activeNav: NavDestination;
  activeScene: StoryboardScene;
  onSelectNav: (dest: NavDestination) => void;
  onSelectScene: (scene: StoryboardScene) => void;
  selectedEvent: EventItem;
  onSelectEvent: (ev: EventItem) => void;
  bookingDetails: Partial<BookingFormData>;
  onBookingSuccess: (data: BookingFormData) => void;
  isReducedMotion?: boolean;
}

export const MobileExperience: React.FC<MobileExperienceProps> = ({
  activeNav,
  activeScene,
  onSelectNav,
  onSelectScene,
  selectedEvent,
  onSelectEvent,
  bookingDetails,
  onBookingSuccess,
  isReducedMotion = false,
}) => {
  const [visitedSections, setVisitedSections] = useState<Set<NavDestination>>(
    () => new Set(['stage'])
  );
  const [isBackstageMenuOpen, setIsBackstageMenuOpen] = useState(false);
  const [isSecretBackstageUnlocked, setIsSecretBackstageUnlocked] = useState(false);
  const [showNavConsole, setShowNavConsole] = useState(false);

  // Long press detection on PRAXX logo for Secret 1 — BACKSTAGE MODE
  const longPressTimerRef = useRef<number | null>(null);

  const handleLogoTouchStart = () => {
    longPressTimerRef.current = window.setTimeout(() => {
      setIsSecretBackstageUnlocked(true);
      setIsBackstageMenuOpen(true);
      HowlerEngine.triggerPyroDropSound();
    }, 1200);
  };

  const handleLogoTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Track visited sections for Secret 2: Light Memory
  useEffect(() => {
    setVisitedSections((prev) => {
      const next = new Set(prev);
      next.add(activeNav);
      return next;
    });
  }, [activeNav]);

  const handleNavSelection = useCallback(
    (dest: NavDestination) => {
      setShowNavConsole(false);
      onSelectNav(dest);
    },
    [onSelectNav]
  );

  const showPocketRig = !['01_loading', '02_sound_permission', '03_transition'].includes(
    activeScene
  );

  // Secret 5: Night Depth active when 3+ destinations visited
  const isNightDepthActive = visitedSections.size >= 3;

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Top Mobile Atmospheric Branding Bar */}
      {showPocketRig && (
        <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2 flex items-center justify-between pointer-events-none select-none">
          {/* Logo with Long-Press Secret 1 Backstage Trigger */}
          <div
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
            onMouseDown={handleLogoTouchStart}
            onMouseUp={handleLogoTouchEnd}
            className="pointer-events-auto flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            aria-label="DJ PRAXX - Long press for Backstage Mode"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase">
                  DJ
                </span>
                <span className="text-sm font-black font-['Syne'] text-white tracking-[0.25em]">
                  PRAXX
                </span>
                {isNightDepthActive && (
                  <span
                    title="Night Depth Active"
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-pulse"
                  />
                )}
              </div>
              <span className="text-[8px] font-mono text-zinc-500 tracking-wider">
                {isNightDepthActive ? 'NIGHT DEPTH UNLOCKED' : 'ENTER THE NIGHT'}
              </span>
            </div>
          </div>

          {/* Quick Menu Button to Open Backstage / More Menu */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                HowlerEngine.triggerLightPulseSound();
                setIsBackstageMenuOpen(true);
              }}
              className="p-1.5 px-2.5 rounded-full bg-zinc-950/80 border border-white/10 text-[10px] font-mono text-zinc-300 backdrop-blur-md active:scale-95 transition-all"
              aria-label="Open Backstage Menu"
            >
              MENU
            </button>
          </div>
        </header>
      )}

      {/* Main Experience Screen Canvas */}
      <main className="relative z-20 w-full min-h-screen flex flex-col justify-center">
        {/* Fullscreen Stage Light Rig Detail Console (Screen 06) if requested */}
        {showNavConsole ? (
          <MobilePocketRigDetailScene
            activeNav={activeNav}
            visitedSections={visitedSections}
            onSelectNav={handleNavSelection}
          />
        ) : (
          <>
            {/* 01: LOADING */}
            {activeScene === '01_loading' && (
              <MobileLoadingScene onComplete={() => onSelectScene('02_sound_permission')} />
            )}

            {/* 02: SOUND GATE */}
            {activeScene === '02_sound_permission' && (
              <MobileSoundGateScene onEnter={() => onSelectScene('04_void_arrival')} />
            )}

            {/* 03: TRANSITION */}
            {activeScene === '03_transition' && (
              <MobileVoidScene onNext={() => onSelectScene('04_void_arrival')} />
            )}

            {/* 04: THE VOID / ARRIVAL */}
            {activeScene === '04_void_arrival' && (
              <MobileVoidScene onNext={() => onSelectScene('05_entrance')} />
            )}

            {/* 05: THE ENTRANCE */}
            {activeScene === '05_entrance' && (
              <MobileEntranceScene onNext={() => onSelectScene('06_main_stage')} />
            )}

            {/* 06: MAIN STAGE REVEAL */}
            {activeScene === '06_main_stage' && (
              <MobileMainStageScene onNext={() => onSelectScene('09_dj_booth')} />
            )}

            {/* 07 & 08 & 09: DJ BOOTH */}
            {(activeScene === '07_stage_interactive' ||
              activeScene === '08_approach_booth' ||
              activeScene === '09_dj_booth') && (
              <MobileDJBoothScene onNext={() => onSelectScene('10_praxx_radio')} />
            )}

            {/* 10: PRAXX RADIO */}
            {activeScene === '10_praxx_radio' && (
              <MobileRadioScene onNext={() => onSelectScene('11_sound_universe')} />
            )}

            {/* 11: SOUND UNIVERSE */}
            {activeScene === '11_sound_universe' && (
              <MobileSoundUniverseScene onNext={() => onSelectScene('12_event_archive')} />
            )}

            {/* 12: EVENT ARCHIVE */}
            {activeScene === '12_event_archive' && (
              <MobileEventArchiveScene
                onSelectEvent={(ev) => {
                  onSelectEvent(ev);
                  onSelectScene('13_event_detail');
                }}
                onNext={() => onSelectScene('13_event_detail')}
              />
            )}

            {/* 13: EVENT DETAIL */}
            {activeScene === '13_event_detail' && (
              <MobileEventDetailScene
                event={selectedEvent}
                onNext={() => onSelectScene('14_biography_entrance')}
              />
            )}

            {/* 14: BIOGRAPHY ENTRANCE */}
            {activeScene === '14_biography_entrance' && (
              <MobileBiographyEntranceScene onNext={() => onSelectScene('15_biography_chapter')} />
            )}

            {/* 15: BIOGRAPHY CHAPTERS */}
            {activeScene === '15_biography_chapter' && (
              <MobileBiographyChapterScene onNext={() => onSelectScene('16_artist_profile')} />
            )}

            {/* 16: ARTIST PROFILE */}
            {activeScene === '16_artist_profile' && (
              <MobileArtistProfileScene onNext={() => onSelectScene('17_booking')} />
            )}

            {/* 17: BOOKING */}
            {activeScene === '17_booking' && (
              <MobileBookingScene
                onSuccess={(data) => {
                  onBookingSuccess(data);
                  onSelectScene('18_booking_success');
                }}
              />
            )}

            {/* 18: BOOKING SUCCESS */}
            {activeScene === '18_booking_success' && (
              <MobileBookingSuccessScene
                bookingData={bookingDetails}
                onNext={() => onSelectScene('19_exit_experience')}
              />
            )}

            {/* 19 & 20: EXIT EXPERIENCE */}
            {(activeScene === '19_exit_experience' || activeScene === '20_final_screen') && (
              <MobileExitScene onReplay={() => onSelectScene('04_void_arrival')} />
            )}
          </>
        )}
      </main>

      {/* Floating Audio Controller */}
      {showPocketRig && <MobileAudioUI />}

      {/* PRAXX Pocket Rig (Approved Stage Light Nav Concept #05 Adaptation) */}
      {showPocketRig && (
        <PocketRig
          activeNav={activeNav}
          visitedSections={visitedSections}
          onSelectNav={handleNavSelection}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* Mobile Backstage / More Menu (Screen 17 & Secret 1) */}
      <MobileBackstageMenu
        isOpen={isBackstageMenuOpen}
        onClose={() => setIsBackstageMenuOpen(false)}
        onSelectNav={handleNavSelection}
        onSelectScene={(scene) => {
          setShowNavConsole(false);
          onSelectScene(scene);
        }}
        isSecretBackstageUnlocked={isSecretBackstageUnlocked}
      />
    </div>
  );
};
