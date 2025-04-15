
import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';
import { Layers, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DutyStation } from '@/data/dutyStations';

interface StationMapProps {
  locations?: DutyStation[];
  lat?: number;
  lng?: number;
  className?: string;
}

const StationMap = ({ locations, lat, lng, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm');

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map layers
    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: activeLayer === 'osm'
    });

    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19
      }),
      visible: activeLayer === 'satellite'
    });

    // Create the map instance with default controls
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, satelliteLayer],
      controls: defaultControls({
        zoom: true,
        rotate: true,
        attribution: true
      }),
      view: new View({
        center: lat && lng ? fromLonLat([lng, lat]) : fromLonLat([-98.5795, 39.8283]),
        zoom: lat && lng ? 12 : 4,
      }),
    });

    // Update layer visibility when activeLayer changes
    osmLayer.setVisible(activeLayer === 'osm');
    satelliteLayer.setVisible(activeLayer === 'satellite');

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
    };
  }, [lat, lng, activeLayer]);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Select value={activeLayer} onValueChange={(value: 'osm' | 'satellite') => setActiveLayer(value)}>
          <SelectTrigger className="w-[140px] bg-white">
            <Layers className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select layer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="osm">Street Map</SelectItem>
            <SelectItem value="satellite">Satellite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div 
        ref={mapRef} 
        className={`w-full h-full min-h-[400px] ${className}`}
        data-testid="station-map"
      />
    </div>
  );
};

export default StationMap;
