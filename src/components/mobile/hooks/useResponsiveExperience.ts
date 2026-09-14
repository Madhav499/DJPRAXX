import { useState, useEffect } from 'react';

export type MobileTier = 'compact' | 'standard' | 'large' | 'none';

export interface ResponsiveExperience {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  mobileTier: MobileTier;
  isCompactMobile: boolean;
  isStandardMobile: boolean;
  isLargeMobile: boolean;
  isLandscape: boolean;
  isReducedMotion: boolean;
  width: number;
  height: number;
}

export function useResponsiveExperience(): ResponsiveExperience {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      mediaQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;

  // Mobile is active when width < 768px OR mobile landscape mode (height < 500 and width < 900)
  const isMobile = width < 768 || (height < 500 && width < 950);
  const isTablet = !isMobile && width >= 768 && width < 1200;
  const isDesktop = !isMobile && width >= 1200;

  const isLandscape = isMobile && width > height;

  let mobileTier: MobileTier = 'none';
  if (isMobile) {
    if (width < 375) {
      mobileTier = 'compact';
    } else if (width <= 430) {
      mobileTier = 'standard';
    } else {
      mobileTier = 'large';
    }
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    mobileTier,
    isCompactMobile: mobileTier === 'compact',
    isStandardMobile: mobileTier === 'standard',
    isLargeMobile: mobileTier === 'large',
    isLandscape,
    isReducedMotion,
    width,
    height,
  };
}
