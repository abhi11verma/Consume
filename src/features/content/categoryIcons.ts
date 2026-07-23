import {
  Video,
  BookOpen,
  FileText,
  Mic2,
  Star,
  Heart,
  Music,
  Code2,
  Globe,
  Camera,
  Coffee,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Tv,
  Rss,
  Film,
  Headphones,
  ScrollText,
  PenLine,
  Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const CATEGORY_ICON_REGISTRY: Record<string, LucideIcon> = {
  Video,
  BookOpen,
  FileText,
  Mic2,
  Star,
  Heart,
  Music,
  Code2,
  Globe,
  Camera,
  Coffee,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Tv,
  Rss,
  Film,
  Headphones,
  ScrollText,
  PenLine,
  Package,
}

export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICON_REGISTRY)

export function resolveIcon(name: string): LucideIcon {
  return CATEGORY_ICON_REGISTRY[name] ?? FileText
}
