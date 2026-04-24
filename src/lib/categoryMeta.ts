import {
  Activity,
  Briefcase,
  Car,
  CloudSun,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  Package,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { StationLinkCategory, SummaryCategory } from "@/types/station";

export interface CategoryMeta {
  key: StationLinkCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  hasSummary: boolean;
}

export const CATEGORY_META: Record<StationLinkCategory, CategoryMeta> = {
  realEstate: {
    key: "realEstate",
    label: "Real Estate",
    description: "Housing options and property listings",
    icon: Home,
    hasSummary: true,
  },
  schools: {
    key: "schools",
    label: "Schools",
    description: "Local public and private schools",
    icon: GraduationCap,
    hasSummary: true,
  },
  crime: {
    key: "crime",
    label: "Crime & Safety",
    description: "Area crime rates and safety index",
    icon: Shield,
    hasSummary: true,
  },
  costOfLiving: {
    key: "costOfLiving",
    label: "Cost of Living",
    description: "How expenses compare to the US average",
    icon: DollarSign,
    hasSummary: true,
  },
  weather: {
    key: "weather",
    label: "Weather",
    description: "Typical climate across the year",
    icon: CloudSun,
    hasSummary: true,
  },
  transit: {
    key: "transit",
    label: "Transit",
    description: "Walkability and nearest major airport",
    icon: Car,
    hasSummary: true,
  },
  demographics: {
    key: "demographics",
    label: "Demographics",
    description: "Population, age, and household income",
    icon: Users,
    hasSummary: true,
  },
  healthcare: {
    key: "healthcare",
    label: "Healthcare",
    description: "Nearby hospitals and VA facilities",
    icon: Heart,
    hasSummary: true,
  },
  jobs: {
    key: "jobs",
    label: "Jobs",
    description: "Unemployment and regional industries",
    icon: Briefcase,
    hasSummary: true,
  },
  movingTips: {
    key: "movingTips",
    label: "Moving Tips",
    description: "Moving guidance and checklists",
    icon: Package,
    hasSummary: false,
  },
};

export const SUMMARY_CATEGORY_META: readonly CategoryMeta[] = [
  CATEGORY_META.weather,
  CATEGORY_META.costOfLiving,
  CATEGORY_META.realEstate,
  CATEGORY_META.schools,
  CATEGORY_META.crime,
  CATEGORY_META.demographics,
  CATEGORY_META.jobs,
  CATEGORY_META.healthcare,
  CATEGORY_META.transit,
] as const;

// Fallback icon for anything unknown (e.g., future categories the data
// layer knows about but the UI hasn't been updated for).
export const DEFAULT_CATEGORY_ICON: LucideIcon = Activity;

export function metaForCategory(category: StationLinkCategory): CategoryMeta {
  return CATEGORY_META[category];
}

export function isSummaryCategory(category: StationLinkCategory): category is SummaryCategory {
  return CATEGORY_META[category].hasSummary;
}
