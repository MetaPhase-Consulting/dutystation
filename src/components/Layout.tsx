
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Github, CompassIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-4 md:px-0">
            <Link to="/" className="flex flex-col items-start gap-1 text-sm text-muted-foreground hover:text-foreground">
              <div className="flex items-center gap-2">
                <img 
                  src="/greencompassimg.png" 
                  alt="Compass Icon" 
                  className="h-5 w-5"
                />
                <span className="font-bold text-[#1F631A]">CBP Duty Location Explorer</span>
              </div>
              <span className="text-xs text-muted-foreground">Explore and compare CBP duty locations</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MetaPhase-Consulting/dutystation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              aria-label="Open Source"
            >
              <Github className="h-5 w-5 mr-1" />
              Open Source
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="https://metaphase.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              Built by <span className="text-orange-500 font-semibold ml-1">MetaPhase</span>
            </a>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
