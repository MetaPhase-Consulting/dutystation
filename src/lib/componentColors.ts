import { ComponentType } from "@/types/station";

// Per-component accent colors. These hex values also live in the map marker
// SVG (src/components/StationMap.tsx) and the legend (MapLegend.tsx) — if you
// change one, change all three.
//
// Tailwind's JIT scans for full class strings, so each variant is expressed
// as a literal className that the scanner can pick up.
export const componentAccent: Record<
  ComponentType,
  {
    text: string;
    buttonClass: string;
    inactiveHoverClass: string;
    iconClass: string;
    hex: string;
  }
> = {
  USBP: {
    text: "text-[#0A4A0A]",
    buttonClass: "bg-[#0A4A0A] hover:bg-[#083806] text-white",
    inactiveHoverClass: "hover:bg-[#0A4A0A]/10 hover:text-[#0A4A0A]",
    iconClass: "text-[#0A4A0A]",
    hex: "#0A4A0A",
  },
  OFO: {
    text: "text-[#0B4A8B]",
    buttonClass: "bg-[#0B4A8B] hover:bg-[#08376A] text-white",
    inactiveHoverClass: "hover:bg-[#0B4A8B]/10 hover:text-[#0B4A8B]",
    iconClass: "text-[#0B4A8B]",
    hex: "#0B4A8B",
  },
  AMO: {
    text: "text-[#0F766E]",
    buttonClass: "bg-[#0F766E] hover:bg-[#0B5A54] text-white",
    inactiveHoverClass: "hover:bg-[#0F766E]/10 hover:text-[#0F766E]",
    iconClass: "text-[#0F766E]",
    hex: "#0F766E",
  },
};
