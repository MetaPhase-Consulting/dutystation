import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { ComponentType } from "@/types/station";
import { componentAccent } from "@/lib/componentColors";

interface StationDetailMapProps {
  lat: number;
  lng: number;
  componentType?: ComponentType;
}

const STREET_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const STREET_ATTR = "© OpenStreetMap contributors";
const SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SATELLITE_ATTR = "© Esri";

const createMarkerStyle = (pinColor: string) =>
  new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'>` +
          `<path d='M16 0 C 7.2 0 0 7.2 0 16 C 0 24.8 16 48 16 48 C 16 48 32 24.8 32 16 C 32 7.2 24.8 0 16 0 Z' fill='${pinColor}'/>` +
          "<circle cx='16' cy='16' r='8' fill='white'/>" +
          "</svg>"
      )}`,
      scale: 0.85,
    }),
  });

const StationDetailMap = ({ lat, lng, componentType = "USBP" }: StationDetailMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const tileLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  useEffect(() => {
    if (!mapRef.current) return;

    const tileLayer = new TileLayer({
      source: new XYZ({ url: STREET_URL, attributions: STREET_ATTR }),
    });

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
    });
    markerFeature.setStyle(createMarkerStyle(componentAccent[componentType].hex));

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: [markerFeature] }),
    });

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({ zoom: true, rotate: false }),
      layers: [tileLayer, markerLayer],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 13,
      }),
    });

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, [lat, lng, componentType]);

  // Swap the underlying tile source without touching the marker layer so the
  // pin stays visible across Street/Satellite switches.
  const switchMapLayer = (type: "street" | "satellite") => {
    const layer = tileLayerRef.current;
    if (!layer) return;
    layer.setSource(
      type === "street"
        ? new XYZ({ url: STREET_URL, attributions: STREET_ATTR })
        : new XYZ({ url: SATELLITE_URL, attributions: SATELLITE_ATTR })
    );
    setMapType(type);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-[400px]" />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          size="sm"
          variant={mapType === "street" ? "default" : "secondary"}
          onClick={() => switchMapLayer("street")}
        >
          Street
        </Button>
        <Button
          size="sm"
          variant={mapType === "satellite" ? "default" : "secondary"}
          onClick={() => switchMapLayer("satellite")}
        >
          Satellite
        </Button>
      </div>
    </div>
  );
};

export default StationDetailMap;
