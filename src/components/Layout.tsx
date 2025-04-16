
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Github, CompassIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
            <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <img 
                src="/lovable-uploads/04a76a92-9797-4b10-99ed-0d739e9bdd05.png"
                alt="CBP Logo"
                className="h-4 w-4"
              />
              <span className="font-bold">Duty Station Relocation</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MetaPhase-Consulting/"
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
              href="https://metaphaseconsulting.com/"
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
