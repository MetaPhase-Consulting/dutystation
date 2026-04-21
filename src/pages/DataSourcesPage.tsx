
import React from "react";
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
  Truck,
  Plane
} from "lucide-react";
import { LEGAL_DISCLAIMER_POINTS, LEGAL_DISCLAIMER_TITLE } from "@/content/legal";

export default function DataSourcesPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">CBP Duty Location Data Sources</h1>
          <p className="text-muted-foreground">
            Data sources used to provide accurate and helpful information for CBP duty locations across USBP, OFO,
            and AMO.
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
                Duty Location Data
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
              <CardDescription>Information for CBP applicants across components</CardDescription>
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      Honor First - USBP Applicant Community
                    </a>
                    <p className="text-sm text-muted-foreground">Unofficial third-party community resource for USBP applicants</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a 
                      href="https://careers.cbp.gov/s/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      href="https://nces.ed.gov/ccd/schoolsearch/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      NCES School Search
                    </a>
                    <p className="text-sm text-muted-foreground">Federal school directory and educational reference data</p>
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
                      href="https://www.city-data.com/crime/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      City-Data Crime
                    </a>
                    <p className="text-sm text-muted-foreground">Public crime-data reference pages by location</p>
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
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
                      href="https://www.weather.gov/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      National Weather Service
                    </a>
                    <p className="text-sm text-muted-foreground">Official U.S. weather forecasts and alerts</p>
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
                      href="https://www.google.com/maps/search/public+transit" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      Google Maps Transit Search
                    </a>
                    <p className="text-sm text-muted-foreground">Public transit discovery and route planning reference</p>
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
                      href="https://www.usa.gov/moving" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline underline-offset-2 hover:no-underline"
                    >
                      USA.gov Moving Guide
                    </a>
                    <p className="text-sm text-muted-foreground">Federal relocation and moving guidance</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-[#0A4A0A]">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                Pre-Academy Travel Resources
              </CardTitle>
              <CardDescription>External travel planning references</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a href="https://www.expedia.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2 hover:no-underline">
                      Expedia
                    </a>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a href="https://www.travelocity.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2 hover:no-underline">
                      Travelocity
                    </a>
                  </div>
                </li>
                <li className="flex gap-2">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <a href="https://www.kayak.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2 hover:no-underline">
                      Kayak
                    </a>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />
        
        <div className="bg-muted/30 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">{LEGAL_DISCLAIMER_TITLE}</h2>
          <div className="space-y-4">
            <ul className="space-y-2">
              {LEGAL_DISCLAIMER_POINTS.map((point) => (
                <li key={point} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              This project was built by{' '}
              <a 
                href="https://metaphase.tech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-orange-800 underline underline-offset-2 hover:no-underline"
              >
                MetaPhase
              </a>{' '}
              and is free open source software available to the public under the{' '}
              <a 
                href="https://github.com/MetaPhase-Consulting/dutystation/blob/main/LICENSE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
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
