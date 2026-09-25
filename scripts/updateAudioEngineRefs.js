import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/components/audio/AudioHUD.tsx',
  'src/components/mobile/MobileExperience.tsx',
  'src/components/mobile/audio/MobileAudioUI.tsx',
  'src/components/mobile/navigation/PocketRig.tsx',
  'src/components/mobile/scenes/MobileArtistProfileScene.tsx',
  'src/components/mobile/scenes/MobileBackstageMenu.tsx',
  'src/components/mobile/scenes/MobileBiographyChapterScene.tsx',
  'src/components/mobile/scenes/MobileBiographyEntranceScene.tsx',
  'src/components/mobile/scenes/MobileBookingScene.tsx',
  'src/components/mobile/scenes/MobileBookingSuccessScene.tsx',
  'src/components/mobile/scenes/MobileDJBoothScene.tsx',
  'src/components/mobile/scenes/MobileEntranceScene.tsx',
  'src/components/mobile/scenes/MobileEventArchiveScene.tsx',
  'src/components/mobile/scenes/MobileEventDetailScene.tsx',
  'src/components/mobile/scenes/MobileExitScene.tsx',
  'src/components/mobile/scenes/MobileMainStageScene.tsx',
  'src/components/mobile/scenes/MobilePocketRigDetailScene.tsx',
  'src/components/mobile/scenes/MobileRadioScene.tsx',
  'src/components/mobile/scenes/MobileSoundGateScene.tsx',
  'src/components/mobile/scenes/MobileSoundUniverseScene.tsx',
  'src/components/mobile/scenes/MobileVoidScene.tsx',
  'src/components/navigation/SceneTimelineScrubber.tsx',
  'src/components/scenes/02_SoundPermissionScene.tsx',
  'src/components/scenes/07_InteractiveStageScene.tsx',
  'src/components/scenes/09_InteractiveDJBooth.tsx',
  'src/components/scenes/10_PraxxRadioScene.tsx',
  'src/components/scenes/11_SoundUniverseScene.tsx',
  'src/components/scenes/12_EventArchiveScene.tsx',
  'src/components/scenes/13_EventDetailScene.tsx',
  'src/components/scenes/14_BiographyEntranceScene.tsx',
  'src/components/scenes/15_BiographyChaptersScene.tsx',
  'src/components/scenes/17_BookingScene.tsx',
  'src/components/scenes/20_FinalScreenScene.tsx',
  'src/components/stageNav/StageLightNav.tsx',
];

for (const relPath of files) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', fullPath);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace imports
  content = content.replace(/import\s*\{\s*AudioEngine\s*,\s*TRACKS\s*\}\s*from\s*(['"][^'"]*\/audio\/)AudioEngine(['"])/g, 'import { HowlerEngine, TRACKS } from $1howlerEngine$2');
  content = content.replace(/import\s*\{\s*TRACKS\s*,\s*AudioEngine\s*\}\s*from\s*(['"][^'"]*\/audio\/)AudioEngine(['"])/g, 'import { HowlerEngine, TRACKS } from $1howlerEngine$2');
  content = content.replace(/import\s*\{\s*AudioEngine\s*\}\s*from\s*(['"][^'"]*\/audio\/)AudioEngine(['"])/g, 'import { HowlerEngine } from $1howlerEngine$2');

  // Replace usage
  content = content.replace(/\bAudioEngine\b/g, 'HowlerEngine');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated:', relPath);
}

console.log('All files updated successfully!');
