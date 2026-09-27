import React, { useEffect, useState } from "react";
import jogWheel from "../../assets/images/JogWheel.png";

interface LoadingSceneProps {
  onComplete: () => void;
}

export const LoadingScene: React.FC<LoadingSceneProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }

        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + jump);
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white select-none">
      {/* Central ambient glow */}
      <div
        className="
        pointer-events-none
        absolute left-1/2 top-[42%]
        -translate-x-1/2 -translate-y-1/2
        size-137
        rounded-full
        bg-orange-500/[0.07]
        blur-[100px]
      "
      />

      {/* Main content */}
      <main
        className="
        relative z-10
        min-h-screen
        flex flex-col
        items-center
        justify-center
        px-6
        pt-10
      "
      >
        {/* Visual */}
        <div
          className="
          relative
          w-full max-w-250
          h-105
          flex items-center justify-center
        "
        >
          {/* Waveform */}
          <svg
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            className="
              absolute
              left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              w-full h-65
              pointer-events-none
            "
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f97316" stopOpacity="0" />

                <stop offset="0.18" stopColor="#f97316" stopOpacity="0.8" />

                <stop offset="0.5" stopColor="#fb923c" />

                <stop offset="0.82" stopColor="#f97316" stopOpacity="0.8" />

                <stop offset="1" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Main waveform */}
            <path
              className="loading-wave"
              d="
                M0 150
                C35 150 45 132 75 140
                C105 148 115 168 145 157
                C175 146 185 118 215 136
                C245 154 255 181 285 161
                C315 141 325 113 355 135
                C385 157 395 185 425 157
                C455 129 465 112 495 137
                C525 162 535 182 565 150
                C595 118 605 116 635 145
                C665 174 675 166 705 150
                C735 134 745 113 775 136
                C805 159 815 181 845 157
                C875 133 885 119 915 138
                C945 157 955 170 985 154
                C1015 138 1025 120 1055 137
                C1085 154 1100 150 1200 150
              "
              fill="none"
              stroke="url(#wave)"
              strokeWidth="2.2"
              filter="url(#glow)"
            />

            {/* Secondary thin wave */}
            <path
              className="loading-wave-secondary"
              d="
                M0 150
                C80 140 100 160 170 150
                C240 140 260 160 330 150
                C400 140 420 160 490 150
                C560 140 580 160 650 150
                C720 140 740 160 810 150
                C880 140 900 160 970 150
                C1040 140 1080 160 1200 150
              "
              fill="none"
              stroke="#f97316"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Frequency bars */}
            <g className="loading-bars">
              {/* Left */}
              <line x1="170" y1="130" x2="170" y2="170" />
              <line x1="185" y1="110" x2="185" y2="190" />
              <line x1="200" y1="140" x2="200" y2="160" />
              <line x1="215" y1="95" x2="215" y2="205" />
              <line x1="230" y1="120" x2="230" y2="180" />

              {/* Right */}
              <line x1="970" y1="120" x2="970" y2="180" />
              <line x1="985" y1="95" x2="985" y2="205" />
              <line x1="1000" y1="140" x2="1000" y2="160" />
              <line x1="1015" y1="110" x2="1015" y2="190" />
              <line x1="1030" y1="130" x2="1030" y2="170" />
            </g>
          </svg>

          {/* Jog Wheel */}
          <div
            className="
            relative z-10
            flex items-center justify-center
          "
          >
            <div
              className="
              absolute
              size-83
              rounded-full
              bg-orange-500/12
              blur-[55px]
              animate-ping
            "
            />

            <img
              src={jogWheel}
              alt="DJ Jog Wheel"
              className="
                relative
                w-[320px]
                sm:w-90
                md:w-100
                h-auto
                object-contain
                drop-shadow-[0_0_25px_rgba(249,115,22,0.25)]
                animate-spin
                [animation-duration:8s]
                [animation-timing-function:linear]
              "
            />
          </div>

          {/* PRAXX */}
          <div
            className="
            absolute
            z-20
            left-1/2
            top-[64%]
            -translate-x-1/2
            whitespace-nowrap
          "
          >
            <h1
              className="
              text-4xl
              sm:text-5xl
              md:text-6xl
              font-medium
              tracking-[0.25em]
              text-white
              [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]
            "
            >
              PR<span className="text-orange-500">A</span>XX
            </h1>
          </div>
        </div>

        {/* Loading section */}
        <div
          className="
          relative
          z-20
          w-full
          max-w-130
          -mt-2
          flex
          flex-col
          items-center
        "
        >
          <span
            className="
            mb-4
            text-[11px]
            sm:text-xs
            tracking-[0.35em]
            text-orange-400
            font-mono
          "
          >
            INITIALIZING NIGHT...
          </span>

          {/* Progress bar */}
          <div
            className="
            w-full
            h-1.25
            rounded-full
            bg-zinc-900
            border border-white/10
            overflow-hidden
          "
          >
            <div
              className="
                h-full
                rounded-full
                bg-linear-to-r
                from-orange-700
                via-orange-500
                to-orange-300
                shadow-[0_0_12px_rgba(249,115,22,0.8)]
                transition-[width]
                duration-200
              "
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className="
            mt-3
            w-full
            flex
            justify-between
            text-[9px]
            sm:text-[10px]
            font-mono
            tracking-wide
          "
          >
            <span className="text-zinc-500">LOADING ASSETS</span>

            <span className="text-orange-400 font-semibold">{progress}%</span>
          </div>
        </div>
      </main>

      {/* Bottom left */}
      <div
        className="
        absolute
        bottom-8
        left-8
        hidden
        sm:block
        text-[9px]
        tracking-[0.28em]
        text-zinc-600
      "
      >
        MUSIC • PEOPLE • MOMENTS • FOREVER
      </div>

      {/* Bottom right */}
      <div
        className="
        absolute
        bottom-8
        right-8
        hidden
        sm:block
        text-[9px]
        tracking-[0.28em]
        text-zinc-600
      "
      >
        A HIGHER STATE TOGETHER
      </div>
    </div>
  );
};
