import { useEffect, useRef } from "react";

interface BottomFogCanvasProps {
  className?: string;
  height?: number;
  density?: number;
  speed?: number;
  opacity?: number;
}

interface FogParticle {
  x: number;
  y: number;
  baseY: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  opacity: number;
  phase: number;
  phaseSpeed: number;
  depth: number;
}

export default function BottomFogCanvas({
  className = "",
  height = 420,
  density = 32,
  speed = 1,
  opacity = 0.72,
}: BottomFogCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let particles: FogParticle[] = [];
    let width = 0;
    let canvasHeight = height;
    let time = 0;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    /*
     * Creates an offscreen soft fog texture.
     * Reusing this texture is considerably faster than applying
     * large blur filters to every particle every frame.
     */
    const createFogTexture = () => {
      const texture = document.createElement("canvas");

      texture.width = 512;
      texture.height = 256;

      const textureCtx = texture.getContext("2d");

      if (!textureCtx) return texture;

      const gradient = textureCtx.createRadialGradient(
        256,
        150,
        0,
        256,
        150,
        240,
      );

      gradient.addColorStop(0, "rgba(255,255,255,0.72)");
      gradient.addColorStop(0.15, "rgba(245,247,250,0.5)");
      gradient.addColorStop(0.35, "rgba(230,234,240,0.25)");
      gradient.addColorStop(0.6, "rgba(215,220,228,0.10)");
      gradient.addColorStop(0.82, "rgba(210,215,225,0.035)");
      gradient.addColorStop(1, "rgba(210,215,225,0)");

      textureCtx.fillStyle = gradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);

      return texture;
    };

    const fogTexture = createFogTexture();

    const createParticle = (
      randomX = true,
      initialSpread = true,
    ): FogParticle => {
      const depth = Math.random();

      const particleWidth =
        width * (0.12 + Math.random() * 0.24) * (0.8 + depth * 0.7);

      const particleHeight = particleWidth * (0.25 + Math.random() * 0.23);

      const startY = initialSpread
        ? canvasHeight * (0.58 + Math.random() * 0.52)
        : canvasHeight * (0.88 + Math.random() * 0.22);

      return {
        x: randomX
          ? -particleWidth + Math.random() * (width + particleWidth * 2)
          : -particleWidth,
        y: startY,
        baseY: startY,

        width: particleWidth,
        height: particleHeight,

        speedX: (0.055 + Math.random() * 0.09) * (0.65 + depth * 0.6),

        speedY: 0.008 + Math.random() * 0.025,

        opacity: (0.065 + Math.random() * 0.15) * (0.55 + depth * 0.65),

        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.002 + Math.random() * 0.003,

        depth,
      };
    };

    const buildParticles = () => {
      particles = [];

      /*
       * Scale particle count slightly with screen width.
       * Keeps desktop fog dense without overwhelming mobile GPUs.
       */
      const screenMultiplier = Math.max(0.7, Math.min(1.5, width / 1400));

      const count = Math.round(density * screenMultiplier);

      for (let i = 0; i < count; i++) {
        particles.push(createParticle(true, true));
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      canvasHeight = rect.height;

      canvas.width = width * DPR;
      canvas.height = canvasHeight * DPR;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      buildParticles();
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const drawAtmosphericBase = () => {
      /*
       * Extremely subtle atmospheric haze connecting the
       * individual fog formations.
       */
      const haze = ctx.createLinearGradient(
        0,
        canvasHeight * 0.32,
        0,
        canvasHeight,
      );

      haze.addColorStop(0, "rgba(210,220,230,0)");
      haze.addColorStop(0.32, "rgba(210,220,230,0.015)");
      haze.addColorStop(0.62, "rgba(225,230,236,0.055)");
      haze.addColorStop(0.82, "rgba(235,238,242,0.12)");
      haze.addColorStop(1, "rgba(245,247,250,0.2)");

      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, canvasHeight);
    };

    const drawParticle = (particle: FogParticle) => {
      const turbulenceX =
        Math.sin(time * particle.phaseSpeed + particle.phase) *
        (15 + particle.depth * 24);

      const turbulenceY =
        Math.cos(time * particle.phaseSpeed * 0.62 + particle.phase * 1.7) *
        (3 + particle.depth * 8);

      /*
       * Very slow pulsating scale makes the fog look as though
       * it is expanding / compressing naturally.
       */
      const pulse =
        1 + Math.sin(time * particle.phaseSpeed * 0.72 + particle.phase) * 0.08;

      const drawX = particle.x + turbulenceX;
      const drawY = particle.y + turbulenceY;

      const drawWidth = particle.width * pulse;
      const drawHeight =
        particle.height *
        (1 + Math.cos(time * particle.phaseSpeed + particle.phase) * 0.05);

      ctx.save();

      /*
       * Front layers are brighter.
       * Rear layers remain subtle.
       */
      ctx.globalAlpha =
        particle.opacity * opacity * (0.55 + particle.depth * 0.7);

      ctx.globalCompositeOperation = "screen";

      ctx.drawImage(fogTexture, drawX, drawY, drawWidth, drawHeight);

      /*
       * A second shifted copy makes each cloud less symmetrical
       * and produces more complex overlapping density.
       */
      ctx.globalAlpha *= 0.45;

      ctx.drawImage(
        fogTexture,
        drawX - drawWidth * 0.27,
        drawY + drawHeight * 0.13,
        drawWidth * 0.78,
        drawHeight * 0.86,
      );

      ctx.restore();
    };

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      time++;

      ctx.clearRect(0, 0, width, canvasHeight);

      drawAtmosphericBase();

      /*
       * Render low-depth particles first,
       * creating proper atmospheric layering.
       */
      particles.sort((a, b) => a.depth - b.depth);

      particles.forEach((particle) => {
        particle.x += particle.speedX * speed;

        /*
         * Tiny upward motion gives the effect that the fog
         * is slowly rolling upward from the bottom.
         */
        particle.y -= particle.speedY * speed;

        drawParticle(particle);

        /*
         * Recycling gives us an infinite fog field.
         */
        if (particle.x > width + particle.width * 0.25) {
          const replacement = createParticle(false, false);

          particle.x = -replacement.width;
          particle.y = replacement.y;
          particle.baseY = replacement.baseY;
          particle.width = replacement.width;
          particle.height = replacement.height;
          particle.speedX = replacement.speedX;
          particle.speedY = replacement.speedY;
          particle.opacity = replacement.opacity;
          particle.phase = replacement.phase;
          particle.phaseSpeed = replacement.phaseSpeed;
          particle.depth = replacement.depth;
        }

        /*
         * Prevent fog from disappearing too high.
         */
        if (particle.y < canvasHeight * 0.42) {
          particle.y = canvasHeight * (0.82 + Math.random() * 0.22);
        }
      });

      /*
       * Bottom mist layer.
       *
       * This hides individual particles near the bottom and
       * makes the overall fog appear like a continuous volume.
       */
      const lowerMist = ctx.createLinearGradient(
        0,
        canvasHeight * 0.64,
        0,
        canvasHeight,
      );

      lowerMist.addColorStop(0, "rgba(235,240,245,0)");
      lowerMist.addColorStop(0.52, `rgba(230,235,241,${0.045 * opacity})`);
      lowerMist.addColorStop(0.78, `rgba(235,239,244,${0.11 * opacity})`);
      lowerMist.addColorStop(1, `rgba(245,247,250,${0.18 * opacity})`);

      ctx.fillStyle = lowerMist;
      ctx.fillRect(0, 0, width, canvasHeight);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [height, density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 h-full w-full ${className}`}
    />
  );
}
