import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Map,
  Home, 
  DollarSign, 
  School, 
  Shield,
  BookOpen,
  CloudSun,
  TrainFront,
  Truck
} from "lucide-react";

export default function DataSourcesPage() {
  return (
    <div className="container px-4 py-12 md:py-16 lg:py-24 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">Data Sources</h1>
          <p className="text-muted-foreground max-w-[900px]">
            Data used to provide accurate and helpful information about border duty stations.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-[#1F631A]">
                  <Map className="h-5 w-5 text-white" />
                </div>
                Duty Station Data
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
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
                <div className="p-2 rounded-md bg-[#1F631A]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
                    >
                      CBP Careers
                    </a>
                    <p className="text-sm text-muted-foreground">Official CBP career information and job listings</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-[#1F631A]">
                  <Map className="h-5 w-5 text-white" />
                </div>
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
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
                <div className="p-2 rounded-md bg-[#0FA0CE]">
                  <Home className="h-5 w-5 text-white" />
                </div>
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
                      href="https://www.realtor.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
                <div className="p-2 rounded-md bg-[#22c55e]">
                  <School className="h-5 w-5 text-white" />
                </div>
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
                      className="text-blue-600 hover:underline"
                    >
                      GreatSchools
                    </a>
                    <p className="text-sm text-muted-foreground">School ratings and educational resources</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-[#ea384c]">
                  <Shield className="h-5 w-5 text-white" />
                </div>
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
                      href="https://www.neighborhoodscout.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
                <div className="p-2 rounded-md bg-green-600">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                Cost of Living Data
              </CardTitle>
              <CardDescription>Local economic indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.bestplaces.net" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      BestPlaces
                    </a>
                    <p className="text-sm text-muted-foreground">Cost of living data and city comparisons</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-blue-500">
                  <CloudSun className="h-5 w-5 text-white" />
                </div>
                Weather Data
              </CardTitle>
              <CardDescription>Climate and weather information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://weatherspark.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      WeatherSpark
                    </a>
                    <p className="text-sm text-muted-foreground">Detailed weather data and climate information</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-gray-700">
                  <TrainFront className="h-5 w-5 text-white" />
                </div>
                Transit Data
              </CardTitle>
              <CardDescription>Public transportation information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.rome2rio.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Rome2Rio
                    </a>
                    <p className="text-sm text-muted-foreground">Transportation routes and options between locations</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-orange-500">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                Moving Resources
              </CardTitle>
              <CardDescription>Relocation assistance and tips</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://www.moving.com/tips/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Moving.com
                    </a>
                    <p className="text-sm text-muted-foreground">Moving tips and relocation guides</p>
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
                className="text-blue-600 hover:underline mx-1"
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
