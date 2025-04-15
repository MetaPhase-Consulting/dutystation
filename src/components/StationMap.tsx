
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';
import { DutyStation } from '@/data/dutyStations';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

interface StationMapProps {
  locations?: DutyStation[];
  className?: string;
}

const StationMap = ({ locations, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      console.log("Directory map container does not exist, cannot initialize map");
      return;
    }
    
    // Clean up any existing map
    if (mapInstance.current) {
      mapInstance.current.setTarget(undefined);
      mapInstance.current = null;
    }

    console.log("Directory map container exists, initializing map with stations:", locations?.length);

    // Create the base map layer
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Create vector source for station markers
    const vectorSource = new VectorSource();

    // Default center of continental USA
    const defaultCenter = [-97.0, 39.5];
    let center = fromLonLat(defaultCenter);
    let zoom = 4; // Default zoom for US

    // Add markers for station locations
    if (locations && locations.length > 0) {
      locations.forEach(station => {
        if (station.lat && station.lng) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([station.lng, station.lat])),
            name: station.name
          });
          vectorSource.addFeature(feature);
        }
      });
      
      // Calculate better center point if we have stations
      if (locations.some(s => s.lat && s.lng)) {
        const stationWithCoords = locations.find(s => s.lat && s.lng);
        if (stationWithCoords) {
          center = fromLonLat([stationWithCoords.lng, stationWithCoords.lat]);
          zoom = locations.length === 1 ? 12 : 5;
        }
      }
    }

    // Create vector layer for markers with blue pins
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 1.0 // Larger pins
        })
      })
    });

    // Create the map instance
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer],
      controls: defaultControls({
        zoom: true,
        rotate: false,
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
      console.log("Directory map size updated");
    }, 200);

    mapInstance.current = map;

    return () => {
      console.log("Cleaning up directory map");
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
    };
  }, [locations]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[400px] ${className}`}
      data-testid="station-map"
    />
  );
};

export default StationMap;
