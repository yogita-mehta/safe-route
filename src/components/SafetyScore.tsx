import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export function SafetyScore({ score, size = "md", showLabel = true, animated = true }: SafetyScoreProps) {
  const getScoreConfig = (score: number) => {
    if (score >= 80) {
      return {
        label: "Very Safe",
        icon: ShieldCheck,
        bgClass: "bg-safe/10",
        textClass: "text-safe",
        borderClass: "border-safe/30",
        glowClass: "glow-safe",
      };
    }
    if (score >= 60) {
      return {
        label: "Moderately Safe",
        icon: Shield,
        bgClass: "bg-primary/10",
        textClass: "text-primary",
        borderClass: "border-primary/30",
        glowClass: "glow-primary",
      };
    }
    if (score >= 40) {
      return {
        label: "Use Caution",
        icon: AlertTriangle,
        bgClass: "bg-warning/10",
        textClass: "text-warning",
        borderClass: "border-warning/30",
        glowClass: "",
      };
    }
    return {
      label: "High Risk",
      icon: ShieldAlert,
      bgClass: "bg-danger/10",
      textClass: "text-danger",
      borderClass: "border-danger/30",
      glowClass: "glow-danger",
    };
  };

  const config = getScoreConfig(score);
  const Icon = config.icon;

  const sizeClasses = {
    sm: { container: "w-16 h-16", icon: 16, text: "text-lg", label: "text-xs" },
    md: { container: "w-24 h-24", icon: 24, text: "text-2xl", label: "text-sm" },
    lg: { container: "w-32 h-32", icon: 32, text: "text-4xl", label: "text-base" },
  };

  const sizeConfig = sizeClasses[size];

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const Container = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      }
    : {};

  return (
    <Container
      className={cn(
        "relative flex flex-col items-center justify-center rounded-full border-2",
        sizeConfig.container,
        config.bgClass,
        config.borderClass,
        config.glowClass
      )}
      {...animationProps}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted/20"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className={config.textClass}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <Icon size={sizeConfig.icon} className={cn(config.textClass, "mb-0.5")} />
      <span className={cn("font-display font-bold", sizeConfig.text, config.textClass)}>
        {score}
      </span>
      {showLabel && (
        <span className={cn("absolute -bottom-6 whitespace-nowrap font-medium", sizeConfig.label, config.textClass)}>
          {config.label}
        </span>
      )}
    </Container>
  );
}
