import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TransitionSceneProps {
  onComplete: () => void;
}

export const TransitionScene: React.FC<TransitionSceneProps> = ({
  onComplete,
}) => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const completedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const completeLoading = () => {
    setLoadingComplete(true);
  };

  const handleSceneChange = () => {
    if (!loadingComplete || completedRef.current) return;

    completedRef.current = true;
    onComplete();
  };

  const tunnelTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 2.2,
        ease: [0.15, 0.7, 0.2, 1] as const,
        repeat: Infinity,
      };

  const beamTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 1.6,
        ease: "easeInOut" as const,
        repeat: Infinity,
      };

  return (
    <div
      onClick={handleSceneChange}
      className="transition-scene relative min-h-screen w-full overflow-hidden bg-[var(--bg-void)] cursor-pointer select-none"
    >
      {/* --------------------------------
          Ambient Glow
      -------------------------------- */}

      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--amber-halo)] blur-[120px]"
          initial={{
            opacity: shouldReduceMotion ? 0.65 : 0.45,
            scale: shouldReduceMotion ? 1 : 0.8,
          }}
          animate={{
            opacity: shouldReduceMotion ? 0.65 : [0.45, 0.8, 0.45],
            scale: shouldReduceMotion ? 1 : [0.8, 1.15, 0.8],
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />

        <motion.div
          className="absolute left-1/2 top-1/2 h-[15vw] w-[15vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--amber-halo)] blur-[80px]"
          animate={{
            opacity: shouldReduceMotion ? 0.65 : [0.4, 0.75, 0.4],
            scale: shouldReduceMotion ? 1 : [0.85, 1.1, 0.85],
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 1.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      </div>

      {/* --------------------------------
          Warp Tunnel
      -------------------------------- */}

      {/* Warp tunnel */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:1000px]">
        <div className="tunnel -translate-x-[2vw]">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="tunnel-ring"
              initial={{
                opacity: 0,
                scale: 0.05,
              }}
              animate={{
                opacity: shouldReduceMotion ? 0.5 : [0, 0.9, 0],
                scale: shouldReduceMotion ? 1 : [0.05, 13],
              }}
              transition={{
                ...tunnelTransition,
                delay: shouldReduceMotion ? 0 : i * -0.22,
              }}
            />
          ))}
        </div>
      </div>

      {/* --------------------------------
          Radial Light Beams
      -------------------------------- */}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[...Array(32)].map((_, i) => (
          <motion.span
            key={i}
            className="light-beam"
            style={{
              rotate: i * 11.25,
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: shouldReduceMotion ? 0.2 : [0, 0.45, 0],
            }}
            transition={{
              ...beamTransition,
              delay: shouldReduceMotion ? 0 : (i % 8) * 0.08,
            }}
          />
        ))}
      </div>

      {/* --------------------------------
          Scan Lines
      -------------------------------- */}

      <div className="scanlines pointer-events-none absolute inset-0" />

      {/* --------------------------------
          Center Content
      -------------------------------- */}

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <div className="relative overflow-hidden">
          <motion.h2
            className="font-['Syne'] text-3xl font-extrabold uppercase tracking-[0.22em] text-[#F2F0EA] md:text-5xl lg:text-6xl"
            initial={{
              opacity: 0,
              y: 35,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            LET THE MUSIC
          </motion.h2>

          <motion.h2
            className="font-['Syne'] text-3xl font-extrabold uppercase tracking-[0.22em] text-[var(--amber-500)] md:text-5xl lg:text-6xl"
            initial={{
              opacity: 0,
              y: 35,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.9,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            TAKE YOU
          </motion.h2>
        </div>

        {/* Accent */}
        <div className="mt-7 flex items-center gap-3">
          <motion.span
            className="h-px w-10 bg-[var(--amber-500)]/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <motion.span
            className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_#C8FF3D]"
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <motion.span
            className="h-px w-10 bg-[var(--amber-500)]/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className="mt-5 font-mono text-[9px] uppercase tracking-[0.4em] text-[#B5B1A8] md:text-lg"
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            delay: shouldReduceMotion ? 0 : 0.55,
            ease: "easeOut",
          }}
        >
          ENTERING DIGITAL NIGHT WORLD
        </motion.p>

        {/* Loading */}
        <div className="mt-5 h-1 flex items-center justify-center">
          {!loadingComplete ? (
            <div className="mt-8 h-1 w-32 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 2.25,
                  ease: [0.65, 0, 0.35, 1],
                }}
                onAnimationComplete={completeLoading}
              />
            </div>
          ) : (
            <motion.p
              className="mt-2 h-1 text-[9px] uppercase tracking-[0.3em] text-text-muted md:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              CLICK TO ENTER THE WORLD
            </motion.p>
          )}
        </div>
      </div>

      {/* --------------------------------
          Corner UI
      -------------------------------- */}

      <div className="absolute left-6 top-6 z-30 font-[var(--font-tech)] text-[8px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        SYSTEM / 01
      </div>

      <div className="absolute right-6 top-6 z-30 font-[var(--font-tech)] text-[8px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        RX3 / LIVE
      </div>

      {/* --------------------------------
          Static Visual CSS
      -------------------------------- */}

      <style>{`
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
        }

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
        }

        .scanlines {
          opacity: 0.055;

          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(255, 255, 255, 0.12) 4px
          );
        }

        @media (max-width: 768px) {
          .tunnel-ring {
            width: 60px;
            height: 60px;
          }

          .light-beam {
            height: 35vh;
          }
        }
      `}</style>
    </div>
  );
};
