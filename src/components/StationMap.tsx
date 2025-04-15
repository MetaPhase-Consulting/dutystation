
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
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

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
    
    // Clean up any existing map
    if (mapInstance.current) {
      mapInstance.current.setTarget(undefined);
      mapInstance.current = null;
    }

    console.log("Map container exists, initializing map", { lat, lng, locationsCount: locations?.length });

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

    // Create vector source for station markers
    const vectorSource = new VectorSource();

    // If stations are provided, create features for them
    if (locations && locations.length > 0) {
      console.log("Adding markers for stations:", locations.length);
      locations.forEach(station => {
        if (station.lat && station.lng) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([station.lng, station.lat]))
          });
          vectorSource.addFeature(feature);
        }
      });
    }
    // For single location from lat/lng props
    else if (lat && lng) {
      console.log("Adding marker for single location:", { lat, lng });
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat]))
      });
      vectorSource.addFeature(feature);
    }

    // Create vector layer for markers
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.5
        })
      })
    });

    // Determine center and zoom based on inputs
    let center = fromLonLat([-98.5795, 39.8283]); // Default US center
    let zoom = 4; // Default zoom for US
    
    if (lat && lng) {
      center = fromLonLat([lng, lat]);
      zoom = 12; // Closer zoom for single station
    } else if (locations && locations.length > 0 && locations.some(s => s.lat && s.lng)) {
      // Use first station with coordinates as center when showing multiple
      const stationWithCoords = locations.find(s => s.lat && s.lng);
      if (stationWithCoords) {
        center = fromLonLat([stationWithCoords.lng, stationWithCoords.lat]);
        zoom = locations.length === 1 ? 12 : 5;
      }
    }

    // Create the map instance with default controls
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, satelliteLayer, vectorLayer],
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

    // Ensure the map renders correctly by updating its size
    setTimeout(() => {
      map.updateSize();
      console.log("Map size updated");
    }, 100);

    mapInstance.current = map;

    // Update layer visibility when activeLayer changes
    osmLayer.setVisible(activeLayer === 'osm');
    satelliteLayer.setVisible(activeLayer === 'satellite');

    return () => {
      console.log("Cleaning up map");
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
    };
  }, [lat, lng, activeLayer, locations]);

  // Update layer visibility when activeLayer changes
  useEffect(() => {
    if (!mapInstance.current) return;
    
    const layers = mapInstance.current.getLayers().getArray();
    const osmLayer = layers[0];
    const satelliteLayer = layers[1];
    
    osmLayer.setVisible(activeLayer === 'osm');
    satelliteLayer.setVisible(activeLayer === 'satellite');
    
    console.log("Layer visibility updated:", activeLayer);
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
        data-testid="station-map"
      />
    </div>
  );
};

export default StationMap;
