
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';

interface StationDetailMapProps {
  lat: number;
  lng: number;
}

const StationDetailMap: React.FC<StationDetailMapProps> = ({ lat, lng }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [mapType, setMapType] = React.useState<'street' | 'satellite'>('street');

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map instance
    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({ zoom: true, rotate: false }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: '© OpenStreetMap contributors'
          })
        })
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 13
      })
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [lat, lng]);

  const switchMapLayer = (type: 'street' | 'satellite') => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    map.getLayers().clear();

    const source = type === 'street' 
      ? new XYZ({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attributions: '© OpenStreetMap contributors'
        })
      : new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: '© Esri'
        });

    map.addLayer(new TileLayer({ source }));
    setMapType(type);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-[400px]" />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          size="sm"
          variant={mapType === 'street' ? 'default' : 'secondary'}
          onClick={() => switchMapLayer('street')}
        >
          Street
        </Button>
        <Button
          size="sm"
          variant={mapType === 'satellite' ? 'default' : 'secondary'}
          onClick={() => switchMapLayer('satellite')}
        >
          Satellite
        </Button>
      </div>
    </div>
  );
};

export default StationDetailMap;
