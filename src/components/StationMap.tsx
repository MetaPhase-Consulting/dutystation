
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { MapPin } from 'lucide-react';

interface StationMapProps {
  lat: number;
  lng: number;
  className?: string;
}

const StationMap = ({ lat, lng, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map instance
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 12,
      }),
    });

    // Add marker for the station location
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
    });

    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: `data:image/svg+xml;utf8,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
          )}`,
          scale: 1.5,
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature],
      }),
    });

    map.addLayer(vectorLayer);
    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstance.current = null;
    };
  }, [lat, lng]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-[400px] rounded-lg border ${className}`}
    />
  );
};

export default StationMap;
