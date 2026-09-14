export type NavDestination = 'stage' | 'music' | 'events' | 'story' | 'book' | 'more';

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
  | '01_loading'
  | '02_sound_permission'
  | '03_transition'
  | '04_void_arrival'
  | '05_entrance'
  | '06_main_stage'
  | '07_stage_interactive'
  | '08_approach_booth'
  | '09_dj_booth'
  | '10_praxx_radio'
  | '11_sound_universe'
  | '12_event_archive'
  | '13_event_detail'
  | '14_biography_entrance'
  | '15_biography_chapter'
  | '16_artist_profile'
  | '17_booking'
  | '18_booking_success'
  | '19_exit_experience'
  | '20_final_screen';

export interface SceneMeta {
  id: StoryboardScene;
  number: string;
  title: string;
  caption: string;
  navCategory: NavDestination | null;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'stage',
    label: 'STAGE',
    target: 'stage',
    shortcut: '1',
    description: 'Enter the main stage & arena',
    subtitle: 'Main Stage Experience',
    sceneTarget: '06_main_stage',
  },
  {
    id: 'music',
    label: 'MUSIC',
    target: 'music',
    shortcut: '2',
    description: 'Explore PRAXX Radio & Sound Universe',
    subtitle: 'Radio + Sound Universe',
    sceneTarget: '10_praxx_radio',
  },
  {
    id: 'events',
    label: 'EVENTS',
    target: 'events',
    shortcut: '3',
    description: 'Explore event memories & live archives',
    subtitle: 'Moments That Matter',
    sceneTarget: '12_event_archive',
  },
  {
    id: 'story',
    label: 'STORY',
    target: 'story',
    shortcut: '4',
    description: 'Enter the biography journey behind the sound',
    subtitle: 'Behind The Sound',
    sceneTarget: '14_biography_entrance',
  },
  {
    id: 'book',
    label: 'BOOK',
    target: 'book',
    shortcut: '5',
    description: 'Book DJ PRAXX for your unforgettable night',
    subtitle: 'Reserve Event Set',
    sceneTarget: '17_booking',
  },
  {
    id: 'more',
    label: 'MORE',
    target: 'more',
    shortcut: '6',
    description: 'Explore artist profile, philosophy & journey',
    subtitle: 'Artist Profile & Info',
    sceneTarget: '16_artist_profile',
  },
];

export const SCENES_DATA: SceneMeta[] = [
  { id: '01_loading', number: '01', title: 'LOADING EXPERIENCE', caption: 'Initializing Night...', navCategory: null },
  { id: '02_sound_permission', number: '02', title: 'SOUND PERMISSION', caption: 'Enter The Night - Sound On', navCategory: null },
  { id: '03_transition', number: '03', title: 'TRANSITION INTO THE WORLD', caption: 'Let The Music Take You', navCategory: null },
  { id: '04_void_arrival', number: '04', title: 'THE VOID / ARRIVAL', caption: 'You Are Here', navCategory: 'stage' },
  { id: '05_entrance', number: '05', title: 'THE ENTRANCE', caption: 'Music People Moments Forever', navCategory: 'stage' },
  { id: '06_main_stage', number: '06', title: 'MAIN STAGE REVEAL', caption: 'A Higher State Together', navCategory: 'stage' },
  { id: '07_stage_interactive', number: '07', title: 'STAGE EXPERIENCE', caption: 'Interactive Lighting & FX Sweep', navCategory: 'stage' },
  { id: '08_approach_booth', number: '08', title: 'APPROACH TO DJ BOOTH', caption: 'Every Drop A Story', navCategory: 'stage' },
  { id: '09_dj_booth', number: '09', title: 'INTERACTIVE DJ BOOTH', caption: 'Touch / Explore / Mix / Feel', navCategory: 'stage' },
  { id: '10_praxx_radio', number: '10', title: 'PRAXX RADIO', caption: 'Live Sessions & High-Res Player', navCategory: 'music' },
  { id: '11_sound_universe', number: '11', title: 'SOUND UNIVERSE', caption: 'Explore 3D Genre Cosmos', navCategory: 'music' },
  { id: '12_event_archive', number: '12', title: 'EVENT ARCHIVE', caption: 'Moments That Matter', navCategory: 'events' },
  { id: '13_event_detail', number: '13', title: 'EVENT DETAIL', caption: 'Elegance Party Plot, Rajkot', navCategory: 'events' },
  { id: '14_biography_entrance', number: '14', title: 'BIOGRAPHY ENTRANCE', caption: 'Behind The Sound', navCategory: 'story' },
  { id: '15_biography_chapter', number: '15', title: 'BIOGRAPHY CHAPTER', caption: '01 The First Frequency', navCategory: 'story' },
  { id: '16_artist_profile', number: '16', title: 'ARTIST PROFILE', caption: 'Parth Chavda — Quick View', navCategory: 'more' },
  { id: '17_booking', number: '17', title: 'BOOKING SCREEN', caption: "Let's Create Something Unforgettable", navCategory: 'book' },
  { id: '18_booking_success', number: '18', title: 'BOOKING SUCCESS', caption: 'Request Received — Signal Active', navCategory: 'book' },
  { id: '19_exit_experience', number: '19', title: 'EXIT EXPERIENCE', caption: 'Until Next Night', navCategory: 'more' },
  { id: '20_final_screen', number: '20', title: 'FINAL SCREEN', caption: 'Still Listening. Still Learning. Still Playing.', navCategory: 'more' },
];

export function getNavCategoryForScene(scene: StoryboardScene): NavDestination {
  const found = SCENES_DATA.find((s) => s.id === scene);
  if (found && found.navCategory) return found.navCategory;
  return 'stage';
}
