import React, { useState } from "react";
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[#E5EBD9] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/lovable-uploads/def4241e-5f5d-4287-8d7d-987f6fe7f1ae.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "40%",
            transform: "rotate(-15deg)"
          }}
        />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-[#1F631A]/10 px-3 py-1 text-[#1F631A]">
                Border Duty Station Relocation
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-[#1F631A] sm:text-4xl md:text-5xl lg:text-6xl/none flex items-center justify-center gap-4">
                <img 
                  src="/lovable-uploads/def4241e-5f5d-4287-8d7d-987f6fe7f1ae.png"
                  alt="Compass"
                  className="w-12 h-12 md:w-16 md:h-16 animate-pulse"
                />
                Find Your Next Duty Station
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Explore and compare border duty station locations before you relocate. Make informed decisions about your next career move with free online resources.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form onSubmit={handleSearch}>
                <div className="relative w-full">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                      <Input
                        type="search"
                        placeholder="Search Duty Stations..."
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
                                  {station.name}
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
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 xl:gap-16">
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-[#1F631A] sm:text-4xl">
                  Making a Difference at America's Frontline
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Join over 60,000 dedicated professionals protecting our nation's borders.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4 lg:mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Directory</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse duty stations with interactive list and map views. Search, sort, and filter by location, sector, and region to find your ideal station.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/directory")}
                    className="self-start"
                  >
                    Explore Stations
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Compare</h3>
                    <p className="text-muted-foreground mb-4">
                      Side-by-side comparison tool to evaluate multiple duty stations. Compare housing costs, schools, and local amenities to make informed decisions.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/compare")}
                    className="self-start"
                  >
                    Compare Stations
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data Sources</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn about the data sources we use for locations, housing, schools, crime statistics, and maps to provide reliable information.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/data-sources")}
                    className="self-start"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Applicant Resources</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover resources for Border Patrol applicants through Honor First and other helpful links.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open("https://www.honorfirst.com/for-usbp-applicants.html", "_blank")}
                    className="self-start"
                  >
                    Honor First
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
