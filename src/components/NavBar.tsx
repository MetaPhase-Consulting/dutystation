import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Map, CompassIcon, ArrowRightLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { searchDutyStations } from "@/data/dutyStations";

export function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredStations = searchDutyStations(searchQuery);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <CompassIcon className="h-6 w-6 text-cbp-brightBlue" />
            <span className="hidden font-bold sm:inline-block">
              CBP Relocation Navigator
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/directory"
              className="transition-colors hover:text-cbp-brightBlue flex items-center gap-1"
            >
              <Map className="h-4 w-4" />
              Directory
            </Link>
            <Link
              to="/compare"
              className="transition-colors hover:text-cbp-brightBlue flex items-center gap-1"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Compare
            </Link>
          </nav>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="mr-2 md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center gap-2 mb-8 mt-4">
              <CompassIcon className="h-6 w-6 text-cbp-brightBlue" />
              <span className="font-bold">CBP Relocation Navigator</span>
            </Link>
            <nav className="flex flex-col gap-4">
              <Link
                to="/directory"
                className="flex items-center gap-2 text-foreground hover:text-cbp-brightBlue"
              >
                <Map className="h-5 w-5" />
                Directory
              </Link>
              <Link
                to="/compare"
                className="flex items-center gap-2 text-foreground hover:text-cbp-brightBlue"
              >
                <ArrowRightLeft className="h-5 w-5" />
                Compare
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="md:hidden mr-2 flex items-center gap-2">
          <CompassIcon className="h-6 w-6 text-cbp-brightBlue" />
          <span className="font-bold text-sm">CBP Relocation</span>
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search duty stations..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                  {filteredStations.length === 0 ? (
                    <div className="py-6 text-center text-sm">No results found.</div>
                  ) : (
                    <div className="p-1">
                      {filteredStations.map((station) => (
                        <div
                          key={station.id}
                          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                          onClick={() => {
                            navigate(`/station/${station.id}`);
                            setSearchQuery("");
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {station.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
