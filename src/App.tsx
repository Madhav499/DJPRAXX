import { useState, useEffect, useCallback } from "react";
import {
  type NavDestination,
  type StoryboardScene,
  NAV_ITEMS,
  getNavCategoryForScene,
} from "./types/navigation";
import { StageLightNav } from "./components/stageNav/StageLightNav";
import { AudioHUD } from "./components/audio/AudioHUD";
import { SceneTimelineScrubber } from "./components/navigation/SceneTimelineScrubber";

// All 20 Scenes from Storyboard
import { LoadingScene } from "./components/scenes/01_LoadingScene";
import { SoundPermissionScene } from "./components/scenes/02_SoundPermissionScene";
import { TransitionScene } from "./components/scenes/03_TransitionScene";
import { VoidScene } from "./components/scenes/04_VoidScene";
import { EntranceScene } from "./components/scenes/05_EntranceScene";
import { MainStageScene } from "./components/scenes/06_MainStageScene";
import { InteractiveStageScene } from "./components/scenes/07_InteractiveStageScene";
import { ApproachBoothScene } from "./components/scenes/08_ApproachBoothScene";
import { InteractiveDJBooth } from "./components/scenes/09_InteractiveDJBooth";
import { PraxxRadioScene } from "./components/scenes/10_PraxxRadioScene";
import { SoundUniverseScene } from "./components/scenes/11_SoundUniverseScene";
import {
  EventArchiveScene,
  type EventItem,
  EVENTS_DATA,
} from "./components/scenes/12_EventArchiveScene";
import { EventDetailScene } from "./components/scenes/13_EventDetailScene";
import { BiographyEntranceScene } from "./components/scenes/14_BiographyEntranceScene";
import { BiographyChaptersScene } from "./components/scenes/15_BiographyChaptersScene";
import { ArtistProfileScene } from "./components/scenes/16_ArtistProfileScene";
import { BookingScene } from "./components/scenes/17_BookingScene";
import { BookingSuccessScene } from "./components/scenes/18_BookingSuccessScene";
import { ExitExperienceScene } from "./components/scenes/19_ExitExperienceScene";
import { FinalScreenScene } from "./components/scenes/20_FinalScreenScene";

import { useResponsiveExperience } from "./components/mobile/hooks/useResponsiveExperience";
import { MobileExperience } from "./components/mobile/MobileExperience";

export function App() {
  const { isMobile, isReducedMotion: responsiveReducedMotion } =
    useResponsiveExperience();

  // Navigation & Scene States
  const [activeNav, setActiveNav] = useState<NavDestination>("stage");
  const [hoveredNav, setHoveredNav] = useState<NavDestination | null>(null);
  const [focusedNav, setFocusedNav] = useState<NavDestination | null>(null);
  const [activeScene, setActiveScene] = useState<StoryboardScene>("01_loading");

  // App Context States
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(EVENTS_DATA[0]);
  const [bookingDetails, setBookingDetails] = useState<{
    name: string;
    eventType: string;
    date: string;
    venue: string;
  }>({
    name: "",
    eventType: "Wedding",
    date: "",
    venue: "",
  });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle Stage Light Navigation selection (Click on fixture or label)
  const handleSelectNav = useCallback((dest: NavDestination) => {
    setActiveNav(dest);

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

  const handleTriggerStageFX = useCallback(() => {
    // Trigger visual/lighting effect handler
  }, []);

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
          handleSelectScene("18_booking_success");
        }}
        isReducedMotion={isReducedMotion || responsiveReducedMotion}
      />
    );
  }

  // Whether Stage Light Nav should be visible (Scenes 04 through 20)
  const showStageLightNav = ![
    "01_loading",
    "02_sound_permission",
    "03_transition",
  ].includes(activeScene);

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white overflow-hidden selection:bg-amber-500 selection:text-black">
      {showStageLightNav && (
        <StageLightNav
          activeNav={activeNav}
          hoveredNav={hoveredNav}
          focusedNav={focusedNav}
          onHoverNav={setHoveredNav}
          onFocusNav={setFocusedNav}
          onSelectNav={handleSelectNav}
        />
      )}

      {/* Main Experience Scene Router (Rendering 20-Scene Journey) */}
      <main className="relative z-20 w-full min-h-screen flex flex-col justify-center">
        {activeScene === "01_loading" && (
          <LoadingScene
            onComplete={() => setActiveScene("02_sound_permission")}
          />
        )}

        {activeScene === "02_sound_permission" && (
          <SoundPermissionScene
            onEnter={(_soundEnabled) => {
              setActiveScene("03_transition");
            }}
          />
        )}

        {activeScene === "03_transition" && (
          <TransitionScene
            onComplete={() => handleSelectScene("04_void_arrival")}
          />
        )}

        {activeScene === "04_void_arrival" && (
          <VoidScene onNext={() => handleSelectScene("05_entrance")} />
        )}

        {activeScene === "05_entrance" && (
          <EntranceScene onNext={() => handleSelectScene("06_main_stage")} />
        )}

        {activeScene === "06_main_stage" && (
          <MainStageScene
            onNext={() => handleSelectScene("07_stage_interactive")}
          />
        )}

        {activeScene === "07_stage_interactive" && (
          <InteractiveStageScene
            onNext={() => handleSelectScene("08_approach_booth")}
            onTriggerFX={handleTriggerStageFX}
          />
        )}

        {activeScene === "08_approach_booth" && (
          <ApproachBoothScene onNext={() => handleSelectScene("09_dj_booth")} />
        )}

        {activeScene === "09_dj_booth" && (
          <InteractiveDJBooth
            onNext={() => handleSelectScene("10_praxx_radio")}
          />
        )}

        {activeScene === "10_praxx_radio" && (
          <PraxxRadioScene
            onNext={() => handleSelectScene("11_sound_universe")}
          />
        )}

        {activeScene === "11_sound_universe" && (
          <SoundUniverseScene
            onNext={() => handleSelectScene("12_event_archive")}
          />
        )}

        {activeScene === "12_event_archive" && (
          <EventArchiveScene
            onSelectEvent={(ev) => {
              setSelectedEvent(ev);
              handleSelectScene("13_event_detail");
            }}
            onNext={() => handleSelectScene("13_event_detail")}
          />
        )}

        {activeScene === "13_event_detail" && (
          <EventDetailScene
            event={selectedEvent}
            onNext={() => handleSelectScene("14_biography_entrance")}
          />
        )}

        {activeScene === "14_biography_entrance" && (
          <BiographyEntranceScene
            onNext={() => handleSelectScene("15_biography_chapter")}
          />
        )}

        {activeScene === "15_biography_chapter" && (
          <BiographyChaptersScene
            onNext={() => handleSelectScene("16_artist_profile")}
          />
        )}

        {activeScene === "16_artist_profile" && (
          <ArtistProfileScene onNext={() => handleSelectScene("17_booking")} />
        )}

        {activeScene === "17_booking" && (
          <BookingScene
            onSuccess={(data) => {
              setBookingDetails(data);
              handleSelectScene("18_booking_success");
            }}
          />
        )}

        {activeScene === "18_booking_success" && (
          <BookingSuccessScene
            bookingData={bookingDetails}
            onNext={() => handleSelectScene("19_exit_experience")}
          />
        )}

        {activeScene === "19_exit_experience" && (
          <ExitExperienceScene
            onNext={() => handleSelectScene("20_final_screen")}
          />
        )}

        {activeScene === "20_final_screen" && (
          <FinalScreenScene
            onReplay={() => handleSelectScene("04_void_arrival")}
          />
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
