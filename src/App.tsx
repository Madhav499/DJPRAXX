import { useState, useEffect, useCallback } from 'react';
import {
  type NavDestination,
  type StoryboardScene,
  NAV_ITEMS,
  getNavCategoryForScene,
} from './types/navigation';
import { StageLightNav } from './components/stageNav/StageLightNav';
import { AudioHUD } from './components/audio/AudioHUD';
import { SceneTimelineScrubber } from './components/navigation/SceneTimelineScrubber';

// All 20 Scenes from Storyboard
import { LoadingScene } from './components/scenes/01_LoadingScene';
import { SoundPermissionScene } from './components/scenes/02_SoundPermissionScene';
import { TransitionScene } from './components/scenes/03_TransitionScene';
import { VoidScene } from './components/scenes/04_VoidScene';
import { EntranceScene } from './components/scenes/05_EntranceScene';
import { MainStageScene } from './components/scenes/06_MainStageScene';
import { InteractiveStageScene } from './components/scenes/07_InteractiveStageScene';
import { ApproachBoothScene } from './components/scenes/08_ApproachBoothScene';
import { InteractiveDJBooth } from './components/scenes/09_InteractiveDJBooth';
import { PraxxRadioScene } from './components/scenes/10_PraxxRadioScene';
import { SoundUniverseScene } from './components/scenes/11_SoundUniverseScene';
import { EventArchiveScene, type EventItem, EVENTS_DATA } from './components/scenes/12_EventArchiveScene';
import { EventDetailScene } from './components/scenes/13_EventDetailScene';
import { BiographyEntranceScene } from './components/scenes/14_BiographyEntranceScene';
import { BiographyChaptersScene } from './components/scenes/15_BiographyChaptersScene';
import { ArtistProfileScene } from './components/scenes/16_ArtistProfileScene';
import { BookingScene } from './components/scenes/17_BookingScene';
import { BookingSuccessScene } from './components/scenes/18_BookingSuccessScene';
import { ExitExperienceScene } from './components/scenes/19_ExitExperienceScene';
import { FinalScreenScene } from './components/scenes/20_FinalScreenScene';

import { useResponsiveExperience } from './components/mobile/hooks/useResponsiveExperience';
import { MobileExperience } from './components/mobile/MobileExperience';

export function App() {
  const { isMobile, isReducedMotion: responsiveReducedMotion } = useResponsiveExperience();

  // Navigation & Scene States
  const [activeNav, setActiveNav] = useState<NavDestination>('stage');
  const [hoveredNav, setHoveredNav] = useState<NavDestination | null>(null);
  const [focusedNav, setFocusedNav] = useState<NavDestination | null>(null);
  const [activeScene, setActiveScene] = useState<StoryboardScene>('01_loading');
  const [pulseTrigger, setPulseTrigger] = useState(0);

  // App Context States
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(EVENTS_DATA[0]);
  const [bookingDetails, setBookingDetails] = useState<{
    name: string;
    eventType: string;
    date: string;
    venue: string;
  }>({
    name: '',
    eventType: 'Wedding',
    date: '',
    venue: '',
  });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle Stage Light Navigation selection (Click on fixture or label)
  const handleSelectNav = useCallback((dest: NavDestination) => {
    setActiveNav(dest);
    setPulseTrigger((prev) => prev + 1);

    // Map to primary scene for that destination
    const targetItem = NAV_ITEMS.find((item) => item.id === dest);
    if (targetItem) {
      setActiveScene(targetItem.sceneTarget);
    }
  }, []);

  // Handle direct scene selection from timeline or scene CTA
  const handleSelectScene = useCallback((scene: StoryboardScene) => {
    setActiveScene(scene);
    const category = getNavCategoryForScene(scene);
    setActiveNav(category);
  }, []);

  const handleTriggerStageFX = () => {
    setPulseTrigger((prev) => prev + 1);
  };

  // Mobile Presentation Layer (Activates only at mobile breakpoints, desktop/tablet untouched)
  if (isMobile) {
    return (
      <MobileExperience
        activeNav={activeNav}
        activeScene={activeScene}
        onSelectNav={handleSelectNav}
        onSelectScene={handleSelectScene}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        bookingDetails={bookingDetails}
        onBookingSuccess={(details) => {
          setBookingDetails(details);
          handleSelectScene('18_booking_success');
        }}
        isReducedMotion={isReducedMotion || responsiveReducedMotion}
      />
    );
  }

  // Whether Stage Light Nav should be visible (Scenes 04 through 20)
  const showStageLightNav = !['01_loading', '02_sound_permission', '03_transition'].includes(
    activeScene
  );

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* 
        STAGE LIGHT NAV (Concept No. 05 from Reference Image 2)
        Suspended lighting truss, 6 physical stage lights, volumetric beams,
        damped spring rotation toward pointer, keyboard accessible, audio-reactive.
      */}
      {showStageLightNav && (
        <StageLightNav
          activeNav={activeNav}
          activeScene={activeScene}
          hoveredNav={hoveredNav}
          focusedNav={focusedNav}
          onHoverNav={setHoveredNav}
          onFocusNav={setFocusedNav}
          onSelectNav={handleSelectNav}
          pulseTrigger={pulseTrigger}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* Main Experience Scene Router (Rendering 20-Scene Journey) */}
      <main className="relative z-20 w-full min-h-screen flex flex-col justify-center">
        {/* 01: LOADING EXPERIENCE */}
        {activeScene === '01_loading' && (
          <LoadingScene onComplete={() => setActiveScene('02_sound_permission')} />
        )}

        {/* 02: SOUND PERMISSION / ENTRY */}
        {activeScene === '02_sound_permission' && (
          <SoundPermissionScene
            onEnter={(_soundEnabled) => {
              setActiveScene('03_transition');
            }}
          />
        )}

        {/* 03: TRANSITION INTO THE WORLD */}
        {activeScene === '03_transition' && (
          <TransitionScene onComplete={() => handleSelectScene('04_void_arrival')} />
        )}

        {/* 04: THE VOID / ARRIVAL */}
        {activeScene === '04_void_arrival' && (
          <VoidScene onNext={() => handleSelectScene('05_entrance')} />
        )}

        {/* 05: THE ENTRANCE */}
        {activeScene === '05_entrance' && (
          <EntranceScene onNext={() => handleSelectScene('06_main_stage')} />
        )}

        {/* 06: MAIN STAGE REVEAL */}
        {activeScene === '06_main_stage' && (
          <MainStageScene onNext={() => handleSelectScene('07_stage_interactive')} />
        )}

        {/* 07: STAGE EXPERIENCE (INTERACTIVE) */}
        {activeScene === '07_stage_interactive' && (
          <InteractiveStageScene
            onNext={() => handleSelectScene('08_approach_booth')}
            onTriggerFX={handleTriggerStageFX}
          />
        )}

        {/* 08: APPROACH TO DJ BOOTH */}
        {activeScene === '08_approach_booth' && (
          <ApproachBoothScene onNext={() => handleSelectScene('09_dj_booth')} />
        )}

        {/* 09: INTERACTIVE DJ BOOTH */}
        {activeScene === '09_dj_booth' && (
          <InteractiveDJBooth onNext={() => handleSelectScene('10_praxx_radio')} />
        )}

        {/* 10: PRAXX RADIO (MUSIC PLAYER) */}
        {activeScene === '10_praxx_radio' && (
          <PraxxRadioScene onNext={() => handleSelectScene('11_sound_universe')} />
        )}

        {/* 11: SOUND UNIVERSE (GENRES) */}
        {activeScene === '11_sound_universe' && (
          <SoundUniverseScene onNext={() => handleSelectScene('12_event_archive')} />
        )}

        {/* 12: EVENT ARCHIVE */}
        {activeScene === '12_event_archive' && (
          <EventArchiveScene
            onSelectEvent={(ev) => {
              setSelectedEvent(ev);
              handleSelectScene('13_event_detail');
            }}
            onNext={() => handleSelectScene('13_event_detail')}
          />
        )}

        {/* 13: EVENT DETAIL */}
        {activeScene === '13_event_detail' && (
          <EventDetailScene
            event={selectedEvent}
            onNext={() => handleSelectScene('14_biography_entrance')}
          />
        )}

        {/* 14: BIOGRAPHY ENTRANCE */}
        {activeScene === '14_biography_entrance' && (
          <BiographyEntranceScene onNext={() => handleSelectScene('15_biography_chapter')} />
        )}

        {/* 15: BIOGRAPHY CHAPTERS */}
        {activeScene === '15_biography_chapter' && (
          <BiographyChaptersScene onNext={() => handleSelectScene('16_artist_profile')} />
        )}

        {/* 16: ARTIST PROFILE (QUICK VIEW) */}
        {activeScene === '16_artist_profile' && (
          <ArtistProfileScene onNext={() => handleSelectScene('17_booking')} />
        )}

        {/* 17: BOOKING SCREEN */}
        {activeScene === '17_booking' && (
          <BookingScene
            onSuccess={(data) => {
              setBookingDetails(data);
              handleSelectScene('18_booking_success');
            }}
          />
        )}

        {/* 18: BOOKING SUCCESS */}
        {activeScene === '18_booking_success' && (
          <BookingSuccessScene
            bookingData={bookingDetails}
            onNext={() => handleSelectScene('19_exit_experience')}
          />
        )}

        {/* 19: EXIT EXPERIENCE */}
        {activeScene === '19_exit_experience' && (
          <ExitExperienceScene onNext={() => handleSelectScene('20_final_screen')} />
        )}

        {/* 20: FINAL SCREEN */}
        {activeScene === '20_final_screen' && (
          <FinalScreenScene onReplay={() => handleSelectScene('04_void_arrival')} />
        )}
      </main>

      {/* Floating DJ Audio HUD with Realtime Visualizer */}
      {showStageLightNav && <AudioHUD />}

      {/* 20-Scene Timeline Quick-Scrubber Dock */}
      {showStageLightNav && (
        <SceneTimelineScrubber
          currentScene={activeScene}
          onSelectScene={handleSelectScene}
        />
      )}
    </div>
  );
}

export default App;
