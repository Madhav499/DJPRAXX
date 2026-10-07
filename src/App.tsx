import { useEffect, useState, useCallback } from "react";
import { preloadImages } from "./utils/preloadImages";

import { type NavDestination, NAV_ITEMS } from "./types/navigation";

import {
  type EventItem,
  EVENTS_DATA,
} from "./components/scenes/10_11_Event_Archive";

import { StageLightNav } from "./components/stageNav/StageLightNav";
import { AudioHUD } from "./components/audio/AudioHUD";
import { SceneTimelineScrubber } from "./components/navigation/SceneTimelineScrubber";

// import { useResponsiveExperience } from "./components/mobile/hooks/useResponsiveExperience";
// import { MobileExperience } from "./components/mobile/MobileExperience";

import SceneLayer from "./components/layers/SceneLayer";
import UILayer from "./components/layers/UILayer";
import CanvasLayer from "./components/layers/CanvasLayer";

import { SceneProvider, useScene } from "./context/SceneContext";

const experienceImages = [
  "./assets/images/JogWheel.png",
  "./assets/images/profile/profilePic.png",
  "./assets/images/sceneImages/03_entrance.webp",
  "./assets/images/sceneImages/04_entrance_tunnel.webp",
  "./assets/images/sceneImages/05_audience.webp",
  "./assets/images/sceneImages/06_Main_Stage_Reveal.webp",
  "./assets/images/sceneImages/07_Interactive_DJ_Booth.webp",
  "./assets/images/sceneImages/10_Event_Archive.webp",
  "./assets/images/sceneImages/12_Biography_Entrance.webp",
  "./assets/images/sceneImages/13_Biography_Chapters.webp",
  "./assets/images/sceneImages/17_Exit_Experience.webp",
  "./assets/images/sceneImages/18_Final_Screen.webp",
  "./assets/images/sceneImages/Music_Scene.webp",
];

function AppContent() {
  // const { isMobile, isReducedMotion: responsiveReducedMotion } =
  //   useResponsiveExperience();

  /**
   * Scene state now comes from Context.
   */
  const { activeScene, activeNav, setActiveScene, handleSelectScene } =
    useScene();

  // Navigation UI States
  const [hoveredNav, setHoveredNav] = useState<NavDestination | null>(null);

  const [focusedNav, setFocusedNav] = useState<NavDestination | null>(null);

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

  useEffect(() => {
    preloadImages(experienceImages);
  }, []);

  // const [isReducedMotion, setIsReducedMotion] = useState(false);

  /**
   * Detect OS reduced motion preference.
   */
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  //   setIsReducedMotion(mediaQuery.matches);

  //   const handler = (e: MediaQueryListEvent) => {
  //     setIsReducedMotion(e.matches);
  //   };

  //   mediaQuery.addEventListener("change", handler);

  //   return () => {
  //     mediaQuery.removeEventListener("change", handler);
  //   };
  // }, []);

  /**
   * Stage Light Navigation
   */
  const handleSelectNav = useCallback(
    (dest: NavDestination) => {
      const targetItem = NAV_ITEMS.find((item) => item.id === dest);

      if (!targetItem) return;

      /**
       * Context automatically:
       *
       * 1. changes activeScene
       * 2. updates activeNav
       * 3. updates URL
       */
      handleSelectScene(targetItem.sceneTarget);
    },
    [handleSelectScene],
  );

  /**
   * Mobile layout
   */
  // if (isMobile) {
  //   return (
  //     <MobileExperience
  //       activeNav={activeNav}
  //       activeScene={activeScene}
  //       onSelectNav={handleSelectNav}
  //       onSelectScene={handleSelectScene}
  //       selectedEvent={selectedEvent}
  //       onSelectEvent={setSelectedEvent}
  //       bookingDetails={bookingDetails}
  //       onBookingSuccess={(details) => {
  //         setBookingDetails(details);

  //         handleSelectScene("18_booking_success");
  //       }}
  //       isReducedMotion={isReducedMotion || responsiveReducedMotion}
  //     />
  //   );
  // }

  /**
   * Stage light navigation starts after
   * intro scenes.
   */
  const showStageLightNav = !["01_loading", "02_transition"].includes(
    activeScene,
  );

  return (
    <div
      className="
      relative
      min-h-screen
      w-full
      bg-[#050508]
      text-white
      overflow-hidden
      selection:bg-amber-500
      selection:text-black
    "
    >
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

      {/* Main 20-scene experience */}
      <SceneLayer
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        handleSelectScene={handleSelectScene}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
      />

      <CanvasLayer activeScene={activeScene} />

      <UILayer
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
      />

      {/* DJ Audio HUD */}
      {showStageLightNav && <AudioHUD />}

      {/* Scene Timeline */}
      {showStageLightNav && (
        <SceneTimelineScrubber
          currentScene={activeScene}
          onSelectScene={handleSelectScene}
        />
      )}
    </div>
  );
}

/**
 * Context provider wraps the application.
 */
export function App() {
  return (
    <SceneProvider>
      <AppContent />
    </SceneProvider>
  );
}

export default App;
