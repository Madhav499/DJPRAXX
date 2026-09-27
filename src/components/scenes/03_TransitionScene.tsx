import React, { useEffect } from "react";

interface TransitionSceneProps {
  onComplete: () => void;
}

export const TransitionScene: React.FC<TransitionSceneProps> = ({
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="transition-scene relative min-h-screen w-full overflow-hidden bg-[var(--bg-void)] cursor-pointer select-none"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="transition-glow absolute left-1/2 top-1/2 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--amber-halo)] blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[15vw] w-[15vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--amber-halo)] blur-[80px]" />
      </div>

      {/* Warp tunnel */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
        <div className="tunnel">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="tunnel-ring"
              style={{
                animationDelay: `${i * -0.22}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial light beams */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[...Array(32)].map((_, i) => (
          <span
            key={i}
            className="light-beam"
            style={{
              transform: `rotate(${i * 11.25}deg)`,
              animationDelay: `${(i % 8) * 0.08}s`,
            }}
          />
        ))}
      </div>

      {/* Scan lines */}
      <div className="scanlines pointer-events-none absolute inset-0" />

      {/* Center content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <div className="relative overflow-hidden">
          <h2 className="transition-title font-['Syne'] text-3xl font-extrabold uppercase tracking-[0.22em] text-[#F2F0EA] md:text-5xl lg:text-6xl">
            LET THE MUSIC
          </h2>
          <h2 className="transition-title transition-title-delay font-['Syne'] text-3xl font-extrabold uppercase tracking-[0.22em] text-(--amber-500) md:text-5xl lg:text-6xl">
            TAKE YOU
          </h2>
        </div>
        {/* Accent */}
        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-10 bg-(--amber-500)/40" />
          <span className="transition-dot h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_#C8FF3D]" />
          <span className="h-px w-10 bg-(--amber-500)/40" />
        </div>
        <p className="transition-subtitle mt-5 font-mono text-[9px] uppercase tracking-[0.4em] text-[#B5B1A8] md:text-lg">
          ENTERING DIGITAL NIGHT WORLD
        </p>
        {/* Loading indicator */}
        <div className="mt-8 h-1 w-32 overflow-hidden bg-white/10">
          <div className="loading-bar h-full bg-(--amber-500)" />
        </div>
      </div>

      {/* Corner UI */}
      <div className="absolute left-6 top-6 z-30 font-(--font-tech) text-[8px] uppercase tracking-[0.3em] text-(--text-muted)">
        SYSTEM / 01
      </div>

      <div className="absolute right-6 top-6 z-30 font-(--font-tech) text-[8px] uppercase tracking-[0.3em] text-(--text-muted)">
        RX3 / LIVE
      </div>

      <style>{`
        /* --------------------------------
           Tunnel
        -------------------------------- */

        .tunnel {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          transform: rotateX(65deg);
        }

        .tunnel-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 90px;
          height: 90px;
          border: 1px solid var(--amber-glow);
          border-radius: 50%;

          transform: translate(-50%, -50%);

          box-shadow:
            0 0 20px var(--amber-halo),
            inset 0 0 20px var(--amber-halo);

          animation:
            tunnelMove 2.2s cubic-bezier(0.15, 0.7, 0.2, 1)
            infinite;
        }

        @keyframes tunnelMove {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.05);
          }

          15% {
            opacity: 0.9;
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(13);
          }
        }

        /* --------------------------------
           Light beams
        -------------------------------- */

        .light-beam {
          position: absolute;
          width: 1px;
          height: 45vh;

          background: linear-gradient(
            to bottom,
            transparent,
            var(--amber-glow),
            transparent
          );

          transform-origin: center bottom;
          opacity: 0;

          animation:
            beamPulse 1.6s ease-in-out infinite;
        }

        @keyframes beamPulse {
          0%,
          100% {
            opacity: 0;
          }

          50% {
            opacity: 0.45;
          }
        }

        /* --------------------------------
           Ambient glow
        -------------------------------- */

        .transition-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: translate(-50%, -50%) scale(0.8);
          }

          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        /* --------------------------------
           Typography
        -------------------------------- */

        .transition-title {
          opacity: 0;
          transform: translateY(35px);
          filter: blur(12px);

          animation:
            titleReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .transition-title-delay {
          animation-delay: 0.12s;
        }

        @keyframes titleReveal {
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .transition-subtitle {
          opacity: 0;

          animation:
            subtitleReveal 0.8s ease forwards;

          animation-delay: 0.55s;
        }

        @keyframes subtitleReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* --------------------------------
           Loading bar
        -------------------------------- */

        .loading-bar {
          width: 0%;

          animation:
            loading 2.25s cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
        }

        @keyframes loading {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        /* --------------------------------
           Scanlines
        -------------------------------- */

        .scanlines {
          opacity: 0.055;

          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(255, 255, 255, 0.12) 4px
          );
        }

        /* --------------------------------
           Mobile
        -------------------------------- */

        @media (max-width: 768px) {
          .tunnel-ring {
            width: 60px;
            height: 60px;
          }

          .light-beam {
            height: 35vh;
          }
        }

        /* --------------------------------
           Reduced motion
        -------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .tunnel-ring,
          .light-beam,
          .transition-glow,
          .transition-title,
          .transition-subtitle,
          .loading-bar {
            animation: none !important;
          }

          .transition-title {
            opacity: 1;
            transform: none;
            filter: none;
          }

          .transition-subtitle {
            opacity: 1;
          }

          .loading-bar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
