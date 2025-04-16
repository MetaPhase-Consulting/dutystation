
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Github } from "lucide-react";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-4 md:px-0">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/MetaPhase-Consulting/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/MetaPhase-Consulting/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                MIT License
              </a>
            </div>
            <span className="text-muted-foreground">|</span>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Duty Station Relocation - A tool for job applicants
            </p>
          </div>
          <a
            href="https://metaphaseconsulting.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            Built by MetaPhase
          </a>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
