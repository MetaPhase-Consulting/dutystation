
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink, Map, Home, Bookmark, School, Shield, Info, BookOpen } from "lucide-react";

export default function DataSourcesPage() {
  return (
    <div className="container px-4 py-12 md:py-16 lg:py-24 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Data Sources</h1>
          <p className="text-muted-foreground max-w-[900px]">
            Information about the data sources we use to provide accurate and helpful information about border duty stations.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-[#1F631A]" />
                Location Data
              </CardTitle>
              <CardDescription>Official CBP location information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.cbp.gov/about/contact/ports" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      CBP Ports of Entry
                    </a>
                    <p className="text-sm text-muted-foreground">Official information about U.S. Customs and Border Protection ports of entry</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.cbp.gov/border-security/along-us-borders/border-patrol-sectors" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      Border Patrol Sectors
                    </a>
                    <p className="text-sm text-muted-foreground">Information about U.S. Border Patrol sectors and stations</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-[#1F631A]" />
                Real Estate Data
              </CardTitle>
              <CardDescription>Housing costs and market information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.zillow.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      Zillow
                    </a>
                    <p className="text-sm text-muted-foreground">Real estate and rental listings marketplace</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.realtor.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      Realtor.com
                    </a>
                    <p className="text-sm text-muted-foreground">Real estate listings and market data</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-[#1F631A]" />
                Schools Data
              </CardTitle>
              <CardDescription>Educational institutions and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.greatschools.org" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      GreatSchools
                    </a>
                    <p className="text-sm text-muted-foreground">School ratings and educational resources</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://nces.ed.gov" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      National Center for Education Statistics
                    </a>
                    <p className="text-sm text-muted-foreground">Federal education data and research</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#1F631A]" />
                Crime Statistics
              </CardTitle>
              <CardDescription>Safety and crime data</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.fbi.gov/services/cjis/ucr" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      FBI Uniform Crime Reporting
                    </a>
                    <p className="text-sm text-muted-foreground">National crime statistics from law enforcement agencies</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.neighborhoodscout.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      NeighborhoodScout
                    </a>
                    <p className="text-sm text-muted-foreground">Neighborhood crime statistics and safety ratings</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-[#1F631A]" />
                Map Data
              </CardTitle>
              <CardDescription>Geographic information and mapping</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://openlayers.org" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      OpenLayers
                    </a>
                    <p className="text-sm text-muted-foreground">High-performance mapping library for interactive maps</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.openstreetmap.org" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      OpenStreetMap
                    </a>
                    <p className="text-sm text-muted-foreground">Collaborative mapping project providing free geographic data</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1F631A]" />
                Applicant Resources
              </CardTitle>
              <CardDescription>Information for Border Patrol applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.honorfirst.com/for-usbp-applicants.html" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      Honor First - For USBP Applicants
                    </a>
                    <p className="text-sm text-muted-foreground">Resources for Border Patrol applicants</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://careers.cbp.gov/s/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      CBP Careers
                    </a>
                    <p className="text-sm text-muted-foreground">Official CBP career information and job listings</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.cbp.gov/careers/usbp-what-we-do" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F631A] hover:underline"
                    >
                      CBP - What We Do
                    </a>
                    <p className="text-sm text-muted-foreground">Information about Border Patrol mission and activities</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />
        
        <div className="bg-muted/30 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Disclaimers</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is not an official government website. Duty Station Relocation is an open-source project designed to help individuals make informed decisions about border duty station relocations.
            </p>
            <p className="text-sm text-muted-foreground">
              The data presented on this website is sourced from various third-party providers. All external data, copyrights, and trademarks belong to their respective owners. We make no claims of ownership over any third-party content.
            </p>
            <p className="text-sm text-muted-foreground">
              This project is open source and available under the 
              <a 
                href="https://opensource.org/licenses/MIT" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1F631A] hover:underline mx-1"
              >
                MIT License
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
