"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();
    window.addEventListener("resize", resize);

    // Wave configuration - MORE VISIBLE
    const waves = [
      { 
        y: height * 0.35, 
        length: 0.006, 
        amplitude: 100, 
        speed: 0.015, 
        offset: 0,
        color: "rgba(76, 175, 80, 0.15)",
        glow: "rgba(76, 175, 80, 0.5)"
      },
      { 
        y: height * 0.55, 
        length: 0.009, 
        amplitude: 80, 
        speed: -0.012, 
        offset: 2,
        color: "rgba(33, 150, 243, 0.12)",
        glow: "rgba(33, 150, 243, 0.4)"
      },
      { 
        y: height * 0.75, 
        length: 0.005, 
        amplitude: 120, 
        speed: 0.008, 
        offset: 4,
        color: "rgba(156, 39, 176, 0.10)",
        glow: "rgba(156, 39, 176, 0.35)"
      },
      { 
        y: height * 0.45, 
        length: 0.012, 
        amplitude: 60, 
        speed: -0.020, 
        offset: 1,
        color: "rgba(255, 152, 0, 0.08)",
        glow: "rgba(255, 152, 0, 0.3)"
      },
    ];

    // Floating orbs - MORE VISIBLE, BIGGER, MORE VIBRANT
    const orbs = [
      { x: width * 0.15, y: height * 0.25, radius: 300, color: "rgba(76, 175, 80, 0.35)", dx: 0.4, dy: 0.25 },
      { x: width * 0.85, y: height * 0.65, radius: 350, color: "rgba(33, 150, 243, 0.30)", dx: -0.25, dy: 0.35 },
      { x: width * 0.5, y: height * 0.5, radius: 280, color: "rgba(156, 39, 176, 0.25)", dx: 0.2, dy: -0.3 },
      { x: width * 0.25, y: height * 0.75, radius: 250, color: "rgba(255, 152, 0, 0.20)", dx: -0.3, dy: -0.2 },
      { x: width * 0.75, y: height * 0.2, radius: 220, color: "rgba(76, 175, 80, 0.25)", dx: 0.15, dy: 0.4 },
      { x: width * 0.4, y: height * 0.85, radius: 200, color: "rgba(33, 150, 243, 0.20)", dx: -0.2, dy: -0.15 },
    ];

    let time = 0;

    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0a0a0f");
      gradient.addColorStop(0.5, "#12121a");
      gradient.addColorStop(1, "#0d0d14");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating orbs with glow - MORE VISIBLE
      orbs.forEach((orb) => {
        // Update position
        orb.x += orb.dx;
        orb.y += orb.dy;

        // Bounce off edges
        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        // Draw orb with stronger glow
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        orbGradient.addColorStop(0, orb.color);
        orbGradient.addColorStop(0.4, orb.color.replace(/[\d.]+\)$/, "0.15)"));
        orbGradient.addColorStop(1, "transparent");

        // Outer glow
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 1.3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
          orb.x, orb.y, orb.radius * 0.5,
          orb.x, orb.y, orb.radius * 1.3
        );
        glowGradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, "0.1)"));
        glowGradient.addColorStop(1, "transparent");
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Main orb
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();
      });

      // Draw animated waves - MORE VISIBLE
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 3) {
          const y = wave.y + 
            Math.sin(x * wave.length + time * wave.speed + wave.offset) * wave.amplitude +
            Math.sin(x * wave.length * 0.5 + time * wave.speed * 1.3) * wave.amplitude * 0.6;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave fill with stronger gradient
        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, height);
        waveGradient.addColorStop(0, wave.color);
        waveGradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)$/, "0.05)"));
        waveGradient.addColorStop(1, "transparent");
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // Wave stroke with stronger glow
        ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, "0.4)");
        ctx.lineWidth = 3;
        ctx.shadowColor = wave.glow;
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw glossy overlay
      const glossGradient = ctx.createLinearGradient(0, 0, width, height);
      glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.03)");
      glossGradient.addColorStop(0.5, "transparent");
      glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.02)");
      ctx.fillStyle = glossGradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle noise texture
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      for (let i = 0; i < width; i += 6) {
        for (let j = 0; j < height; j += 6) {
          if (Math.random() > 0.6) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0d0d14 100%)" 
      }}
    />
  );
}

// Simpler CSS-only background for pages that don't need canvas - SUPER VISIBLE
export function StaticBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0d0d14 100%)",
      }}
    >
      {/* SUPER VISIBLE Animated gradient orbs - positioned to be clearly visible */}
      <div 
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(76, 175, 80, 0.7) 0%, rgba(76, 175, 80, 0.3) 40%, transparent 70%)",
          top: "5%",
          left: "5%",
          animation: "float 12s ease-in-out infinite",
          filter: "blur(20px)",
          opacity: 1,
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(33, 150, 243, 0.65) 0%, rgba(33, 150, 243, 0.25) 40%, transparent 70%)",
          bottom: "10%",
          right: "5%",
          animation: "float 18s ease-in-out infinite reverse",
          filter: "blur(25px)",
          opacity: 0.95,
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(156, 39, 176, 0.6) 0%, rgba(156, 39, 176, 0.2) 40%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse 8s ease-in-out infinite",
          filter: "blur(15px)",
          opacity: 0.9,
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(255, 152, 0, 0.55) 0%, rgba(255, 152, 0, 0.15) 40%, transparent 70%)",
          top: "15%",
          right: "15%",
          animation: "float 15s ease-in-out infinite",
          filter: "blur(22px)",
          opacity: 0.85,
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(76, 175, 80, 0.5) 0%, rgba(76, 175, 80, 0.15) 40%, transparent 70%)",
          bottom: "25%",
          left: "15%",
          animation: "float 10s ease-in-out infinite reverse",
          filter: "blur(18px)",
          opacity: 0.8,
        }}
      />
      
      {/* SUPER VISIBLE Animated waves */}
      <svg 
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "600px", opacity: 0.8 }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(76, 175, 80, 0.6)" />
            <stop offset="40%" stopColor="rgba(76, 175, 80, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(33, 150, 243, 0.5)" />
            <stop offset="40%" stopColor="rgba(33, 150, 243, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(156, 39, 176, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient1)"
          d="M0,100 C240,200 480,0 720,100 C960,200 1200,0 1440,100 L1440,600 L0,600 Z"
          style={{
            animation: "wave 6s ease-in-out infinite",
          }}
        />
        <path
          fill="url(#waveGradient2)"
          d="M0,150 C360,50 540,250 720,150 C900,50 1080,250 1440,150 L1440,600 L0,600 Z"
          style={{
            animation: "wave 8s ease-in-out infinite reverse",
          }}
        />
        <path
          fill="url(#waveGradient3)"
          d="M0,200 C480,300 720,100 960,200 C1200,300 1320,150 1440,200 L1440,600 L0,600 Z"
          style={{
            animation: "wave 10s ease-in-out infinite",
          }}
        />
      </svg>

      {/* Animated gradient shift overlay */}
      <div 
        className="absolute -inset-full w-[200%] h-[200%]"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.1) 0%, transparent 60%)
          `,
          animation: "gradientShift 15s ease-in-out infinite",
        }}
      />

      {/* Light glossy overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%),
            linear-gradient(225deg, rgba(255,255,255,0.03) 0%, transparent 30%)
          `,
        }}
      />
    </div>
  );
}

// CSS keyframes for the static background
export const backgroundKeyframes = `
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(80px, -50px) scale(1.1);
  }
  50% {
    transform: translate(40px, 80px) scale(0.95);
  }
  75% {
    transform: translate(-60px, 40px) scale(1.05);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
}

@keyframes wave {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-40px) translateY(-20px);
  }
  50% {
    transform: translateX(20px) translateY(15px);
  }
  75% {
    transform: translateX(-20px) translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes gradientShift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(5%, 5%) rotate(2deg);
  }
  50% {
    transform: translate(-3%, 6%) rotate(-1.5deg);
  }
  75% {
    transform: translate(6%, -4%) rotate(1deg);
  }
}
`;
