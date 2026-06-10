import React from "react";
import {
  BarChart2,
  BookOpen,
  Calendar,
  Link as LinkIcon,
  Briefcase,
  Globe,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Zap,
  FileText,
  HelpCircle
} from "lucide-react";

interface RenderIconProps {
  icon?: string;
  className?: string;
  size?: number;
  fallback?: React.ReactNode;
}

export default function RenderIcon({
  icon,
  className = "",
  size = 20,
  fallback = null
}: RenderIconProps) {
  if (!icon) return <>{fallback}</>;

  // Handle URL (Image/Icon) path
  if (icon.startsWith("http") || icon.startsWith("/") || icon.includes(".")) {
    return (
      <img
        src={icon}
        alt=""
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Handle static emojis or mapping to Lucide Icons
  const lowerIcon = icon.trim();

  switch (lowerIcon) {
    case "👥":
    case "users":
      return <Users className={className} size={size} />;
    case "🌍":
    case "globe":
      return <Globe className={className} size={size} />;
    case "💼":
    case "briefcase":
      return <Briefcase className={className} size={size} />;
    case "🎯":
    case "target":
      return <Target className={className} size={size} />;
    case "🏆":
    case "trophy":
      return <Trophy className={className} size={size} />;
    case "📈":
    case "trending-up":
      return <TrendingUp className={className} size={size} />;
    case "📊":
    case "bar-chart":
      return <BarChart2 className={className} size={size} />;
    case "📚":
    case "book-open":
      return <BookOpen className={className} size={size} />;
    case "⚡":
    case "zap":
      return <Zap className={className} size={size} />;
    case "🗓":
    case "calendar":
      return <Calendar className={className} size={size} />;
    case "🔗":
    case "link":
      return <LinkIcon className={className} size={size} />;
    case "document":
      return <FileText className={className} size={size} />;
    default:
      // If it's a single emoji we couldn't map, try to render it safely
      return <span className={className} style={{ fontSize: size }}>{icon}</span>;
  }
}
