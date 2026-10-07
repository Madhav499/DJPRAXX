export type NavDestination =
  | "stage"
  | "music"
  | "events"
  | "story"
  | "book"
  | "profile";

export interface NavItem {
  id: NavDestination;
  label: string;
  target: NavDestination;
  shortcut?: string;
  description: string;
  subtitle: string;
  sceneTarget: StoryboardScene;
}

export type StoryboardScene =
  | "01_loading"
  | "02_transition"
  | "03_entrance"
  | "04_entrance_tunnel"
  | "05_audience"
  | "06_main_stage_reveal"
  | "07_dj_booth"
  | "08_praxx_radio"
  | "09_sound_universe"
  | "10_event_archive"
  | "11_event_detail"
  | "12_biography_entrance"
  | "13_biography_chapter"
  | "14_artist_profile"
  | "15_booking"
  | "16_booking_success"
  | "17_exit_experience"
  | "18_final_screen";

export interface SceneMeta {
  id: StoryboardScene;
  number: string;
  title: string;
  caption: string;
  navCategory: NavDestination | null;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "stage",
    label: "STAGE",
    target: "stage",
    shortcut: "1",
    description: "Enter the main stage & arena",
    subtitle: "Main Stage Experience",
    sceneTarget: "05_audience",
  },
  {
    id: "music",
    label: "MUSIC",
    target: "music",
    shortcut: "2",
    description: "Explore PRAXX Radio & Sound Universe",
    subtitle: "Radio + Sound Universe",
    sceneTarget: "08_praxx_radio",
  },
  {
    id: "events",
    label: "EVENTS",
    target: "events",
    shortcut: "3",
    description: "Explore event memories & live archives",
    subtitle: "Moments That Matter",
    sceneTarget: "10_event_archive",
  },
  {
    id: "story",
    label: "STORY",
    target: "story",
    shortcut: "4",
    description: "Enter the biography journey behind the sound",
    subtitle: "Behind The Sound",
    sceneTarget: "12_biography_entrance",
  },
  {
    id: "profile",
    label: "PROFILE",
    target: "profile",
    shortcut: "5",
    description: "Explore artist profile, philosophy & journey",
    subtitle: "Artist Profile & Info",
    sceneTarget: "14_artist_profile",
  },
  {
    id: "book",
    label: "BOOK",
    target: "book",
    shortcut: "6",
    description: "Book DJ PRAXX for your unforgettable night",
    subtitle: "Reserve Event Set",
    sceneTarget: "15_booking",
  },
];

export const SCENES_DATA: SceneMeta[] = [
  {
    id: "01_loading",
    number: "01",
    title: "LOADING EXPERIENCE",
    caption: "Initializing Night...",
    navCategory: null,
  },
  {
    id: "02_transition",
    number: "02",
    title: "TRANSITION INTO THE WORLD",
    caption: "Let The Music Take You",
    navCategory: null,
  },
  {
    id: "03_entrance",
    number: "03",
    title: "THE VOID / ARRIVAL",
    caption: "You Are Here",
    navCategory: "stage",
  },
  {
    id: "04_entrance_tunnel",
    number: "04",
    title: "THE ENTRANCE",
    caption: "Music People Moments Forever",
    navCategory: "stage",
  },
  {
    id: "05_audience",
    number: "05",
    title: "MAIN STAGE REVEAL",
    caption: "A Higher State Together",
    navCategory: "stage",
  },
  {
    id: "06_main_stage_reveal",
    number: "06",
    title: "STAGE EXPERIENCE",
    caption: "Interactive Lighting & FX Sweep",
    navCategory: "stage",
  },
  {
    id: "07_dj_booth",
    number: "07",
    title: "INTERACTIVE DJ BOOTH",
    caption: "Touch / Explore / Mix / Feel",
    navCategory: "stage",
  },
  {
    id: "08_praxx_radio",
    number: "08",
    title: "PRAXX RADIO",
    caption: "Live Sessions & High-Res Player",
    navCategory: "music",
  },
  {
    id: "09_sound_universe",
    number: "09",
    title: "SOUND UNIVERSE",
    caption: "Explore 3D Genre Cosmos",
    navCategory: "music",
  },
  {
    id: "10_event_archive",
    number: "10",
    title: "EVENT ARCHIVE",
    caption: "Moments That Matter",
    navCategory: "events",
  },
  {
    id: "11_event_detail",
    number: "11",
    title: "EVENT DETAIL",
    caption: "Elegance Party Plot, Rajkot",
    navCategory: "events",
  },
  {
    id: "12_biography_entrance",
    number: "12",
    title: "BIOGRAPHY ENTRANCE",
    caption: "Behind The Sound",
    navCategory: "story",
  },
  {
    id: "13_biography_chapter",
    number: "13",
    title: "BIOGRAPHY CHAPTER",
    caption: "01 The First Frequency",
    navCategory: "story",
  },
  {
    id: "14_artist_profile",
    number: "14",
    title: "ARTIST PROFILE",
    caption: "Parth Chavda — Quick View",
    navCategory: "profile",
  },
  {
    id: "15_booking",
    number: "15",
    title: "BOOKING SCREEN",
    caption: "Let's Create Something Unforgettable",
    navCategory: "book",
  },
  {
    id: "16_booking_success",
    number: "16",
    title: "BOOKING SUCCESS",
    caption: "Request Received — Signal Active",
    navCategory: "book",
  },
  {
    id: "17_exit_experience",
    number: "17",
    title: "EXIT EXPERIENCE",
    caption: "Until Next Night",
    navCategory: null,
  },
  {
    id: "18_final_screen",
    number: "18",
    title: "FINAL SCREEN",
    caption: "Still Listening. Still Learning. Still Playing.",
    navCategory: null,
  },
];

export function getNavCategoryForScene(scene: StoryboardScene): NavDestination {
  const found = SCENES_DATA.find((s) => s.id === scene);
  if (found && found.navCategory) return found.navCategory;
  return "stage";
}
