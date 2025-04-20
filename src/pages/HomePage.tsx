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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-[#1F631A]/10 px-3 py-1 text-[#1F631A]">
                Welcome to Duty Station Relocation
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-[#1F631A] sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Next Duty Station
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore and compare CBP duty station locations before you relocate. Make informed decisions about your next career move with free online resources.
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
              <p className="text-xs text-muted-foreground">
                Search by{" "}
                <a 
                  href="https://www.cbp.gov/border-security/along-us-borders/border-patrol-sectors" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-primary"
                >
                  Border Patrol Duty Station
                </a>
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
                <h2 className="text-3xl font-bold tracking-tighter text-[#1F631A] sm:text-4xl">
                  Make a Difference at America's Frontline
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Join over 60,000 dedicated professionals protecting our nation's borders. 
                  Discover diverse career opportunities and locations across the United States.
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
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Career Paths</h3>
                    <p className="text-muted-foreground mb-4">
                      Explore various career opportunities and find your path in border protection and law enforcement.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open("https://careers.cbp.gov/s/career-paths/usbp", "_blank")}
                    className="self-start"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn about our comprehensive benefits package including health insurance, retirement plans, and more.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open("https://careers.cbp.gov/s/benefits", "_blank")}
                    className="self-start"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Applicant Resources</h3>
                    <p className="text-muted-foreground mb-4">
                      Access FAQs and resources to help guide you through the application process.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open("https://careers.cbp.gov/s/applicant-resources/faq", "_blank")}
                    className="self-start"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Honor First</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover the rich history and traditions of the U.S. Border Patrol through Honor First.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open("https://www.honorfirst.com/for-usbp-applicants.html", "_blank")}
                    className="self-start"
                  >
                    Learn More
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
