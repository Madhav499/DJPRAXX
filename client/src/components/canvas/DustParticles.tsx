import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface DustParticlesProps {
  activeScene: string;
}

const DustParticles: React.FC<DustParticlesProps> = ({ activeScene }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);

  /*
   * ------------------------------------------------------------
   * EXISTING DUST PARTICLES
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];

    const isMobile = window.innerWidth < 768;

    const PARTICLE_COUNT = isMobile ? 130 : 350;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (): Particle => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,

        z: Math.random(),

        size: Math.random() * 2 + 0.5,

        opacity: Math.random() * 0.55 + 0.2,

        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.3,

        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.005,
      };
    };

    const initialize = () => {
      particles.length = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    };

    const drawParticle = (particle: Particle, time: number) => {
      particle.twinkle += particle.twinkleSpeed;

      const twinkle = 0.75 + Math.sin(particle.twinkle + time * 0.0002) * 0.25;

      const depthScale = 0.4 + particle.z * 0.8;

      const size = particle.size * depthScale;
      const opacity = particle.opacity * twinkle;

      ctx.fillStyle = `rgba(255, 190, 110, ${opacity})`;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(size, 0.3), 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.speedX * (0.7 + particle.z);
        particle.y += particle.speedY * (0.7 + particle.z);

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        drawParticle(particle, time);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    initialize();
    animationFrame = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * REALISTIC STAGE SPOTLIGHT + FOG
   *
   * ONLY RUNS DURING:
   * activeScene === "06_main_stage_reveal"
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (activeScene !== "06_main_stage_reveal") return;

    const canvas = fogCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastTime = 0;

    const isMobile = window.innerWidth < 768;

    /*
     * ------------------------------------------------------------
     * CONFIG
     * ------------------------------------------------------------
     */

    const FOG_COUNT = isMobile ? 75 : 150;

    /*
     * ------------------------------------------------------------
     * FOG PARTICLES
     *
     * Completely independent from the spotlight.
     * These represent actual fog-machine smoke.
     * ------------------------------------------------------------
     */

    interface FogParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      opacity: number;
      turbulence: number;
      phase: number;
    }

    const fogParticles: FogParticle[] = [];

    const createFogParticle = (initial = false): FogParticle => {
      /*
       * Multiple fog-machine emission points.
       */
      const machine = Math.random() < 0.5 ? width * 0.28 : width * 0.72;

      return {
        x: initial
          ? Math.random() * width
          : machine + (Math.random() - 0.5) * width * 0.12,

        y: initial
          ? height * (0.45 + Math.random() * 0.5)
          : height * 0.82 + Math.random() * height * 0.06,

        vx: (Math.random() - 0.5) * 0.08,

        vy: -(0.025 + Math.random() * 0.055),

        life: initial ? Math.random() * 180 : 0,

        maxLife: 170 + Math.random() * 260,

        size: 18 + Math.random() * 45,

        opacity: 0.025 + Math.random() * 0.045,

        turbulence: 0.5 + Math.random() * 1.5,

        phase: Math.random() * Math.PI * 2,
      };
    };

    const initializeFog = () => {
      fogParticles.length = 0;

      for (let i = 0; i < FOG_COUNT; i++) {
        fogParticles.push(createFogParticle(true));
      }
    };

    /*
     * ------------------------------------------------------------
     * FOG
     *
     * Soft neutral/white smoke.
     * NO orange color here.
     * ------------------------------------------------------------
     */

    const drawFogParticle = (particle: FogParticle) => {
      const lifeProgress = particle.life / particle.maxLife;

      /*
       * Fade in slowly.
       */
      const fadeIn = Math.min(lifeProgress * 5, 1);

      /*
       * Fade out near the end.
       */
      const fadeOut = Math.max(0, 1 - Math.max(lifeProgress - 0.72, 0) / 0.28);

      const alpha = particle.opacity * fadeIn * fadeOut;

      if (alpha <= 0) return;

      /*
       * Smoke expands as it rises.
       */
      const expansion = 1 + lifeProgress * 2.2;

      const size = particle.size * expansion;

      /*
       * Soft volumetric smoke.
       */
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,

        particle.x,
        particle.y,
        size,
      );

      /*
       * Neutral smoke.
       *
       * It stays gray/white even when crossing
       * the orange spotlight.
       */
      gradient.addColorStop(0, `rgba(225,225,220,${alpha})`);

      gradient.addColorStop(0.25, `rgba(205,205,200,${alpha * 0.7})`);

      gradient.addColorStop(0.6, `rgba(180,180,175,${alpha * 0.3})`);

      gradient.addColorStop(1, "rgba(150,150,145,0)");

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);

      ctx.fill();
    };

    /*
     * ------------------------------------------------------------
     * FOG-MACHINE EMISSION
     * ------------------------------------------------------------
     */

    const emitFog = () => {
      /*
       * Replace a small number of particles every frame.
       *
       * This gives the effect of continuous smoke output
       * rather than a one-time cloud.
       */
      const emissionCount = isMobile ? 1 : 2;

      for (let i = 0; i < emissionCount; i++) {
        const index = Math.floor(Math.random() * fogParticles.length);

        if (fogParticles[index].life > fogParticles[index].maxLife * 0.8) {
          fogParticles[index] = createFogParticle(false);
        }
      }
    };

    /*
     * ------------------------------------------------------------
     * REALISTIC DUAL STAGE SPOTLIGHTS
     *
     * Two physical lights mounted near the top-left and top-right.
     * Both beams angle inward toward the center of the stage.
     * ------------------------------------------------------------
     */

    interface Beam {
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      intensity: number;
    }

    const getBeams = (time: number): Beam[] => {
      const sourceY = height * 0.035;

      /*
       * Both lights point toward the center.
       *
       * The tiny movement keeps them from looking completely static.
       */
      const t = time * 0.001;

      /*
       * ------------------------------------------------------------
       * ORGANIC MOVING-HEAD MOTION
       * ------------------------------------------------------------
       */

      /*
       * Main slow sweep.
       */
      const sweep = Math.sin(t * 0.32) * 0.055;

      /*
       * Secondary slower movement.
       *
       * Prevents the movement from looking like
       * a perfect left -> right -> left cycle.
       */
      const drift = Math.sin(t * 0.13 + 1.7) * 0.025;

      /*
       * Small mechanical vibration / correction.
       *
       * Keep this VERY subtle.
       */
      const microMovement =
        Math.sin(t * 1.7) * 0.004 + Math.sin(t * 2.3 + 2) * 0.003;

      /*
       * Combine them.
       */
      const movement = sweep + drift + microMovement;

      const leftMovement = movement + Math.sin(t * 0.21) * 0.018;

      const rightMovement = movement + Math.sin(t * 0.18 + 2.4) * 0.018;

      const leftVertical =
        Math.sin(t * 0.27 + 1.2) * 0.055 + Math.sin(t * 0.11) * 0.025;

      const rightVertical =
        Math.sin(t * 0.24 + 3.1) * 0.055 + Math.sin(t * 0.14 + 1.5) * 0.02;

      return [
        {
          sourceX: width * 0.235,
          sourceY,

          targetX: width * (0.47 + leftMovement),

          targetY: height * (0.72 + leftVertical),

          intensity: 1,
        },

        {
          sourceX: width * 0.765,
          sourceY,

          targetX: width * (0.53 + rightMovement),

          targetY: height * (0.72 + rightVertical),

          intensity: 1,
        },
      ];
    };

    /*
     * ------------------------------------------------------------
     * DRAW ONE VOLUMETRIC SPOTLIGHT
     * ------------------------------------------------------------
     */

    const drawVolumetricBeam = (beam: Beam) => {
      const dx = beam.targetX - beam.sourceX;
      const dy = beam.targetY - beam.sourceY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      /*
       * Normalized direction.
       */
      const dirX = dx / distance;
      const dirY = dy / distance;

      /*
       * Perpendicular direction.
       */
      const perpX = -dirY;
      const perpY = dirX;

      /*
       * Beam becomes wider as it travels.
       *
       * This is important for making it look like actual
       * stage lighting rather than a triangle.
       */
      const startWidth = height * 0.018;
      const endWidth = height * 0.2;

      /*
       * Extend the beam beyond the target so it fades
       * naturally into the lower stage/crowd.
       */
      const endX = beam.sourceX + dirX * distance * 1.35;
      const endY = beam.sourceY + dirY * distance * 1.35;

      /*
       * ----------------------------------------------------------
       * OUTER ATMOSPHERIC GLOW
       * ----------------------------------------------------------
       */

      ctx.save();

      ctx.globalCompositeOperation = "screen";

      /*
       * Very soft outer cone.
       */
      const outerGradient = ctx.createLinearGradient(
        beam.sourceX,
        beam.sourceY,
        endX,
        endY,
      );

      outerGradient.addColorStop(0, "rgba(240,124,34,0.18)");

      outerGradient.addColorStop(0.12, "rgba(240,124,34,0.12)");

      outerGradient.addColorStop(0.38, "rgba(240,124,34,0.055)");

      outerGradient.addColorStop(0.72, "rgba(240,124,34,0.018)");

      outerGradient.addColorStop(1, "rgba(240,124,34,0)");

      ctx.fillStyle = outerGradient;

      ctx.beginPath();

      ctx.moveTo(
        beam.sourceX - perpX * startWidth,
        beam.sourceY - perpY * startWidth,
      );

      ctx.lineTo(endX - perpX * endWidth, endY - perpY * endWidth);

      ctx.lineTo(endX + perpX * endWidth, endY + perpY * endWidth);

      ctx.lineTo(
        beam.sourceX + perpX * startWidth,
        beam.sourceY + perpY * startWidth,
      );

      ctx.closePath();

      ctx.fill();

      /*
       * ----------------------------------------------------------
       * MID VOLUMETRIC LAYER
       * ----------------------------------------------------------
       */

      const midWidth = endWidth * 0.52;

      const midGradient = ctx.createLinearGradient(
        beam.sourceX,
        beam.sourceY,
        endX,
        endY,
      );

      midGradient.addColorStop(0, "rgba(255,157,70,0.30)");

      midGradient.addColorStop(0.1, "rgba(240,124,34,0.18)");

      midGradient.addColorStop(0.32, "rgba(240,124,34,0.07)");

      midGradient.addColorStop(0.7, "rgba(240,124,34,0.018)");

      midGradient.addColorStop(1, "rgba(240,124,34,0)");

      ctx.fillStyle = midGradient;

      ctx.beginPath();

      ctx.moveTo(
        beam.sourceX - perpX * startWidth * 0.55,
        beam.sourceY - perpY * startWidth * 0.55,
      );

      ctx.lineTo(endX - perpX * midWidth, endY - perpY * midWidth);

      ctx.lineTo(endX + perpX * midWidth, endY + perpY * midWidth);

      ctx.lineTo(
        beam.sourceX + perpX * startWidth * 0.55,
        beam.sourceY + perpY * startWidth * 0.55,
      );

      ctx.closePath();

      ctx.fill();

      /*
       * ----------------------------------------------------------
       * HOT CENTER CORE
       * ----------------------------------------------------------
       */

      const coreWidth = endWidth * 0.16;

      const coreGradient = ctx.createLinearGradient(
        beam.sourceX,
        beam.sourceY,
        endX,
        endY,
      );

      coreGradient.addColorStop(0, "rgba(255,190,110,0.48)");

      coreGradient.addColorStop(0.08, "rgba(255,157,70,0.27)");

      coreGradient.addColorStop(0.25, "rgba(240,124,34,0.10)");

      coreGradient.addColorStop(0.55, "rgba(240,124,34,0.025)");

      coreGradient.addColorStop(1, "rgba(240,124,34,0)");

      ctx.fillStyle = coreGradient;

      ctx.beginPath();

      ctx.moveTo(
        beam.sourceX - perpX * startWidth * 0.3,
        beam.sourceY - perpY * startWidth * 0.3,
      );

      ctx.lineTo(endX - perpX * coreWidth, endY - perpY * coreWidth);

      ctx.lineTo(endX + perpX * coreWidth, endY + perpY * coreWidth);

      ctx.lineTo(
        beam.sourceX + perpX * startWidth * 0.3,
        beam.sourceY + perpY * startWidth * 0.3,
      );

      ctx.closePath();

      ctx.fill();

      /*
       * ----------------------------------------------------------
       * LIGHT SOURCE GLOW
       * ----------------------------------------------------------
       */

      const sourceGlow = ctx.createRadialGradient(
        beam.sourceX,
        beam.sourceY,
        0,
        beam.sourceX,
        beam.sourceY,
        height * 0.075,
      );

      sourceGlow.addColorStop(0, "rgba(255,220,170,0.95)");

      sourceGlow.addColorStop(0.08, "rgba(255,180,100,0.70)");

      sourceGlow.addColorStop(0.25, "rgba(240,124,34,0.32)");

      sourceGlow.addColorStop(0.55, "rgba(240,124,34,0.08)");

      sourceGlow.addColorStop(1, "rgba(240,124,34,0)");

      ctx.fillStyle = sourceGlow;

      ctx.beginPath();

      ctx.arc(beam.sourceX, beam.sourceY, height * 0.075, 0, Math.PI * 2);

      ctx.fill();

      ctx.restore();

      /*
       * ----------------------------------------------------------
       * SUBTLE CORE SHAFT
       *
       * Adds the concentrated "real light" feeling.
       * ----------------------------------------------------------
       */

      ctx.save();

      ctx.globalCompositeOperation = "screen";

      const shaftGradient = ctx.createLinearGradient(
        beam.sourceX,
        beam.sourceY,
        endX,
        endY,
      );

      shaftGradient.addColorStop(0, "rgba(255,200,130,0.32)");

      shaftGradient.addColorStop(0.12, "rgba(240,124,34,0.12)");

      shaftGradient.addColorStop(0.4, "rgba(240,124,34,0.025)");

      shaftGradient.addColorStop(1, "rgba(240,124,34,0)");

      ctx.fillStyle = shaftGradient;

      const shaftWidth = endWidth * 0.045;

      ctx.beginPath();

      ctx.moveTo(
        beam.sourceX - perpX * startWidth * 0.18,
        beam.sourceY - perpY * startWidth * 0.18,
      );

      ctx.lineTo(endX - perpX * shaftWidth, endY - perpY * shaftWidth);

      ctx.lineTo(endX + perpX * shaftWidth, endY + perpY * shaftWidth);

      ctx.lineTo(
        beam.sourceX + perpX * startWidth * 0.18,
        beam.sourceY + perpY * startWidth * 0.18,
      );

      ctx.closePath();

      ctx.fill();

      ctx.restore();
    };

    /*
     * ------------------------------------------------------------
     * ILLUMINATE FOG INSIDE BOTH BEAMS
     * ------------------------------------------------------------
     */

    const illuminateFog = (time: number) => {
      const beams = getBeams(time);

      ctx.save();

      ctx.globalCompositeOperation = "screen";

      for (const beam of beams) {
        const dx = beam.targetX - beam.sourceX;
        const dy = beam.targetY - beam.sourceY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const dirX = dx / distance;
        const dirY = dy / distance;

        for (const particle of fogParticles) {
          const px = particle.x - beam.sourceX;
          const py = particle.y - beam.sourceY;

          /*
           * Distance along the beam.
           */
          const projection = px * dirX + py * dirY;

          if (projection < 0 || projection > distance * 1.2) {
            continue;
          }

          /*
           * Position along beam.
           */
          const progress = projection / distance;

          /*
           * Beam gets wider farther away.
           */
          const beamWidth = height * (0.025 + progress * 0.2);

          /*
           * Perpendicular distance from beam center.
           */
          const perpendicularDistance = Math.abs(px * -dirY + py * dirX);

          if (perpendicularDistance > beamWidth) {
            continue;
          }

          /*
           * Soft edge instead of hard cutoff.
           */
          const edgeFactor = 1 - perpendicularDistance / beamWidth;

          /*
           * Distance falloff.
           */
          const distanceFactor = Math.max(0, 1 - progress * 0.75);

          const intensity = edgeFactor * distanceFactor * 0.24;

          if (intensity <= 0) continue;

          const size = particle.size * (0.8 + edgeFactor);

          const glow = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            size,
          );

          glow.addColorStop(0, `rgba(255,175,90,${intensity})`);

          glow.addColorStop(0.35, `rgba(240,124,34,${intensity * 0.45})`);

          glow.addColorStop(1, "rgba(240,124,34,0)");

          ctx.fillStyle = glow;

          ctx.beginPath();

          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);

          ctx.fill();
        }
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      const delta = lastTime === 0 ? 16 : Math.min(time - lastTime, 40);

      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      /*
       * 1. Draw the actual stage lights first.
       *
       * Fog will naturally sit inside the beams.
       */
      const beams = getBeams(time);

      for (const beam of beams) {
        drawVolumetricBeam(beam);
      }

      /*
       * 2. Move and render fog.
       */
      for (const particle of fogParticles) {
        particle.life += delta * 0.055;

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;

        particle.phase += delta * 0.0015;

        particle.x +=
          Math.sin(particle.phase + particle.y * 0.004) *
          particle.turbulence *
          0.035 *
          delta;

        particle.y += Math.cos(particle.phase * 0.7) * 0.01 * delta;

        particle.vx *= 0.9994;

        if (particle.life > particle.maxLife || particle.y < -particle.size) {
          Object.assign(particle, createFogParticle(false));
        }

        drawFogParticle(particle);
      }

      /*
       * 3. Continuous fog-machine emission.
       */
      emitFog();

      /*
       * 4. Light particles that are actually
       *    inside the two beams.
       */
      illuminateFog(time);

      animationFrame = requestAnimationFrame(animate);
    };

    /*
     * ------------------------------------------------------------
     * RESIZE
     * ------------------------------------------------------------
     */

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;

      height = window.innerHeight;

      canvas.width = width * dpr;

      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;

      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    initializeFog();

    animationFrame = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);

      ctx.clearRect(0, 0, width, height);
    };
  }, [activeScene]);

  return (
    <>
      {/* EXISTING DUST CANVAS — UNCHANGED */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      />

      {/* STAGE REVEAL ATMOSPHERE — ONLY MOUNTS FOR SCENE 07 */}
      {activeScene === "06_main_stage_reveal" && (
        <canvas
          ref={fogCanvasRef}
          className="pointer-events-none absolute inset-0 z-21 h-full w-full"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default DustParticles;
