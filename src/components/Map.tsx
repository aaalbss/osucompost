"use client";
import React, { useEffect, useRef, useState } from "react";
import { GeoJsonObject, Feature, GeoJsonProperties, Geometry } from "geojson";
import type { Map as LeafletMap, DivIcon } from "leaflet";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import ReactDOMServer from 'react-dom/server';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [geojsonData, setGeojsonData] = useState<GeoJsonObject | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const geoJSONLayerRef = useRef<L.GeoJSON | null>(null);
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        setLeaflet(L.default);
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      });
    }
  }, []);

  const createCustomIcon = (): DivIcon | null => {
    if (!leaflet) return null;
    
    // Renderizamos el componente MapPin a string HTML
    const iconHtml = ReactDOMServer.renderToString(
      <MapPin
      size={30}
      color="rgb(29, 128, 29)" // ForestGreen
      strokeWidth={2}
      fill="rgba(232, 231, 168, 0.83)" // LightGreen
/>
    );

    return leaflet.divIcon({
      html: iconHtml,
      className: "custom-pin-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/mapa.geojson");
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };
    loadGeoJSON();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !leaflet || !geojsonData) return;

    if (!mapInstance.current) {
      mapInstance.current = leaflet.map(mapRef.current, {
        closePopupOnClick: false,
      }).setView([37.2, -4.8], 10);

      leaflet.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
          subdomains: "abcd",
        }
      ).addTo(mapInstance.current);
    }

    if (geoJSONLayerRef.current) {
      geoJSONLayerRef.current.remove();
    }

    const sierraSurBounds = {
      north: 37.53,
      south: 36.96,
      east: -4.68,
      west: -5.45,
    };

    geoJSONLayerRef.current = leaflet.geoJSON(geojsonData, {
      filter: (feature) => {
        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
          const bounds = leaflet.geoJSON(feature).getBounds();
          const center = bounds.getCenter();
          return (
            center.lat <= sierraSurBounds.north &&
            center.lat >= sierraSurBounds.south &&
            center.lng <= sierraSurBounds.east &&
            center.lng >= sierraSurBounds.west
          );
        }
        return false;
      },
      onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
        const name = feature.properties?.name;
        if (!name) return;

        layer.bindTooltip(name, {
          permanent: false,
          direction: "top",
          className: "custom-tooltip",
        });

        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
          const bounds = leaflet.geoJSON(feature).getBounds();
          const center = bounds.getCenter();

          if (
            center.lat <= sierraSurBounds.north &&
            center.lat >= sierraSurBounds.south &&
            center.lng <= sierraSurBounds.east &&
            center.lng >= sierraSurBounds.west
          ) {
            const customIcon = createCustomIcon();
            if (mapInstance.current && customIcon) {
              leaflet.marker([center.lat, center.lng], {
                icon: customIcon,
              }).addTo(mapInstance.current);
            }
          }
        }

        layer.on("click", (e) => {
          leaflet.DomEvent.stopPropagation(e);
          console.log("Clicked:", name);
        });
      },
      style: () => ({
        color: "#006400",
        weight: 2,
        opacity: 1,
        fillColor: "rgb(145, 211, 128)",
        fillOpacity: 0.5,
      }),
    }).addTo(mapInstance.current);

    const bounds = geoJSONLayerRef.current.getBounds();
    mapInstance.current.fitBounds(bounds);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      if (geoJSONLayerRef.current) {
        geoJSONLayerRef.current.remove();
        geoJSONLayerRef.current = null;
      }
    };
  }, [leaflet, geojsonData]);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "70%",
          height: "500px",
          border: "4px solid #2f4f27",
          borderRadius: "8px",
        }}
        className="leaflet-container"
      />
      <style jsx global>{`
        .leaflet-popup {
          display: none !important;
        }
        .leaflet-interactive:focus {
          outline: none !important;
        }
        .leaflet-container {
          z-index: 1;
        }
        .custom-pin-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-16px);
        }
      `}</style>
    </>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false
});