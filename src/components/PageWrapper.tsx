"use client";

import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  centered?: boolean;
  withPadding?: boolean;
}

export function PageWrapper({
  children,
  className = "",
  fullWidth = false,
  centered = false,
  withPadding = true,
}: PageWrapperProps) {
  return (
    <div
      className={`
        min-h-screen
        relative
        ${withPadding ? "px-4 sm:px-6 lg:px-8" : ""}
        ${centered ? "flex items-center justify-center" : ""}
        ${className}
      `}
    >
      {/* Content container */}
      <div className={`${fullWidth ? "w-full" : "max-w-7xl mx-auto"}`}>
        {children}
      </div>
    </div>
  );
}

// Glass card component for consistent card styling
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "none" | "primary" | "secondary" | "purple";
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  glow = "none",
}: GlassCardProps) {
  const glowClasses = {
    none: "",
    primary: "hover:shadow-[0_0_40px_rgba(76,175,80,0.3)]",
    secondary: "hover:shadow-[0_0_40px_rgba(33,150,243,0.3)]",
    purple: "hover:shadow-[0_0_40px_rgba(156,39,176,0.3)]",
  };

  return (
    <div
      className={`
        relative
        rounded-2xl
        p-6
        bg-gradient-to-br from-[#12121a]/90 to-[#1a1a2e]/90
        border border-white/5
        backdrop-blur-xl
        shadow-[0_4px_30px_rgba(0,0,0,0.3)]
        overflow-hidden
        ${hover ? "transition-all duration-300 hover:-translate-y-1" : ""}
        ${glowClasses[glow]}
        ${className}
      `}
    >
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {children}
    </div>
  );
}

// Animated gradient text
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = "",
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={`
        bg-gradient-to-r from-[#4CAF50] via-[#2196F3] to-[#4CAF50]
        bg-clip-text text-transparent
        ${animate ? "animate-gradient bg-[length:200%_auto]" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Animated button with glow effect
interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#4CAF50] to-[#43A047]
      hover:shadow-[0_0_30px_rgba(76,175,80,0.4)]
      text-white
    `,
    secondary: `
      bg-gradient-to-r from-[#2196F3] to-[#1E88E5]
      hover:shadow-[0_0_30px_rgba(33,150,243,0.4)]
      text-white
    `,
    outline: `
      bg-transparent
      border-2 border-white/20
      hover:border-[#4CAF50]/50
      hover:shadow-[0_0_30px_rgba(76,175,80,0.2)]
      text-white
    `,
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        rounded-xl
        transition-all
        duration-300
        overflow-hidden
        group
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"}
        ${className}
      `}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {children}
    </button>
  );
}

// Section divider with gradient
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="relative flex justify-center">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2196F3]" />
      </div>
    </div>
  );
}

// Floating orb component for decorative use
interface FloatingOrbProps {
  color: "green" | "blue" | "purple" | "orange";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingOrb({
  color,
  size = "md",
  className = "",
  style,
}: FloatingOrbProps) {
  const colorClasses = {
    green: "bg-[radial-gradient(circle,rgba(76,175,80,0.4)_0%,transparent_70%)]",
    blue: "bg-[radial-gradient(circle,rgba(33,150,243,0.4)_0%,transparent_70%)]",
    purple: "bg-[radial-gradient(circle,rgba(156,39,176,0.3)_0%,transparent_70%)]",
    orange: "bg-[radial-gradient(circle,rgba(255,152,0,0.3)_0%,transparent_70%)]",
  };

  const sizeClasses = {
    sm: "w-[200px] h-[200px]",
    md: "w-[400px] h-[400px]",
    lg: "w-[600px] h-[600px]",
    xl: "w-[800px] h-[800px]",
  };

  return (
    <div
      className={`
        absolute
        rounded-full
        pointer-events-none
        blur-[60px]
        animate-float
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={style}
    />
  );
}
