import React, { useCallback, useEffect } from 'react';
import { NAV_ITEMS, type NavDestination, type NavItem } from '../../types/navigation';
import { AudioEngine } from '../../audio/AudioEngine';

interface StageLightNavOverlayProps {
  activeNav: NavDestination;
  hoveredNav: NavDestination | null;
  focusedNav: NavDestination | null;
  onHoverNav: (dest: NavDestination | null) => void;
  onFocusNav: (dest: NavDestination | null) => void;
  onSelectNav: (dest: NavDestination) => void;
}

export const StageLightNavOverlay: React.FC<StageLightNavOverlayProps> = ({
  activeNav,
  hoveredNav,
  focusedNav,
  onHoverNav,
  onFocusNav,
  onSelectNav,
}) => {
  // Handle Keyboard Arrow Left/Right and Number keys (1-6)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const currentIndex = NAV_ITEMS.findIndex((item) => item.id === activeNav);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % NAV_ITEMS.length;
        const nextItem = NAV_ITEMS[nextIndex];
        AudioEngine.triggerLightPulseSound();
        onSelectNav(nextItem.id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
        const prevItem = NAV_ITEMS[prevIndex];
        AudioEngine.triggerLightPulseSound();
        onSelectNav(prevItem.id);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (NAV_ITEMS[index]) {
          AudioEngine.triggerLightPulseSound();
          onSelectNav(NAV_ITEMS[index].id);
        }
      }
    },
    [activeNav, onSelectNav]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleItemClick = (item: NavItem) => {
    AudioEngine.triggerLightPulseSound();
    onSelectNav(item.id);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none select-none"
      role="banner"
    >
      {/* Top Truss Architectural Header Band */}
      <div className="w-full mx-auto px-4 md:px-8 pt-3 pb-2 flex items-start justify-between">
        {/* Left Rig Branding - Exactly as Concept 05 */}
        <div className="pointer-events-auto flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] text-amber-500 font-semibold uppercase">
              DJ
            </span>
            <span className="text-sm md:text-base tracking-[0.3em] font-extrabold text-white font-['Syne']">
              PRAXX
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping opacity-75" />
            <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-zinc-400 font-['Space_Grotesk'] uppercase">
              LIGHTS • MUSIC • PEOPLE
            </span>
          </div>
        </div>

        {/* Center: Stage Light Rig & Destination Labels */}
        <nav
          className="pointer-events-auto flex flex-col items-center"
          aria-label="Stage Light Rig Navigation"
        >
          {/* Subtle Truss Bar Accent */}
          <div
            className="hidden md:flex items-center justify-center w-[580px] lg:w-[680px] h-[3px] mb-3 relative rounded-full opacity-60"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(240,124,34,0.4) 50%, rgba(255,255,255,0.02) 100%)',
              boxShadow: '0 0 10px rgba(240,124,34,0.3)',
            }}
          >
            <div className="absolute -top-1 w-full flex justify-around px-4">
              {NAV_ITEMS.map((item) => (
                <div
                  key={`clamp-${item.id}`}
                  className="w-2.5 h-1.5 bg-zinc-700 rounded-sm border border-zinc-500 shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* 6 Stage Light Navigation Elements */}
          <div
            className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-11 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/5 bg-black/40 shadow-2xl"
            role="tablist"
            aria-orientation="horizontal"
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeNav === item.id;
              const isHovered = hoveredNav === item.id;
              const isFocused = focusedNav === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-light-${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={0}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => onHoverNav(item.id)}
                  onMouseLeave={() => onHoverNav(null)}
                  onFocus={() => onFocusNav(item.id)}
                  onBlur={() => onFocusNav(null)}
                  className={`group relative flex flex-col items-center py-2 px-2.5 md:px-3.5 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive ? 'scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Navigate to ${item.label}: ${item.description}`}
                >
                  {/* Visual Stage Light Fixture Representation (Complementing 3D WebGL / Fallback) */}
                  <div className="relative flex flex-col items-center mb-1">
                    {/* Fixture Yoke / Mount */}
                    <div
                      className={`w-3.5 h-2 border-t-2 border-x-2 rounded-t-sm transition-colors duration-300 ${
                        isActive ? 'border-amber-400/90' : isHovered ? 'border-amber-500/70' : 'border-zinc-600/60'
                      }`}
                    />

                    {/* Fixture Cylindrical Housing */}
                    <div
                      className={`relative w-5 h-4 rounded-sm transition-all duration-300 flex items-center justify-center shadow-lg ${
                        isActive
                          ? 'bg-gradient-to-b from-zinc-800 to-zinc-950 border border-amber-500/50 shadow-amber-500/20'
                          : isHovered
                          ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-600'
                          : 'bg-zinc-900 border border-zinc-700/50'
                      }`}
                    >
                      {/* Optical Lens with Core Warm Amber Glow */}
                      <div
                        className={`w-3 h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-amber-100 shadow-[0_0_12px_#ff9933,0_0_24px_#f07c22]'
                            : isHovered || isFocused
                            ? 'bg-amber-200 shadow-[0_0_8px_#ff9933]'
                            : 'bg-zinc-600 opacity-60'
                        }`}
                      />
                    </div>

                    {/* CSS Conical Spotlight Spill (Enhances 3D Beam Depth) */}
                    <div
                      className={`absolute top-5 pointer-events-none transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : isHovered ? 'opacity-70' : 'opacity-0'
                      }`}
                      style={{
                        width: '42px',
                        height: '48px',
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(240, 124, 34, 0.45) 0%, rgba(240, 124, 34, 0.08) 60%, transparent 100%)',
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                        filter: 'blur(2px)',
                      }}
                    />
                  </div>

                  {/* Navigation Destination Label */}
                  <span
                    className={`text-xs md:text-sm tracking-[0.2em] font-semibold transition-all duration-300 font-['Space_Grotesk'] ${
                      isActive
                        ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(240,124,34,0.8)] font-bold'
                        : isHovered || isFocused
                        ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]'
                        : 'text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Keyboard Shortcut badge (Desktop) */}
                  <span className="hidden lg:block text-[8px] tracking-wider text-zinc-600 group-hover:text-zinc-400 mt-0.5 font-mono">
                    [{index + 1}]
                  </span>

                  {/* Floor Spotlight Pool under active label */}
                  {isActive && (
                    <div
                      className="absolute -bottom-1 w-10 h-1.5 rounded-full bg-amber-500/80 shadow-[0_0_12px_#f07c22]"
                      style={{ filter: 'blur(1px)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Destination Subtitle Pill */}
          <div className="mt-1 flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/50 border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-['Space_Grotesk']">
              {NAV_ITEMS.find((n) => n.id === activeNav)?.subtitle}
            </span>
          </div>
        </nav>

        {/* Right Rig Slogan - Exactly as Concept 05 */}
        <div className="pointer-events-auto flex flex-col items-end text-right">
          <span className="text-[10px] md:text-xs tracking-[0.25em] text-zinc-300 font-medium font-['Space_Grotesk'] uppercase">
            A HIGHER STATE
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.25em] text-amber-500 font-bold font-['Space_Grotesk'] uppercase">
            TOGETHER
          </span>
          <div className="w-6 h-[1px] bg-amber-500/60 mt-1" />
        </div>
      </div>
    </header>
  );
};
