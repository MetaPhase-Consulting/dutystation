
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              CBP Relocation Navigator - A tool for CBP job applicants
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            <a
              href="https://www.cbp.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              U.S. Customs and Border Protection
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
