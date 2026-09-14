import React, { useState } from 'react';
import {
  NAV_ITEMS,
  type NavDestination,
  type NavItem,
} from '../../../types/navigation';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobilePocketRigDetailSceneProps {
  activeNav: NavDestination;
  visitedSections: Set<NavDestination>;
  onSelectNav: (dest: NavDestination) => void;
}

export const MobilePocketRigDetailScene: React.FC<MobilePocketRigDetailSceneProps> = ({
  activeNav,
  visitedSections,
  onSelectNav,
}) => {
  const [hoveredItem, setHoveredItem] = useState<NavDestination | null>(null);

  const handleSelect = (item: NavItem) => {
    AudioEngine.triggerLightPulseSound();
    onSelectNav(item.id);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-black text-center select-none overflow-hidden">
      {/* Background ambient atmospheric glow */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="pt-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
            06 • STAGE LIGHT RIG
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase">
          PRAXX
        </h2>
        <span className="text-[10px] tracking-[0.25em] font-mono text-zinc-400 uppercase">
          NAVIGATE THE EXPERIENCE
        </span>
      </div>

      {/* Vertical Physical Stage Light Truss Assembly (Storyboard 06) */}
      <div className="relative w-full max-w-xs my-auto flex flex-col gap-3 py-4">
        {/* Left vertical metal truss spine */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-amber-500/40 to-transparent pointer-events-none" />

        {NAV_ITEMS.map((item, index) => {
          const isActive = activeNav === item.id;
          const isHovered = hoveredItem === item.id;
          const hasVisited = visitedSections.has(item.id);

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex items-center justify-between w-full p-2.5 rounded-2xl border transition-all duration-300 group focus:outline-none ${
                isActive
                  ? 'bg-zinc-900/90 border-amber-500 shadow-[0_0_25px_rgba(240,124,34,0.35)]'
                  : 'bg-zinc-950/70 border-white/5 hover:border-amber-500/30'
              }`}
            >
              {/* Left: Physical Stage Light Fixture with Beam */}
              <div className="relative flex items-center gap-3">
                {/* Volumetric Beam Projecting from Fixture */}
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-24 h-10 pointer-events-none transition-all duration-300 ${
                    isActive ? 'opacity-90' : isHovered ? 'opacity-50' : 'opacity-0'
                  }`}
                  style={{
                    background:
                      'radial-gradient(ellipse at left, rgba(251,191,36,0.8) 0%, rgba(240,124,34,0.2) 50%, transparent 80%)',
                    filter: 'blur(3px)',
                  }}
                />

                {/* Physical Fixture Housing & Clamp */}
                <div
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                    isActive ? 'scale-105' : 'scale-95'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-amber-500 border-amber-300 shadow-[0_0_18px_#f59e0b]'
                        : hasVisited
                        ? 'bg-zinc-900 border-amber-500/40'
                        : 'bg-zinc-900 border-zinc-700'
                    }`}
                  >
                    {/* Glass Lens */}
                    <div
                      className={`w-4 h-4 rounded-full transition-all ${
                        isActive
                          ? 'bg-white shadow-[0_0_8px_#ffffff]'
                          : hasVisited
                          ? 'bg-amber-400/60'
                          : 'bg-zinc-700'
                      }`}
                    />
                  </div>
                </div>

                {/* Fixture Number */}
                <span className="text-[10px] font-mono text-zinc-500">
                  0{index + 1}
                </span>
              </div>

              {/* Center/Right Destination Label & Description */}
              <div className="flex flex-col items-end text-right pr-2">
                <span
                  className={`text-sm font-extrabold font-['Syne'] tracking-[0.2em] transition-colors ${
                    isActive
                      ? 'text-amber-300 text-glow'
                      : 'text-white group-hover:text-amber-200'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[9px] font-['Space_Grotesk'] text-zinc-400">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="pb-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        DRAG OR TAP THE LIGHTS • CONCEPT #05
      </div>
    </div>
  );
};
