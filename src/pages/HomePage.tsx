import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { dutyStations, searchDutyStations } from "@/data/dutyStations";

export default function HomePage() {
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
    <div className="flex flex-col min-h-[calc(100vh-14rem)]">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Welcome to CBP Relocation Navigator
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Next CBP Duty Station
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore and compare CBP duty station locations before you relocate. Make informed decisions about your next career move.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative w-full">
                <Command className="relative border rounded-lg">
                  <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <CommandInput 
                      placeholder="Search duty stations..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="flex w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  {searchQuery && (
                    <CommandList className="absolute top-full w-full z-50 bg-popover border rounded-b-lg mt-[-1px]">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Duty Stations">
                        {filteredStations.map((station) => (
                          <CommandItem
                            key={station.id}
                            onSelect={() => {
                              navigate(`/directory/${station.id}`);
                            }}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            {station.name} - {station.city}, {station.state}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </div>
              <p className="text-xs text-muted-foreground">
                Search by city, state, or duty station name
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">
                <MapPin className="h-4 w-4" />
                <span>Find Locations</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Explore CBP Duty Stations
                </h2>
                <p className="text-muted-foreground">
                  Browse our comprehensive directory of CBP duty stations across the United States.
                </p>
              </div>
              <div>
                <Button variant="outline" onClick={() => navigate("/directory")}>
                  View Directory
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">
                <Compass className="h-4 w-4" />
                <span>Research Resources</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Access External Resources
                </h2>
                <p className="text-muted-foreground">
                  Get information on real estate, schools, crime statistics, cost of living, and more.
                </p>
              </div>
              <div>
                <Button variant="outline" onClick={() => navigate("/directory")}>
                  Explore Resources
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span>Side-by-Side Comparison</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Compare Duty Stations
                </h2>
                <p className="text-muted-foreground">
                  Use our comparison tool to evaluate two different duty stations side by side.
                </p>
              </div>
              <div>
                <Button variant="outline" onClick={() => navigate("/compare")}>
                  Compare Stations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
