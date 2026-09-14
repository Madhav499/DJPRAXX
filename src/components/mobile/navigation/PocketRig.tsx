import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  NAV_ITEMS,
  type NavDestination,
  type NavItem,
} from '../../../types/navigation';
import { AudioEngine } from '../../../audio/AudioEngine';

interface PocketRigProps {
  activeNav: NavDestination;
  visitedSections: Set<NavDestination>;
  onSelectNav: (dest: NavDestination) => void;
  isReducedMotion?: boolean;
}

export const PocketRig: React.FC<PocketRigProps> = ({
  activeNav,
  visitedSections,
  onSelectNav,
  isReducedMotion = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedNav, setDraggedNav] = useState<NavDestination | null>(null);
  const [tiltAngles, setTiltAngles] = useState<{ [key: string]: number }>({});
  const rigContainerRef = useRef<HTMLDivElement>(null);
  const autoHideTimeoutRef = useRef<number | null>(null);

  // Auto-hide rig after 6 seconds of inactivity
  const resetAutoHide = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      window.clearTimeout(autoHideTimeoutRef.current);
    }
    autoHideTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 6000);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetAutoHide();
    }
    return () => {
      if (autoHideTimeoutRef.current) {
        window.clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [isOpen, resetAutoHide]);

  // Handle horizontal drag across the lights
  const handleTouchMove = (e: React.TouchEvent) => {
    resetAutoHide();
    const touch = e.touches[0];
    if (!rigContainerRef.current) return;

    const rect = rigContainerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const itemWidth = rect.width / NAV_ITEMS.length;
    const index = Math.min(
      NAV_ITEMS.length - 1,
      Math.max(0, Math.floor(x / itemWidth))
    );

    const targetItem = NAV_ITEMS[index];
    if (targetItem && targetItem.id !== draggedNav) {
      setDraggedNav(targetItem.id);
      AudioEngine.triggerLightPulseSound();

      // Dynamic beam tilt based on finger offset relative to fixture center
      const fixtureCenterX = (index + 0.5) * itemWidth;
      const offset = (touch.clientX - (rect.left + fixtureCenterX)) / (itemWidth / 2);
      const angle = Math.max(-25, Math.min(25, offset * 25));

      setTiltAngles((prev) => ({
        ...prev,
        [targetItem.id]: angle,
      }));
    }
  };

  const handleTouchEnd = () => {
    if (draggedNav) {
      onSelectNav(draggedNav);
      AudioEngine.triggerLightPulseSound();
      setDraggedNav(null);
    }
  };

  const handleLightClick = (item: NavItem) => {
    AudioEngine.triggerLightPulseSound();
    onSelectNav(item.id);
    resetAutoHide();
  };

  const currentHighlight = draggedNav || activeNav;

  return (
    <nav
      aria-label="PRAXX Pocket Rig Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none"
    >
      {/* Subtle ambient light indicator when closed */}
      {!isOpen && (
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            setIsOpen(true);
          }}
          className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 py-2 px-5 rounded-full bg-zinc-950/80 border border-amber-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(240,124,34,0.25)] active:scale-95 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Reveal PRAXX Pocket Rig"
        >
          {/* Glowing lens dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-mono text-amber-300 font-bold uppercase">
              POCKET RIG
            </span>
          </div>
          <span className="w-12 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition-colors" />
        </button>
      )}

      {/* Emerged Pocket Rig Console */}
      <div
        className={`pointer-events-auto w-full max-w-md mx-auto px-3 pb-3 transition-transform duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-[120%]'
        }`}
      >
        <div className="relative rounded-2xl bg-zinc-950/95 border border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_25px_rgba(240,124,34,0.2)] backdrop-blur-xl p-3 overflow-hidden">
          {/* Top Truss Rail */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.2em] font-mono text-amber-500 font-bold uppercase">
                PRAXX POCKET RIG
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                CONCEPT #05
              </span>
            </div>

            {/* Active Destination Subtitle */}
            <div className="text-[10px] text-zinc-300 font-['Space_Grotesk'] tracking-wider">
              {NAV_ITEMS.find((n) => n.id === currentHighlight)?.label}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/5 active:scale-95 transition-colors"
              aria-label="Hide Pocket Rig"
            >
              ✕
            </button>
          </div>

          {/* 6 Miniature Physical Stage Fixtures */}
          <div
            ref={rigContainerRef}
            onTouchStart={handleTouchMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="grid grid-cols-6 gap-1 relative py-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              const isTargeted = currentHighlight === item.id;
              const hasVisited = visitedSections.has(item.id);
              const tilt = tiltAngles[item.id] || 0;

              return (
                <button
                  key={`pocket-${item.id}`}
                  onClick={() => handleLightClick(item)}
                  className="relative flex flex-col items-center group py-1 rounded-lg focus:outline-none"
                  aria-label={`Navigate to ${item.label}`}
                  aria-selected={isActive}
                >
                  {/* Volumetric Miniature Light Beam */}
                  <div
                    className={`absolute -top-12 w-8 h-14 pointer-events-none transition-all duration-300 ${
                      isTargeted
                        ? 'opacity-80 scale-100'
                        : hasVisited
                        ? 'opacity-25 scale-75'
                        : 'opacity-0 scale-50'
                    }`}
                    style={{
                      transform: `rotate(${tilt}deg)`,
                      transformOrigin: 'bottom center',
                      background:
                        'radial-gradient(ellipse at bottom, rgba(251,191,36,0.85) 0%, rgba(240,124,34,0.3) 45%, transparent 75%)',
                      filter: 'blur(2px)',
                    }}
                  />

                  {/* Physical Stage Light Fixture Body */}
                  <div
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                      isTargeted ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      transform: isReducedMotion ? undefined : `rotate(${tilt * 0.5}deg)`,
                    }}
                  >
                    {/* Metal housing & yoke mount */}
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isTargeted
                          ? 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 shadow-[0_0_15px_rgba(240,124,34,0.8)]'
                          : hasVisited
                          ? 'bg-zinc-900 border-amber-500/40 shadow-[0_0_6px_rgba(240,124,34,0.2)]'
                          : 'bg-zinc-900 border-zinc-700'
                      }`}
                    >
                      {/* Physical Lens */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                          isTargeted
                            ? 'bg-white shadow-[0_0_8px_#ffffff]'
                            : hasVisited
                            ? 'bg-amber-400/70'
                            : 'bg-zinc-700'
                        }`}
                      />
                    </div>

                    {/* Clamp bracket */}
                    <div className="absolute -top-1.5 w-2 h-1 bg-zinc-600 rounded-xs" />
                  </div>

                  {/* Destination Label */}
                  <span
                    className={`text-[8px] font-mono tracking-wider mt-1 transition-colors ${
                      isTargeted
                        ? 'text-amber-300 font-bold'
                        : hasVisited
                        ? 'text-zinc-300'
                        : 'text-zinc-500'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Secret 2: Residual Light Memory Glow */}
                  {hasVisited && !isTargeted && (
                    <span className="w-1 h-1 rounded-full bg-amber-400/60 mt-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint bar */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5 text-[8px] font-mono text-zinc-500 uppercase">
            <span>DRAG OR TAP THE LIGHTS</span>
            <span className="text-amber-500/70">STAGE LIGHT NAV</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
