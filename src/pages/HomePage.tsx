import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
              <form onSubmit={handleSearch}>
                <div className="relative w-full">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search duty stations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full"
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
                                  {station.name} - {station.city}, {station.state}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button type="submit">Search</Button>
                  </div>
                </div>
              </form>
              <p className="text-xs text-muted-foreground">
                Search by city, state, or duty station name
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 xl:gap-16">
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Why Choose CBP?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Make a Difference at America's Frontline
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Join CBP and become part of the largest law enforcement agency in the United States. 
                  With over 60,000 employees, CBP offers diverse career opportunities and locations across the nation.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={() => navigate("/directory")}>
                    Explore Locations
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/compare")}>
                    Compare Stations
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4 lg:mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Competitive Benefits</h3>
                  <p className="text-muted-foreground">
                    Comprehensive health insurance, retirement plans, and paid leave packages for agents and officers.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
                  <p className="text-muted-foreground">
                    Extensive training programs and opportunities for advancement across multiple career paths.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Location Variety</h3>
                  <p className="text-muted-foreground">
                    Choose from diverse duty stations across coastal, urban, and rural locations nationwide.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Mission Impact</h3>
                  <p className="text-muted-foreground">
                    Protect American borders while facilitating lawful international trade and travel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
