import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  type StoryboardScene,
  type NavDestination,
  getNavCategoryForScene,
} from "../types/navigation";

interface SceneContextValue {
  activeScene: StoryboardScene;
  activeNav: NavDestination;

  setActiveScene: (scene: StoryboardScene) => void;
  handleSelectScene: (scene: StoryboardScene) => void;
}

const SceneContext = createContext<SceneContextValue | undefined>(undefined);

const DEFAULT_SCENE: StoryboardScene = "01_loading";

/**
 * Get current scene from URL hash.
 *
 * Example:
 * https://example.com/#12_event_archive
 *
 * returns:
 * "12_event_archive"
 */
function getSceneFromURL(): StoryboardScene {
  if (typeof window === "undefined") {
    return DEFAULT_SCENE;
  }

  const scene = window.location.hash.replace("#", "").trim();

  return (scene || DEFAULT_SCENE) as StoryboardScene;
}

interface SceneProviderProps {
  children: ReactNode;
}

export function SceneProvider({ children }: SceneProviderProps) {
  /**
   * Initialize directly from URL.
   *
   * This prevents:
   * 01_loading -> URL scene
   *
   * flickering on initial load.
   */
  const [activeScene, setActiveSceneState] =
    useState<StoryboardScene>(getSceneFromURL);

  const [activeNav, setActiveNav] = useState<NavDestination>(() =>
    getNavCategoryForScene(getSceneFromURL()),
  );

  /**
   * Change scene + sync URL + sync navigation category.
   */
  const handleSelectScene = useCallback((scene: StoryboardScene) => {
    if (!scene) return;

    setActiveSceneState(scene);
    setActiveNav(getNavCategoryForScene(scene));

    const newURL = `${window.location.pathname}${window.location.search}#${scene}`;

    /**
     * pushState creates browser history entries.
     *
     * So:
     * Scene 04 -> Scene 05 -> Scene 06
     *
     * Browser Back:
     * Scene 06 -> Scene 05 -> Scene 04
     */
    window.history.pushState(
      {
        scene,
      },
      "",
      newURL,
    );
  }, []);

  /**
   * Direct state setter.
   *
   * Keep this URL-aware so components cannot accidentally
   * update state without updating the URL.
   */
  const setActiveScene = useCallback(
    (scene: StoryboardScene) => {
      handleSelectScene(scene);
    },
    [handleSelectScene],
  );

  /**
   * Handle browser back / forward.
   */
  useEffect(() => {
    const handlePopState = () => {
      const scene = getSceneFromURL();

      setActiveSceneState(scene);
      setActiveNav(getNavCategoryForScene(scene));
    };

    const handleHashChange = () => {
      const scene = getSceneFromURL();

      setActiveSceneState(scene);
      setActiveNav(getNavCategoryForScene(scene));
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <SceneContext.Provider
      value={{
        activeScene,
        activeNav,
        setActiveScene,
        handleSelectScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);

  if (!context) {
    throw new Error("useScene must be used inside <SceneProvider />");
  }

  return context;
}
