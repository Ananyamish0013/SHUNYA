"use client";

import React, { useEffect, useRef } from "react";

export const FlameBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for physics wind displacement
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetWindX = 0;
    let targetWindY = 0;
    let currentWindX = 0;
    let currentWindY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      targetWindX = dx * 0.18;
      targetWindY = dy * 0.12;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // 1. BILLOWING SMOKE CLOUDS LAYER
    interface SmokeCloud {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      growth: number;
    }

    const smokeClouds: SmokeCloud[] = [];
    const smokeCount = 25;
    for (let i = 0; i < smokeCount; i++) {
      smokeClouds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 120 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.3,
        alpha: 0.15 + Math.random() * 0.25,
        growth: 0.05 + Math.random() * 0.1,
      });
    }

    // 2. IRREGULAR JAGGED EMBERS & ASH PARTICLES
    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      life: number;
      maxLife: number;
      type: "ember" | "ash" | "spark";
      color: string;
      alpha: number;
      points: { x: number; y: number }[];
    }

    const emberCount = 180;
    const embers: Ember[] = [];

    const createEmber = (initialY?: number): Ember => {
      const maxLife = 120 + Math.random() * 150;
      const isSpark = Math.random() < 0.15;
      const isAsh = !isSpark && Math.random() < 0.35;
      const type: "ember" | "ash" | "spark" = isSpark ? "spark" : isAsh ? "ash" : "ember";

      const size = type === "spark" ? 1.5 + Math.random() * 2 : type === "ash" ? 2.5 + Math.random() * 5 : 2 + Math.random() * 4.5;
      
      // Generate irregular angular polygon points for jagged debris look
      const pointsCount = 3 + Math.floor(Math.random() * 3);
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        const rad = size * (0.6 + Math.random() * 0.8);
        points.push({
          x: Math.cos(angle) * rad,
          y: Math.sin(angle) * rad,
        });
      }

      let color = "255, 201, 40"; // Amber #FFC928
      if (type === "ash") {
        color = "70, 62, 55"; // Dark ash grey
      } else if (Math.random() > 0.4) {
        color = "196, 90, 34"; // Burnt Orange #C45A22
      } else if (Math.random() > 0.3) {
        color = "143, 36, 28"; // Deep Red #8F241C
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + Math.random() * 30,
        size,
        speedY: type === "spark" ? 2.5 + Math.random() * 3 : type === "ash" ? 0.4 + Math.random() * 0.8 : 1.2 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        life: 0,
        maxLife,
        type,
        color,
        alpha: type === "ash" ? 0.3 + Math.random() * 0.4 : 0.4 + Math.random() * 0.55,
        points,
      };
    };

    for (let i = 0; i < emberCount; i++) {
      embers.push(createEmber(Math.random() * height));
    }

    // Flicker timing
    let time = 0;

    // Render loop
    const render = () => {
      time += 0.02;

      // Smoothly update wind
      currentWindX += (targetWindX - currentWindX) * 0.06;
      currentWindY += (targetWindY - currentWindY) * 0.06;
      targetWindX *= 0.94;
      targetWindY *= 0.94;

      // 1. Dark scorched backdrop base
      ctx.fillStyle = "#0A0908"; // Deep black/charcoal
      ctx.fillRect(0, 0, width, height);

      // 2. Distant scorched fire glow gradient at bottom with subtle flicker
      const flicker = Math.sin(time * 3) * 0.03 + Math.cos(time * 5) * 0.02;
      const fireGlowHeight = 320;
      const baseGlow = ctx.createLinearGradient(0, height, 0, height - fireGlowHeight);
      baseGlow.addColorStop(0, `rgba(143, 36, 28, ${0.35 + flicker})`); // Deep Crimson #8F241C
      baseGlow.addColorStop(0.4, `rgba(196, 90, 34, ${0.2 + flicker})`); // Burnt Orange #C45A22
      baseGlow.addColorStop(0.8, `rgba(40, 15, 10, ${0.1 + flicker})`);
      baseGlow.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.fillStyle = baseGlow;
      ctx.fillRect(0, height - fireGlowHeight, width, fireGlowHeight);

      // 3. Render Polluted Heavy Smoke Clouds
      for (let i = 0; i < smokeClouds.length; i++) {
        const s = smokeClouds[i];
        s.x += s.vx + currentWindX * 0.3;
        s.y += s.vy - currentWindY * 0.2;
        s.radius += s.growth * 0.1;

        if (s.y < -s.radius || s.x < -s.radius || s.x > width + s.radius) {
          s.x = Math.random() * width;
          s.y = height + s.radius;
          s.radius = 120 + Math.random() * 180;
        }

        const smokeGlow = ctx.createRadialGradient(s.x, s.y, 10, s.x, s.y, s.radius);
        smokeGlow.addColorStop(0, `rgba(22, 18, 15, ${s.alpha})`);
        smokeGlow.addColorStop(0.6, `rgba(16, 13, 11, ${s.alpha * 0.6})`);
        smokeGlow.addColorStop(1, "rgba(10, 9, 8, 0)");
        ctx.fillStyle = smokeGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Cursor Heat & Wind Aura Reaction
      const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 220);
      cursorGlow.addColorStop(0, "rgba(196, 90, 34, 0.12)");
      cursorGlow.addColorStop(0.5, "rgba(143, 36, 28, 0.06)");
      cursorGlow.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.fillStyle = cursorGlow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 220, 0, Math.PI * 2);
      ctx.fill();

      // 5. Render Irregular Jagged Embers, Ash, & Sparks
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.rotation += e.rotSpeed;

        // Mouse displacement force
        const dx = e.x - mouseX;
        const dy = e.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let cursorX = 0;
        let cursorY = 0;
        if (dist < 220 && dist > 0) {
          const force = (220 - dist) / 220;
          cursorX = (dx / dist) * force * 1.8;
          cursorY = (dy / dist) * force * 1.2;
        }

        // Particle physics
        if (e.type === "ash") {
          // Ash drifts downward and sways
          e.x += e.speedX + currentWindX + cursorX + Math.sin(e.life * 0.04) * 0.6;
          e.y += e.speedY * 0.6 - currentWindY * 0.2 - cursorY * 0.3;
        } else {
          // Embers and sparks rise upward
          e.x += e.speedX + currentWindX + cursorX + Math.sin(e.life * 0.05) * 0.8;
          e.y -= e.speedY - currentWindY * 0.4 - cursorY;
        }

        // Calculate opacity based on lifetime
        const lifeRatio = e.life / e.maxLife;
        let alpha = e.alpha;
        if (lifeRatio < 0.15) {
          alpha = e.alpha * (lifeRatio / 0.15);
        } else if (lifeRatio > 0.75) {
          alpha = e.alpha * (1 - (lifeRatio - 0.75) / 0.25);
        }

        // Render irregular polygon shape
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);

        ctx.beginPath();
        if (e.points.length > 0) {
          ctx.moveTo(e.points[0].x, e.points[0].y);
          for (let pIdx = 1; pIdx < e.points.length; pIdx++) {
            ctx.lineTo(e.points[pIdx].x, e.points[pIdx].y);
          }
        }
        ctx.closePath();

        ctx.fillStyle = `rgba(${e.color}, ${Math.max(0, alpha)})`;

        // Intense subtle glow for sparks and embers
        if (e.type === "spark") {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 201, 40, 0.8)";
        } else if (e.type === "ember") {
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(196, 90, 34, 0.5)";
        }

        ctx.fill();
        ctx.restore();

        // Recycle off-screen or dead particles
        if (e.life >= e.maxLife || e.y < -30 || e.y > height + 40 || e.x < -40 || e.x > width + 40) {
          embers[i] = createEmber();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#0A0908]"
    />
  );
};
