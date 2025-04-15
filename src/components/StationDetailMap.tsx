
import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';
import { Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StationDetailMapProps {
  lat: number;
  lng: number;
  className?: string;
}

const StationDetailMap = ({ lat, lng, className = "" }: StationDetailMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm');

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      console.log("Detail map container does not exist, cannot initialize map");
      return;
    }
    
    // Clean up any existing map
    if (mapInstance.current) {
      mapInstance.current.setTarget(undefined);
      mapInstance.current = null;
    }

    console.log("Detail map container exists, initializing map for coordinates:", { lat, lng });

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

    // Set center coordinates for this specific station
    const center = fromLonLat([lng, lat]);
    const zoom = 12; // Closer zoom for single station

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
        center: center,
        zoom: zoom,
        minZoom: 2,
      }),
    });

    // Ensure the map renders correctly
    setTimeout(() => {
      map.updateSize();
      console.log("Detail map size updated");
    }, 200);

    mapInstance.current = map;

    return () => {
      console.log("Cleaning up detail map");
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
    };
  }, [lat, lng]);

  // Update layer visibility when activeLayer changes
  useEffect(() => {
    if (!mapInstance.current) return;
    
    const layers = mapInstance.current.getLayers().getArray();
    const osmLayer = layers[0];
    const satelliteLayer = layers[1];
    
    osmLayer.setVisible(activeLayer === 'osm');
    satelliteLayer.setVisible(activeLayer === 'satellite');
    
    console.log("Detail map layer visibility updated:", activeLayer);
  }, [activeLayer]);

  return (
    <div className="relative h-full">
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
        data-testid="station-detail-map"
      />
    </div>
  );
};

export default StationDetailMap;
