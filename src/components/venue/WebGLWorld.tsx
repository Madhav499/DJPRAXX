import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { NavDestination, StoryboardScene } from '../../types/navigation';
import { AudioEngine } from '../../audio/AudioEngine';

interface WebGLWorldProps {
  activeNav: NavDestination;
  activeScene: StoryboardScene;
  hoveredNav: NavDestination | null;
  focusedNav: NavDestination | null;
  onSelectNav: (destination: NavDestination) => void;
  pulseTrigger: number; // incremented on nav click or pyro FX
  isReducedMotion: boolean;
}

interface FixtureData {
  id: NavDestination;
  index: number;
  group: THREE.Group;
  bodyGroup: THREE.Group;
  lensMesh: THREE.Mesh;
  lensMaterial: THREE.MeshBasicMaterial;
  beamMesh: THREE.Mesh;
  beamMaterial: THREE.ShaderMaterial;
  spotLight: THREE.SpotLight;
  targetObject: THREE.Object3D;
  baseX: number;
  baseY: number;
  baseZ: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  currentRotX: number;
  currentRotY: number;
  targetRotX: number;
  targetRotY: number;
  currentIntensity: number;
  targetIntensity: number;
  pulseIntensity: number;
}

// Custom Volumetric Beam Shader for buttery-smooth performance on any GPU
const BeamShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uFalloff;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Vertical fade: bright at top (lens), softer toward bottom
      float verticalFade = pow(1.0 - vUv.y, 1.8);

      // Radial fresnel / rim fade for soft volumetric haze appearance
      float radialFade = sin(vUv.x * 3.14159265);
      
      float intensity = verticalFade * radialFade * uOpacity;
      
      // Warm white inner core with amber falloff
      vec3 coreColor = mix(uColor, vec3(1.0, 0.96, 0.88), pow(verticalFade, 3.0) * 0.7);
      
      gl_FragColor = vec4(coreColor, intensity);
    }
  `,
};

export const WebGLWorld: React.FC<WebGLWorldProps> = ({
  activeNav,
  activeScene,
  hoveredNav,
  focusedNav,
  pulseTrigger,
  isReducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const fixturesRef = useRef<FixtureData[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pyroParticlesRef = useRef<THREE.Points | null>(null);
  const backgroundLasersRef = useRef<THREE.Group | null>(null);

  // Keep track of props in refs for animation loop
  const stateRef = useRef({
    activeNav,
    activeScene,
    hoveredNav,
    focusedNav,
    pulseTrigger,
    isReducedMotion,
  });

  useEffect(() => {
    stateRef.current = {
      activeNav,
      activeScene,
      hoveredNav,
      focusedNav,
      pulseTrigger,
      isReducedMotion,
    };
  }, [activeNav, activeScene, hoveredNav, focusedNav, pulseTrigger, isReducedMotion]);

  // Flash pulse on click
  useEffect(() => {
    fixturesRef.current.forEach((fixture) => {
      if (fixture.id === activeNav) {
        fixture.pulseIntensity = 1.6;
      }
    });
  }, [pulseTrigger, activeNav]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.045);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and tone mapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback
      renderer = new THREE.WebGLRenderer({ antialias: false });
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ambient & Key Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1c24, 0.7);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x3e465e, 0.6);
    rimLight.position.set(0, 10, -5);
    scene.add(rimLight);

    // 5. Build Physical Suspended Steel Truss (Upper Stage Rig)
    const trussGroup = new THREE.Group();
    trussGroup.position.set(0, 3.4, 1.5);
    scene.add(trussGroup);

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.88,
      roughness: 0.35,
    });

    const clampMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c303c,
      metalness: 0.9,
      roughness: 0.25,
    });

    // 4 Main Horizontal Chord Tubes
    const chordGeo = new THREE.CylinderGeometry(0.045, 0.045, 12, 12);
    chordGeo.rotateZ(Math.PI / 2);

    const chordOffsets = [
      { y: 0.2, z: 0.15 },
      { y: 0.2, z: -0.15 },
      { y: -0.2, z: 0.15 },
      { y: -0.2, z: -0.15 },
    ];

    chordOffsets.forEach((pos) => {
      const chord = new THREE.Mesh(chordGeo, metalMaterial);
      chord.position.set(0, pos.y, pos.z);
      trussGroup.add(chord);
    });

    // Truss Cross-Lacing Diagonals
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8);
    for (let x = -5.5; x <= 5.5; x += 0.45) {
      const strut1 = new THREE.Mesh(strutGeo, metalMaterial);
      strut1.position.set(x, 0, 0.15);
      strut1.rotation.z = Math.PI / 4;
      trussGroup.add(strut1);

      const strut2 = new THREE.Mesh(strutGeo, metalMaterial);
      strut2.position.set(x, 0, -0.15);
      strut2.rotation.z = -Math.PI / 4;
      trussGroup.add(strut2);

      const strutTop = new THREE.Mesh(strutGeo, metalMaterial);
      strutTop.position.set(x, 0.2, 0);
      strutTop.rotation.x = Math.PI / 4;
      trussGroup.add(strutTop);
    }

    // 6. Build 6 Physical Stage Spotlights (STAGE, MUSIC, EVENTS, STORY, BOOK, MORE)
    const navItemsList: { id: NavDestination; label: string; x: number }[] = [
      { id: 'stage', label: 'STAGE', x: -3.25 },
      { id: 'music', label: 'MUSIC', x: -1.95 },
      { id: 'events', label: 'EVENTS', x: -0.65 },
      { id: 'story', label: 'STORY', x: 0.65 },
      { id: 'book', label: 'BOOK', x: 1.95 },
      { id: 'more', label: 'MORE', x: 3.25 },
    ];

    const fixtures: FixtureData[] = [];

    // Base geometry shared for performance
    const yokeArmGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8);
    const bodyGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.48, 16);
    bodyGeo.rotateX(Math.PI / 2);

    const rimGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 24);
    const lensGeo = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);

    // Volumetric Beam Cone Geometry (tapered cylinder open on top)
    const beamGeo = new THREE.CylinderGeometry(0.15, 1.25, 5.2, 32, 1, true);
    // Move origin to the top lens position
    beamGeo.translate(0, -2.6, 0);

    navItemsList.forEach((item, index) => {
      const fixtureGroup = new THREE.Group();
      // Mount just below the bottom chords of the truss
      const posX = item.x;
      const posY = 3.12;
      const posZ = 1.5;
      fixtureGroup.position.set(posX, posY, posZ);
      scene.add(fixtureGroup);

      // C-Clamp & Rig Bracket
      const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.12), clampMaterial);
      clamp.position.set(0, 0.08, 0);
      fixtureGroup.add(clamp);

      // Hanging stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), clampMaterial);
      stem.position.set(0, 0, 0);
      fixtureGroup.add(stem);

      // Gimbal Yoke Assembly (allows mechanical yaw & pitch rotation)
      const yokeGroup = new THREE.Group();
      yokeGroup.position.set(0, -0.12, 0);
      fixtureGroup.add(yokeGroup);

      const yokeTop = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.06), clampMaterial);
      yokeTop.position.set(0, 0, 0);
      yokeGroup.add(yokeTop);

      const yokeLeft = new THREE.Mesh(yokeArmGeo, clampMaterial);
      yokeLeft.position.set(-0.18, -0.16, 0);
      yokeGroup.add(yokeLeft);

      const yokeRight = new THREE.Mesh(yokeArmGeo, clampMaterial);
      yokeRight.position.set(0.18, -0.16, 0);
      yokeGroup.add(yokeRight);

      // Spotlight Fixture Body (rotates around horizontal axis)
      const bodyGroup = new THREE.Group();
      bodyGroup.position.set(0, -0.22, 0);
      yokeGroup.add(bodyGroup);

      const fixtureBody = new THREE.Mesh(bodyGeo, metalMaterial);
      bodyGroup.add(fixtureBody);

      // Cooling fins on fixture body
      for (let f = -0.12; f <= 0.12; f += 0.06) {
        const fin = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 6, 16), metalMaterial);
        fin.position.set(0, 0, f);
        bodyGroup.add(fin);
      }

      // Lens Ring
      const lensRing = new THREE.Mesh(rimGeo, clampMaterial);
      lensRing.position.set(0, 0, 0.24);
      bodyGroup.add(lensRing);

      // Optical Lens with warm amber glow
      const lensMaterial = new THREE.MeshBasicMaterial({
        color: 0xffa044,
        transparent: true,
        opacity: 0.85,
      });
      const lensMesh = new THREE.Mesh(lensGeo, lensMaterial);
      lensMesh.position.set(0, 0, 0.23);
      lensMesh.rotation.x = Math.PI / 2;
      bodyGroup.add(lensMesh);

      // SpotLight in 3D scene
      const spotLight = new THREE.SpotLight(0xf07c22, 2.5, 9, Math.PI / 6, 0.5, 1.2);
      spotLight.position.set(0, 0, 0.25);
      const targetObj = new THREE.Object3D();
      targetObj.position.set(0, -5, 0.5);
      bodyGroup.add(targetObj);
      spotLight.target = targetObj;
      bodyGroup.add(spotLight);

      // Volumetric Beam Cone
      const beamMaterial = new THREE.ShaderMaterial({
        vertexShader: BeamShader.vertexShader,
        fragmentShader: BeamShader.fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(0xf07c22) },
          uOpacity: { value: 0.4 },
          uFalloff: { value: 1.5 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const beamMesh = new THREE.Mesh(beamGeo, beamMaterial);
      // Beam points forward/downward along fixture z-axis
      beamMesh.position.set(0, 0, 0.25);
      beamMesh.rotation.x = -Math.PI / 2;
      bodyGroup.add(beamMesh);

      // Organic technician angle variations
      const naturalAngleOffset = (index - 2.5) * -0.06;
      const naturalPitchOffset = -0.22 + Math.sin(index * 1.5) * 0.04;

      bodyGroup.rotation.x = naturalPitchOffset;
      yokeGroup.rotation.y = naturalAngleOffset;

      fixtures.push({
        id: item.id,
        index,
        group: fixtureGroup,
        bodyGroup,
        lensMesh,
        lensMaterial,
        beamMesh,
        beamMaterial,
        spotLight,
        targetObject: targetObj,
        baseX: posX,
        baseY: posY,
        baseZ: posZ,
        baseRotX: naturalPitchOffset,
        baseRotY: naturalAngleOffset,
        baseRotZ: 0,
        currentRotX: naturalPitchOffset,
        currentRotY: naturalAngleOffset,
        targetRotX: naturalPitchOffset,
        targetRotY: naturalAngleOffset,
        currentIntensity: item.id === activeNav ? 1.0 : 0.25,
        targetIntensity: item.id === activeNav ? 1.0 : 0.25,
        pulseIntensity: item.id === activeNav ? 0.6 : 0,
      });
    });

    fixturesRef.current = fixtures;

    // 7. Arena Floor (Wet Reflective Stage Surface)
    const floorGeo = new THREE.PlaneGeometry(30, 20);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x06070a,
      roughness: 0.18,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -2.5, 0);
    scene.add(floor);

    // 8. Atmospheric Floating Dust / Haze Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 6 - 2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      particleSpeeds[i] = 0.2 + Math.random() * 0.4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffaa55,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Background Laser Arrays (sweeping beams for main stage vibe)
    const lasersGroup = new THREE.Group();
    lasersGroup.position.set(0, 1.2, -6);
    scene.add(lasersGroup);
    backgroundLasersRef.current = lasersGroup;

    const laserBeamGeo = new THREE.CylinderGeometry(0.015, 0.08, 14, 8);
    laserBeamGeo.translate(0, -7, 0);

    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xf07c22,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let l = -4; l <= 4; l += 1.3) {
      const laser = new THREE.Mesh(laserBeamGeo, laserMat);
      laser.position.set(l, 3.5, 0);
      laser.rotation.z = (l / 4) * 0.35;
      lasersGroup.add(laser);
    }

    // 10. Pyro / Strobe FX System
    const pyroCount = 120;
    const pyroGeo = new THREE.BufferGeometry();
    const pyroPositions = new Float32Array(pyroCount * 3);
    const pyroVels = new Float32Array(pyroCount * 3);

    for (let p = 0; p < pyroCount; p++) {
      pyroPositions[p * 3] = 0;
      pyroPositions[p * 3 + 1] = -100; // start hidden
      pyroPositions[p * 3 + 2] = 0;
      pyroVels[p * 3] = (Math.random() - 0.5) * 4;
      pyroVels[p * 3 + 1] = 3 + Math.random() * 5;
      pyroVels[p * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    pyroGeo.setAttribute('position', new THREE.BufferAttribute(pyroPositions, 3));
    const pyroMat = new THREE.PointsMaterial({
      color: 0xffd288,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pyroMesh = new THREE.Points(pyroGeo, pyroMat);
    scene.add(pyroMesh);
    pyroParticlesRef.current = pyroMesh;

    // Pointer Event Listeners
    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = normX;
      mouseRef.current.y = normY;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;

      // Adjust camera distance for mobile responsiveness
      if (newWidth < 768) {
        camera.position.z = 10.2;
        camera.fov = 54;
      } else {
        camera.position.z = 8.5;
        camera.fov = 48;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 11. Master Render & Animation Loop (60 FPS)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const { activeNav: curActive, hoveredNav: curHover, focusedNav: curFocus, isReducedMotion: curReduced } =
        stateRef.current;

      // Get real-time audio analysis from AudioEngine
      const audioData = AudioEngine.getAudioAnalysis();
      const bassEnergy = audioData.bass;
      const trebleEnergy = audioData.treble;

      // Float dust particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += particleSpeeds[i] * delta * 0.5;
        if (posArr[i * 3 + 1] > 4.5) {
          posArr[i * 3 + 1] = -2;
          posArr[i * 3] = (Math.random() - 0.5) * 16;
        }
      }
      posAttr.needsUpdate = true;

      // Sweep background lasers subtly
      if (backgroundLasersRef.current) {
        const sweepSpeed = 0.8;
        backgroundLasersRef.current.rotation.y = Math.sin(elapsedTime * sweepSpeed) * 0.15;
        backgroundLasersRef.current.children.forEach((laser, idx) => {
          laser.rotation.x = Math.sin(elapsedTime * 1.2 + idx) * 0.1;
        });
      }

      // Animate 6 Stage Light Fixtures
      const mouse = mouseRef.current;

      fixtures.forEach((fixture) => {
        const isActive = fixture.id === curActive;
        const isHovered = fixture.id === curHover;
        const isFocused = fixture.id === curFocus;

        // 1. Target Intensity calculation
        let targetIntensity = 0.28; // default resting venue ambient
        if (isActive) {
          targetIntensity = 0.85;
        }
        if (isHovered || isFocused) {
          targetIntensity = 1.05;
        }

        // Pointer proximity boost: if cursor is near this fixture's screen band
        const fixtureNormX = fixture.baseX / 4.5;
        const distToMouse = Math.hypot(mouse.x - fixtureNormX, mouse.y - 0.7);
        if (distToMouse < 0.45) {
          targetIntensity += (0.45 - distToMouse) * 0.6;
        }

        // Decay pulse intensity
        if (fixture.pulseIntensity > 0.01) {
          fixture.pulseIntensity *= Math.pow(0.08, delta);
        } else {
          fixture.pulseIntensity = 0;
        }

        // Audio reactivity: bass kick drives spotlight pulse
        const audioBoost = isActive || isHovered ? bassEnergy * 0.28 : bassEnergy * 0.08;
        const lensShimmer = trebleEnergy * 0.15;

        // Smoothly interpolate current intensity (damped feel: ~200-300ms)
        fixture.currentIntensity += (targetIntensity - fixture.currentIntensity) * (delta * 8);
        const finalIntensity = Math.min(2.0, fixture.currentIntensity + fixture.pulseIntensity + audioBoost);

        // Update Beam Shader Uniforms
        fixture.beamMaterial.uniforms.uOpacity.value = finalIntensity * 0.42;

        // Update Lens Core Material
        const coreWhiteRatio = Math.min(1.0, finalIntensity * 0.65);
        fixture.lensMaterial.color.setRGB(
          1.0,
          0.62 + coreWhiteRatio * 0.35,
          0.26 + coreWhiteRatio * 0.65
        );
        fixture.lensMaterial.opacity = Math.min(1.0, 0.7 + finalIntensity * 0.25 + lensShimmer);

        // Update 3D SpotLight
        fixture.spotLight.intensity = finalIntensity * 3.2;

        // 2. Physical Fixture Aiming / Rotation (Damped Spring Physics)
        if (!curReduced) {
          if (isHovered || isFocused || distToMouse < 0.4) {
            // Believable mechanical tilt limits (-18° to +18°)
            const aimX = (mouse.x - fixtureNormX) * 0.32;
            const aimY = -(mouse.y - 0.7) * 0.24;
            fixture.targetRotY = fixture.baseRotY + THREE.MathUtils.clamp(aimX, -0.32, 0.32);
            fixture.targetRotX = fixture.baseRotX + THREE.MathUtils.clamp(aimY, -0.28, 0.28);
          } else {
            // Return softly to base natural rigging angle
            fixture.targetRotY = fixture.baseRotY;
            fixture.targetRotX = fixture.baseRotX;
          }

          // Damped spring interpolation (avoids jerky snapping or hyper cursor chasing)
          const dampingFactor = delta * 5.5;
          fixture.currentRotX += (fixture.targetRotX - fixture.currentRotX) * dampingFactor;
          fixture.currentRotY += (fixture.targetRotY - fixture.currentRotY) * dampingFactor;

          fixture.bodyGroup.rotation.x = fixture.currentRotX;
          // The yoke handles horizontal yaw
          (fixture.bodyGroup.parent as THREE.Group).rotation.y = fixture.currentRotY;
        }
      });

      // Subtle parallax on camera based on mouse
      if (!curReduced && cameraRef.current) {
        cameraRef.current.position.x += (mouse.x * 0.3 - cameraRef.current.position.x) * (delta * 2);
        cameraRef.current.position.y += (1.8 + mouse.y * 0.15 - cameraRef.current.position.y) * (delta * 2);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
};
