import { useState, useEffect, useCallback } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface TypeWriterWord {
  text: string;
  mobileText?: string; // Shorter version for mobile
  gradient?: boolean;
}

interface TypeWriterProps {
  words: TypeWriterWord[];
  prefix?: string;
  suffix?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  cursorChar?: string;
  cursorColor?: string;
  className?: string;
  wrap?: boolean; // Allow text wrapping
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  words,
  prefix = "",
  suffix = "",
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2500,
  cursorChar = "|",
  cursorColor = "#4CAF50",
  className = "",
  wrap = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Get appropriate text based on screen size
  const currentWordObj = words[currentWordIndex];
  const currentWord = isMobile && currentWordObj?.mobileText 
    ? currentWordObj.mobileText 
    : currentWordObj?.text || "";
  const isGradient = currentWordObj?.gradient ?? true;

  // Reset when words change (responsive)
  useEffect(() => {
    setDisplayedText("");
    setCurrentWordIndex(0);
    setIsTyping(true);
    setIsDeleting(false);
  }, [isMobile, words]);

  // Initial delay before starting
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, 600);
    return () => clearTimeout(startTimeout);
  }, []);

  // Blink cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  const typeNextChar = useCallback(() => {
    if (displayedText.length < currentWord.length) {
      setDisplayedText(currentWord.slice(0, displayedText.length + 1));
    } else {
      // Finished typing current word, start pause
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
        setIsDeleting(true);
      }, pauseDuration);
    }
  }, [displayedText, currentWord, pauseDuration]);

  const deleteLastChar = useCallback(() => {
    if (displayedText.length > 0) {
      setDisplayedText((prev) => prev.slice(0, -1));
    } else {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setIsTyping(true);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }
  }, [displayedText, words.length]);

  // Main typing effect control
  useEffect(() => {
    if (!hasStarted || isPaused) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping && !isDeleting) {
      timeout = setTimeout(typeNextChar, typingSpeed);
    } else if (isDeleting && !isTyping) {
      timeout = setTimeout(deleteLastChar, deletingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [
    hasStarted,
    isTyping,
    isDeleting,
    isPaused,
    typeNextChar,
    deleteLastChar,
    typingSpeed,
    deletingSpeed,
  ]);

  return (
    <Box
      component="span"
      className={className}
      sx={{
        display: "inline",
        whiteSpace: wrap ? "normal" : "nowrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {prefix && (
        <Typography
          component="span"
          sx={{
            display: "inline",
            color: "inherit",
          }}
        >
          {prefix}
        </Typography>
      )}
      
      <Typography
        component="span"
        sx={{
          display: "inline",
          background: isGradient
            ? "linear-gradient(135deg, #4CAF50 0%, #2196F3 50%, #4CAF50 100%)"
            : "inherit",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: isGradient ? "text" : "unset",
          WebkitTextFillColor: isGradient ? "transparent" : "inherit",
          backgroundClip: isGradient ? "text" : "unset",
          animation: isGradient ? "gradient 5s ease infinite" : "none",
          fontWeight: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          letterSpacing: "inherit",
          fontFamily: "inherit",
        }}
      >
        {displayedText}
      </Typography>
      
      {/* Cursor */}
      <Box
        component="span"
        sx={{
          display: "inline-block",
          opacity: showCursor ? 1 : 0,
          color: cursorColor,
          ml: "2px",
          fontWeight: 300,
          transition: "opacity 0.1s ease",
          fontSize: "inherit",
          lineHeight: "inherit",
          verticalAlign: "baseline",
          minWidth: "0.1em",
          animation: "blink 1s ease-in-out infinite",
        }}
      >
        {cursorChar}
      </Box>
      
      {suffix && (
        <Typography
          component="span"
          sx={{
            display: "inline",
            color: "inherit",
          }}
        >
          {suffix}
        </Typography>
      )}
    </Box>
  );
};

// Pre-configured TypeWriter for VentureMate Hero Section
interface HeroTypeWriterProps {
  variant?: "headline" | "subheadline";
}

export const HeroTypeWriter: React.FC<HeroTypeWriterProps> = ({
  variant = "headline",
}) => {
  // Startup-focused rotating words with mobile alternatives
  const headlineWords: TypeWriterWord[] = [
    { text: "real business", mobileText: "business", gradient: true },
    { text: "thriving startup", mobileText: "startup", gradient: true },
    { text: "registered company", mobileText: "company", gradient: true },
    { text: "funded venture", mobileText: "venture", gradient: true },
    { text: "global brand", mobileText: "brand", gradient: true },
  ];

  const subheadlineWords: TypeWriterWord[] = [
    { text: "business plan", mobileText: "plan", gradient: true },
    { text: "brand identity", mobileText: "brand", gradient: true },
    { text: "pitch deck", mobileText: "deck", gradient: true },
    { text: "compliance checklist", mobileText: "compliance", gradient: true },
    { text: "launch roadmap", mobileText: "roadmap", gradient: true },
  ];

  const words = variant === "headline" ? headlineWords : subheadlineWords;

  if (variant === "headline") {
    return (
      <TypeWriter
        words={words}
        typingSpeed={70}
        deletingSpeed={40}
        pauseDuration={2000}
        cursorChar="|"
        cursorColor="#4CAF50"
      />
    );
  }

  return (
    <TypeWriter
      prefix="Generate your "
      words={subheadlineWords}
      suffix=" in minutes"
      typingSpeed={60}
      deletingSpeed={35}
      pauseDuration={2200}
      cursorChar="|"
      cursorColor="#2196F3"
    />
  );
};

export default TypeWriter;
