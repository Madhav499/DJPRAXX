import React from 'react';
import type { NavDestination, StoryboardScene } from '../../types/navigation';
import { StageLightNavOverlay } from './StageLightNavOverlay';
import { WebGLWorld } from '../venue/WebGLWorld';

interface StageLightNavProps {
  activeNav: NavDestination;
  activeScene: StoryboardScene;
  hoveredNav: NavDestination | null;
  focusedNav: NavDestination | null;
  onHoverNav: (dest: NavDestination | null) => void;
  onFocusNav: (dest: NavDestination | null) => void;
  onSelectNav: (dest: NavDestination) => void;
  pulseTrigger: number;
  isReducedMotion: boolean;
}

export const StageLightNav: React.FC<StageLightNavProps> = ({
  activeNav,
  activeScene,
  hoveredNav,
  focusedNav,
  onHoverNav,
  onFocusNav,
  onSelectNav,
  pulseTrigger,
  isReducedMotion,
}) => {
  return (
    <>
      {/* 3D Suspended Rig & Volumetric Spotlights */}
      <WebGLWorld
        activeNav={activeNav}
        activeScene={activeScene}
        hoveredNav={hoveredNav}
        focusedNav={focusedNav}
        onSelectNav={onSelectNav}
        pulseTrigger={pulseTrigger}
        isReducedMotion={isReducedMotion}
      />

      {/* Semantic Accessibility & Visual Lighting Truss Overlay */}
      <StageLightNavOverlay
        activeNav={activeNav}
        hoveredNav={hoveredNav}
        focusedNav={focusedNav}
        onHoverNav={onHoverNav}
        onFocusNav={onFocusNav}
        onSelectNav={onSelectNav}
      />
    </>
  );
};
