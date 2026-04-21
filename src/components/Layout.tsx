import { Outlet, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Github } from "lucide-react";

const footerColumns: Array<{
  title: string;
  links: Array<{ to: string; label: string }>;
}> = [
  {
    title: "Explore",
    links: [
      { to: "/directory", label: "Directory" },
      { to: "/compare", label: "Compare" },
      { to: "/data-sources", label: "Data Sources" },
    ],
  },
  {
    title: "Info",
    links: [
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/accessibility", label: "Accessibility" },
    ],
  },
];

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 rounded-md bg-white px-3 py-2 border z-50"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/40 print:hidden" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
            {/* Left: brand + tagline */}
            <div className="shrink-0 lg:max-w-xs">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <img
                  src="/greencompassimg.png"
                  alt="Compass Icon"
                  className="h-5 w-5"
                />
                <span className="font-bold text-[#1F631A]">
                  Duty Station Relocation
                </span>
              </Link>
              <p className="mt-3 text-xs italic text-muted-foreground leading-relaxed">
                Explore and compare border duty stations across the country
                before you relocate.
              </p>
            </div>

            {/* Middle: nav columns */}
            <div className="flex flex-wrap gap-10 sm:gap-14 flex-1">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-[#0A4A0A] font-bold text-sm mb-3">
                    {column.title}
                  </h2>
                  <ul className="space-y-2">
                    {column.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right: attribution */}
            <div className="shrink-0 lg:text-right">
              <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 lg:justify-end">
                <a
                  href="https://github.com/MetaPhase-Consulting/dutystation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  aria-label="Open Source"
                >
                  <Github className="h-4 w-4" />
                  Open Source
                </a>
                <span aria-hidden="true">|</span>
                <a
                  href="https://metaphase.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Built by{" "}
                  <span
                    data-brand="metaphase"
                    className="text-orange-500 font-semibold"
                  >
                    MetaPhase
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
