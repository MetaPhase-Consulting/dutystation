
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
import { DutyStation } from '@/data/dutyStations';
import { useNavigate } from 'react-router-dom';

interface StationMapProps {
  locations?: DutyStation[];
  lat?: number;
  lng?: number;
  className?: string;
}

const StationMap = ({ locations, lat, lng, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const navigate = useNavigate();

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
        center: fromLonLat([-98.5795, 39.8283]), // Center of USA
        zoom: 4,
      }),
    });

    // Custom map cursor style - fix the TypeScript error by checking if target is HTMLElement
    const targetElement = map.getTarget();
    if (targetElement && targetElement instanceof HTMLElement) {
      targetElement.style.cursor = 'default';
    }

    // Create the marker style
    const createMarkerStyle = () => {
      return new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: `data:image/svg+xml;utf8,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">' +
            '<path d="M16 0 C 7.2 0 0 7.2 0 16 C 0 24.8 16 48 16 48 C 16 48 32 24.8 32 16 C 32 7.2 24.8 0 16 0 Z" fill="#0FA0CE"/>' + // CBP Ocean Blue
            '<circle cx="16" cy="16" r="8" fill="white"/>' +
            '</svg>'
          )}`,
          scale: 0.7,
        }),
      });
    };

    if (locations && locations.length > 0) {
      // Create features for all locations
      const features = locations.map(location => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([location.lng, location.lat])),
          name: location.name,
          id: location.id, // Add station ID to the feature
        });

        feature.setStyle(createMarkerStyle());
        return feature;
      });

      // Add all markers to the map
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
      });

      map.addLayer(vectorLayer);

      // Add click handler with cursor change - fixed TypeScript error
      map.on('pointermove', (event) => {
        const hit = map.forEachFeatureAtPixel(event.pixel, () => true);
        const target = map.getTarget();
        if (target && target instanceof HTMLElement) {
          target.style.cursor = hit ? 'pointer' : 'default';
        }
      });

      // Add click handler to navigate
      map.on('click', (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const id = feature.get('id');
          if (id) {
            navigate(`/station/${id}`);
          }
        });
      });

      // Fit the view to show all markers
      const vectorSource = vectorLayer.getSource();
      if (vectorSource) {
        const sourceExtent = vectorSource.getExtent();
        if (sourceExtent) {
          map.getView().fit(sourceExtent, {
            padding: [50, 50, 50, 50],
            maxZoom: 16,
          });
        }
      }
    } else if (lat !== undefined && lng !== undefined) {
      // Single location mode - Display a single marker at the specified coordinates
      console.log("Rendering single location map:", lat, lng);
      
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });

      feature.setStyle(createMarkerStyle());

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [feature],
        }),
      });

      map.addLayer(vectorLayer);
      
      // Set center and zoom for the single location
      map.getView().setCenter(fromLonLat([lng, lat]));
      map.getView().setZoom(12);
    }

    mapInstance.current = map;

    // Clean up on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
    };
  }, [locations, lat, lng, navigate]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[400px] ${className}`}
      data-testid="station-map"
    />
  );
};

export default StationMap;
