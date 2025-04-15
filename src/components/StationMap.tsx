
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

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clean up any existing map
    if (mapInstance.current) {
      mapInstance.current.setTarget(undefined);
      mapInstance.current = null;
    }

    // Create the base map layer
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Create vector source for station markers
    const vectorSource = new VectorSource();

    // Default center of continental USA
    const defaultCenter = [-97.0, 39.5];
    const center = fromLonLat(defaultCenter);

    // Add markers for station locations
    if (locations && locations.length > 0) {
      locations.forEach(station => {
        if (station.lat && station.lng) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([station.lng, station.lat])),
            name: station.name
          });
          
          // Add station data as properties to the feature
          feature.setProperties({
            id: station.id,
            name: station.name,
            sector: station.sector,
            region: station.region,
            state: station.state
          });
          
          vectorSource.addFeature(feature);
        }
      });
    }

    // Create vector layer for markers with blue pins
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: '/blue-pin.png', // Make sure this file exists in your public folder
          anchor: [0.5, 1],
          scale: 0.7 // Adjust scale for visibility
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
        zoom: 4, // Default zoom for US view
        minZoom: 2,
      }),
    });

    // Add click interaction to navigate to station details
    map.on('click', function(evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      
      if (feature) {
        const stationId = feature.get('id');
        if (stationId) {
          window.location.href = `/station/${stationId}`;
        }
      }
    });

    // Change cursor style when hovering over features
    map.on('pointermove', function(evt) {
      if (evt.dragging) return;
      
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    // Ensure the map renders correctly
    setTimeout(() => {
      map.updateSize();
    }, 200);

    mapInstance.current = map;

    return () => {
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
