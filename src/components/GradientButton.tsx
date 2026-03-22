import { Button, ButtonProps, styled } from "@mui/material";

// Gradient animation keyframes
const gradientAnimation = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Inject animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = gradientAnimation;
  document.head.appendChild(style);
}

interface GradientButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "contained";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  to?: string;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "variantType" && prop !== "sizeType" && prop !== "animated",
})<{
  variantType: string;
  sizeType: string;
  animated?: boolean;
}>(({ variantType, sizeType, animated }) => {
  // Base styles for all variants
  const baseStyles = {
    borderRadius: "9999px", // Fully rounded/pill shape
    fontWeight: 600,
    textTransform: "none" as const,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative" as const,
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "9999px",
      padding: "2px",
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
  };

  // Size variants
  const sizeStyles = {
    sm: {
      padding: "8px 20px",
      fontSize: "0.875rem",
      minHeight: "36px",
    },
    md: {
      padding: "12px 28px",
      fontSize: "1rem",
      minHeight: "48px",
    },
    lg: {
      padding: "16px 36px",
      fontSize: "1.125rem",
      minHeight: "56px",
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      background: animated
        ? "linear-gradient(90deg, #4CAF50, #2196F3, #4CAF50)"
        : "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)",
      backgroundSize: animated ? "200% 200%" : "100% 100%",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3), 0 4px 15px rgba(33, 150, 243, 0.2)",
      animation: animated ? "gradientShift 3s ease infinite" : "none",
      "&:hover": {
        transform: "translateY(-2px) scale(1.02)",
        boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4), 0 8px 25px rgba(33, 150, 243, 0.3)",
      },
      "&:active": {
        transform: "translateY(0) scale(0.98)",
      },
      "&:disabled": {
        background: "linear-gradient(135deg, #2d5a2f 0%, #135a91 100%)",
        opacity: 0.6,
        cursor: "not-allowed",
      },
    },
    secondary: {
      background: "transparent",
      color: "#fff",
      border: "2px solid transparent",
      backgroundImage:
        "linear-gradient(#12121a, #12121a), linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)",
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
      boxShadow: "0 2px 8px rgba(76, 175, 80, 0.1)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.2), 0 4px 15px rgba(33, 150, 243, 0.15)",
        backgroundImage:
          "linear-gradient(rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.1)), linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    outline: {
      background: "transparent",
      color: "#fff",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4CAF50",
        background: "rgba(76, 175, 80, 0.1)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.2)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    ghost: {
      background: "transparent",
      color: "#94a3b8",
      border: "none",
      boxShadow: "none",
      "&:hover": {
        color: "#4CAF50",
        background: "rgba(76, 175, 80, 0.05)",
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    contained: {
      background: animated
        ? "linear-gradient(90deg, #4CAF50, #2196F3, #4CAF50)"
        : "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)",
      backgroundSize: animated ? "200% 200%" : "100% 100%",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3), 0 4px 15px rgba(33, 150, 243, 0.2)",
      animation: animated ? "gradientShift 3s ease infinite" : "none",
      "&:hover": {
        transform: "translateY(-2px) scale(1.02)",
        boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4), 0 8px 25px rgba(33, 150, 243, 0.3)",
      },
      "&:active": {
        transform: "translateY(0) scale(0.98)",
      },
      "&:disabled": {
        background: "linear-gradient(135deg, #2d5a2f 0%, #135a91 100%)",
        opacity: 0.6,
        cursor: "not-allowed",
      },
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[sizeType as keyof typeof sizeStyles],
    ...variantStyles[variantType as keyof typeof variantStyles],
  };
});

export function GradientButton({
  variant = "primary",
  size = "md",
  animated = false,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <StyledButton
      variantType={variant}
      sizeType={size}
      animated={animated}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default GradientButton;
