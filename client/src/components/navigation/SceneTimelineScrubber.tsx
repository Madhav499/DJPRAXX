import React, { useCallback, useEffect, useState } from "react";
import { type StoryboardScene, SCENES_DATA } from "../../types/navigation";
import { ChevronLeft, ChevronRight, Layers, Play, Pause } from "lucide-react";
import { HowlerEngine } from "../../audio/howlerEngine";

interface SceneTimelineScrubberProps {
  currentScene: StoryboardScene;
  onSelectScene: (scene: StoryboardScene) => void;
}

export const SceneTimelineScrubber: React.FC<SceneTimelineScrubberProps> = ({
  currentScene,
  onSelectScene,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutoTour, setIsAutoTour] = useState(false);

  const currentIndex = SCENES_DATA.findIndex((s) => s.id === currentScene);
  const currentSceneMeta = SCENES_DATA[currentIndex] || SCENES_DATA[0];

  const nonScrubberScenes = SCENES_DATA.filter(
    (s) => s.id !== "01_loading" && s.id !== "02_transition",
  );

  const handlePrev = useCallback(() => {
    if (
      currentIndex > 0 &&
      nonScrubberScenes.includes(SCENES_DATA[currentIndex - 1])
    ) {
      HowlerEngine.triggerLightPulseSound();
      onSelectScene(SCENES_DATA[currentIndex - 1].id);
    }
  }, [currentIndex, onSelectScene]);

  const handleNext = useCallback(() => {
    if (
      currentIndex >= 0 &&
      currentIndex < SCENES_DATA.length - 1 &&
      nonScrubberScenes.includes(SCENES_DATA[currentIndex + 1])
    ) {
      HowlerEngine.triggerLightPulseSound();
      onSelectScene(SCENES_DATA[currentIndex + 1].id);
    }
  }, [currentIndex, onSelectScene]);

  // Keyboard arrows use the same handlers as the timeline buttons.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Leave keyboard navigation alone while typing or editing text.
      const target = event.target;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest('input, textarea, select, [role="textbox"]')))
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Auto-tour timer
  useEffect(() => {
    if (!isAutoTour) return;
    const timer = setInterval(() => {
      const nextIdx = (currentIndex + 1) % SCENES_DATA.length;
      onSelectScene(SCENES_DATA[nextIdx].id);
    }, 7000);

    return () => clearInterval(timer);
  }, [isAutoTour, currentIndex, onSelectScene]);

  return (
    <div
      className="fixed bottom-4 left-4 z-30 pointer-events-auto flex flex-col items-start select-none"
      role="region"
      aria-label="Scene Scrubber Timeline"
    >
      {/* Expanded Scenes Drawer Grid */}
      {isExpanded && (
        <div className="mb-2 p-3 rounded-2xl bg-zinc-950/95 border border-white/10 backdrop-blur-2xl shadow-2xl max-w-sm sm:max-w-md max-h-72 overflow-y-auto">
          <div className="flex justify-between items-center mb-2 px-1 border-b border-white/10 pb-1.5">
            <span className="text-[10px] tracking-[0.2em] font-mono text-amber-400 uppercase font-bold">
              20-SCENE STORYBOARD JUMP
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">
              IMAGE 1 SPEC
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SCENES_DATA.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  HowlerEngine.triggerLightPulseSound();
                  onSelectScene(sc.id);
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg text-left transition-all text-[11px] font-['Space_Grotesk'] flex items-center gap-2 ${
                  sc.id === currentScene
                    ? "bg-amber-500 text-black font-bold shadow-md"
                    : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                }`}
              >
                <span className="font-mono text-[9px] opacity-75">
                  {sc.number}
                </span>
                <span className="truncate">{sc.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Bottom Bar Pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Toggle Grid Drawer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-xl border transition-all ${
            isExpanded
              ? "bg-amber-500 text-black border-amber-400"
              : "hover:bg-white/10 text-zinc-400 hover:text-white border-white/5"
          }`}
          title="Toggle Storyboard Scenes"
          aria-label="Toggle Storyboard Scenes"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Scene Readout */}
        <div className="flex flex-col min-w-[130px] max-w-[180px]">
          <span className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">
            SCENE {currentSceneMeta.number} / 20
          </span>
          <span className="text-xs font-bold text-white truncate font-['Space_Grotesk']">
            {currentSceneMeta.title}
          </span>
        </div>

        {/* Controls: Prev, Tour Play, Next */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous Scene"
            title="Previous Scene"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoTour(!isAutoTour)}
            className={`p-1.5 rounded-lg border transition-all ${
              isAutoTour
                ? "bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse"
                : "hover:bg-white/10 text-zinc-400 hover:text-white border-transparent"
            }`}
            aria-label={isAutoTour ? "Pause Story Tour" : "Play Story Tour"}
            title={isAutoTour ? "Pause Tour" : "Auto Tour"}
          >
            {isAutoTour ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === SCENES_DATA.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next Scene"
            title="Next Scene"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
