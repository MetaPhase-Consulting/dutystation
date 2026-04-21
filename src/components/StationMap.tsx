import { useEffect, useMemo, useRef, useState } from "react";
import OLMap from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { X } from "lucide-react";
import { DutyStation } from "@/types/station";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { componentAccent } from "@/lib/componentColors";

interface StationMapProps {
  locations?: DutyStation[];
  lat?: number;
  lng?: number;
  className?: string;
}

// Continental US center, zoom sized to show CONUS comfortably at ~1280x720.
const CONUS_CENTER: [number, number] = [-98.5795, 39.8283];
const CONUS_ZOOM = 4;
const SELECTED_ZOOM = 10;

const StationMap = ({ locations, lat, lng, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const hoverTooltipRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<OLMap | null>(null);
  const selectedOverlayRef = useRef<Overlay | null>(null);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const stationById = useMemo(() => {
    return new globalThis.Map((locations ?? []).map((location) => [location.id, location]));
  }, [locations]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(CONUS_CENTER),
        zoom: CONUS_ZOOM,
      }),
    });

    const hoverOverlay = new Overlay({
      element: hoverTooltipRef.current ?? undefined,
      offset: [0, -16],
      positioning: "bottom-center",
      stopEvent: false,
    });
    map.addOverlay(hoverOverlay);

    const selectedOverlay = new Overlay({
      element: selectedCardRef.current ?? undefined,
      offset: [0, -44],
      positioning: "bottom-center",
      // Swallow clicks so View Details / close don't bubble to the map.
      stopEvent: true,
    });
    map.addOverlay(selectedOverlay);
    selectedOverlayRef.current = selectedOverlay;

    const componentColorMap: Record<string, string> = {
      USBP: "#0A4A0A",
      OFO: "#0B4A8B",
      AMO: "#0F766E",
    };

    const createMarkerStyle = (componentType: string) => {
      const pinColor = componentColorMap[componentType] ?? "#0A4A0A";
      return new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'>` +
              `<path d='M16 0 C 7.2 0 0 7.2 0 16 C 0 24.8 16 48 16 48 C 16 48 32 24.8 32 16 C 32 7.2 24.8 0 16 0 Z' fill='${pinColor}'/>` +
              "<circle cx='16' cy='16' r='8' fill='white'/>" +
            "</svg>"
          )}`,
          scale: 0.7,
        }),
      });
    };

    if (locations?.length) {
      const features = locations.map((location) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([location.lng, location.lat])),
          id: location.id,
          name: location.name,
          city: location.city,
          state: location.state,
          componentType: location.componentType,
        });

        feature.setStyle(createMarkerStyle(location.componentType));
        return feature;
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features }),
      });

      map.addLayer(vectorLayer);

      map.on("pointermove", (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (selectedFeature) => selectedFeature as Feature);
        const target = map.getTargetElement();

        if (target) {
          target.style.cursor = feature ? "pointer" : "default";
        }

        if (!feature) {
          setHoveredStationId(null);
          hoverOverlay.setPosition(undefined);
          return;
        }

        const stationId = feature.get("id") as string;
        setHoveredStationId(stationId);
        hoverOverlay.setPosition(event.coordinate);
      });

      map.on("click", (event) => {
        let matched = false;
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const id = feature.get("id") as string;
          if (!id) return;
          matched = true;

          setSelectedStationId(id);
          // Hover tooltip would overlap the selected card — clear it.
          setHoveredStationId(null);
          hoverOverlay.setPosition(undefined);

          const coord = (feature.getGeometry() as Point).getCoordinates();
          selectedOverlay.setPosition(coord);
          map.getView().animate({
            center: coord,
            zoom: Math.max(map.getView().getZoom() ?? SELECTED_ZOOM, SELECTED_ZOOM),
            duration: 400,
          });
        });

        if (!matched) {
          // Clicked empty map space — dismiss any open selection.
          setSelectedStationId(null);
          selectedOverlay.setPosition(undefined);
        }
      });
    } else if (lat !== undefined && lng !== undefined) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });

      feature.setStyle(createMarkerStyle("USBP"));

      map.addLayer(
        new VectorLayer({
          source: new VectorSource({ features: [feature] }),
        })
      );

      map.getView().setCenter(fromLonLat([lng, lat]));
      map.getView().setZoom(12);
    }

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
      selectedOverlayRef.current = null;
    };
  }, [lat, lng, locations, navigate]);

  const hoveredStation = hoveredStationId ? stationById.get(hoveredStationId) : null;
  const selectedStation = selectedStationId ? stationById.get(selectedStationId) : null;

  const closeSelected = () => {
    setSelectedStationId(null);
    selectedOverlayRef.current?.setPosition(undefined);
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={`w-full min-h-[400px] ${className}`}
        data-testid="station-map"
        role="application"
        aria-label="Duty station map"
      />

      {/* Hover tooltip (cheap quick label). */}
      <div
        ref={hoverTooltipRef}
        className={`pointer-events-none rounded-md bg-black/80 px-3 py-2 text-xs text-white shadow ${
          hoveredStation && !selectedStation ? "block" : "hidden"
        }`}
        aria-hidden={!hoveredStation || !!selectedStation}
      >
        {hoveredStation ? `${hoveredStation.name} (${hoveredStation.city}, ${hoveredStation.state})` : ""}
      </div>

      {/* Click-selected station card. OL positions this via Overlay. */}
      <div
        ref={selectedCardRef}
        className={selectedStation ? "block" : "hidden"}
        aria-live="polite"
      >
        {selectedStation ? (
          <div className="w-64 rounded-md border bg-white shadow-lg">
            <div className="flex items-start justify-between gap-2 p-3 pb-2">
              <h3
                className={`font-semibold leading-tight ${componentAccent[selectedStation.componentType].text}`}
              >
                {selectedStation.name}
              </h3>
              <button
                type="button"
                onClick={closeSelected}
                aria-label="Close station info"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-3 pb-3 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedStation.city}, {selectedStation.state} · {selectedStation.region} Region
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[11px] bg-muted rounded px-2 py-0.5 font-medium">
                  {selectedStation.componentType}
                </span>
                <span className="text-[11px] bg-muted rounded px-2 py-0.5 font-medium">
                  {selectedStation.facilityType}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                className={`w-full mt-1 ${componentAccent[selectedStation.componentType].buttonClass}`}
                onClick={() => navigate(`/station/${selectedStation.id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StationMap;
