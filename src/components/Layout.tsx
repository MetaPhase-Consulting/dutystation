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
  const year = new Date().getFullYear();

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
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            {/* Nav columns */}
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

            {/* Brand + attribution */}
            <div className="shrink-0 lg:text-right">
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
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2 lg:justify-end">
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
              <p className="text-xs text-muted-foreground mt-1">
                &copy; {year} &middot; MIT License
              </p>
            </div>
          </div>

          {/* Site-wide disclaimer bar */}
          <div className="border-t mt-8 pt-4">
            <p className="text-xs text-muted-foreground">
              This website is an informational, non-official resource and is
              not an official U.S. government system.{" "}
              <Link
                to="/disclaimer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Full disclaimer
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
