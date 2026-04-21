export function MapLegend() {
  const items: Array<{ color: string; label: string; bordered?: boolean }> = [
    { color: "#0A4A0A", label: "USBP" },
    { color: "#0B4A8B", label: "OFO" },
    { color: "#0F766E", label: "AMO" },
    { color: "#FFFFFF", label: "Incentive", bordered: true },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-md border bg-background px-3 py-1.5 text-xs"
      role="group"
      aria-label="Map legend"
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className={`inline-block h-3 w-3 rounded-full${
              item.bordered ? " border-2 border-[#C88A04]" : ""
            }`}
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
