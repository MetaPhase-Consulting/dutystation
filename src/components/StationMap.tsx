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
import { DutyStation } from "@/types/station";
import { useNavigate } from "react-router-dom";

interface StationMapProps {
  locations?: DutyStation[];
  lat?: number;
  lng?: number;
  className?: string;
}

const StationMap = ({ locations, lat, lng, className = "" }: StationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<OLMap | null>(null);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);
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
        center: fromLonLat([-98.5795, 39.8283]),
        zoom: 4,
      }),
    });

    const overlay = new Overlay({
      element: tooltipRef.current ?? undefined,
      offset: [0, -16],
      positioning: "bottom-center",
      stopEvent: false,
    });

    map.addOverlay(overlay);

    const componentColorMap: Record<string, string> = {
      USBP: "#0A4A0A",
      OFO: "#0B4A8B",
      AMO: "#0F766E",
    };

    const createMarkerStyle = (componentType: string, isIncentive: boolean) => {
      const pinColor = componentColorMap[componentType] ?? "#0A4A0A";
      const highlight = isIncentive
        ? "<circle cx='16' cy='16' r='11' fill='none' stroke='#C88A04' stroke-width='3'/>"
        : "";
      return new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'>` +
              `<path d='M16 0 C 7.2 0 0 7.2 0 16 C 0 24.8 16 48 16 48 C 16 48 32 24.8 32 16 C 32 7.2 24.8 0 16 0 Z' fill='${pinColor}'/>` +
              highlight +
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

        feature.setStyle(createMarkerStyle(location.componentType, location.attributes.incentiveEligible));
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
          overlay.setPosition(undefined);
          return;
        }

        const stationId = feature.get("id") as string;
        setHoveredStationId(stationId);
        overlay.setPosition(event.coordinate);
      });

      map.on("click", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const id = feature.get("id");
          if (id) {
            navigate(`/station/${id}`);
          }
        });
      });

      const vectorSource = vectorLayer.getSource();
      if (vectorSource) {
        map.getView().fit(vectorSource.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 16,
        });
      }
    } else if (lat !== undefined && lng !== undefined) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });

      feature.setStyle(createMarkerStyle("USBP", false));

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
    };
  }, [lat, lng, locations, navigate]);

  const hoveredStation = hoveredStationId ? stationById.get(hoveredStationId) : null;

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={`w-full min-h-[400px] ${className}`}
        data-testid="station-map"
        role="application"
        aria-label="Duty station map"
      />
      <div
        ref={tooltipRef}
        className={`pointer-events-none rounded-md bg-black/80 px-3 py-2 text-xs text-white shadow ${
          hoveredStation ? "block" : "hidden"
        }`}
        aria-hidden={!hoveredStation}
      >
        {hoveredStation ? `${hoveredStation.name} (${hoveredStation.city}, ${hoveredStation.state})` : ""}
      </div>
    </div>
  );
};

export default StationMap;
