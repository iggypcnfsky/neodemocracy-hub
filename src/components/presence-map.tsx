"use client";

import dynamic from "next/dynamic";
import { countries, cities } from "../lib/geo-demo";
import type { Map as LeafletMap } from "leaflet";
import "./presence-map.css";

// Use Leaflet 2 global bundle to sidestep React bindings / peer deps
const LeafletMapComponent = dynamic(
  async () => {
    const L = await import("leaflet");
    return function MapShim() {
      return <div id="nd-map" className="h-full w-full" />;
    };
  },
  { ssr: false }
);

// Load Leaflet CSS once (global effect). In a real app, add to globals.css or _app.
if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

const coords: Record<string, { lat: number; lon: number }> = {
  // Countries
  "united-states": { lat: 39, lon: -98 },
  germany: { lat: 51, lon: 10.5 },
  japan: { lat: 36, lon: 138 },
  brazil: { lat: -10, lon: -51 },
  india: { lat: 22, lon: 78 },
  // Cities
  "san-francisco": { lat: 37.7749, lon: -122.4194 },
  berlin: { lat: 52.52, lon: 13.405 },
  tokyo: { lat: 35.6895, lon: 139.6917 },
  "sao-paulo": { lat: -23.55, lon: -46.633 },
  mumbai: { lat: 19.076, lon: 72.8777 },
};

import { useEffect, useRef } from "react";

export interface PresenceMapProps {
  centerSlug?: string;
  zoom?: number;
  onlySlugs?: string[];
}

export default function PresenceMap({ centerSlug, zoom, onlySlugs }: PresenceMapProps = {}) {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const L = await import("leaflet");
      // Ensure CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!isMounted) return;
      const container = document.getElementById("nd-map");
      if (!container) return;
      const defaultCenter: [number, number] = [20, 0];
      const defaultZoom = 2;
      const focus = centerSlug && coords[centerSlug] ? [coords[centerSlug].lat, coords[centerSlug].lon] as [number, number] : defaultCenter;
      const z = zoom ?? (centerSlug ? 4 : defaultZoom);
      const map = new L.Map(container).setView(focus, z);
      // Dark basemap (CARTO Dark Matter)
      new L.TileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      // Add custom chip markers (rounded rectangular labels)
      const allEntities: any[] = [...countries, ...cities];
      const entities = Array.isArray(onlySlugs) && onlySlugs.length
        ? allEntities.filter((e) => onlySlugs.includes(e.slug))
        : allEntities;
      entities.forEach((entity: any) => {
        const pos = coords[entity.slug];
        if (!pos) return;
        const href = entity.citizens ? `/cities/${entity.slug}` : `/countries/${entity.slug}`;
        const iconHtml = `
          <a href="${href}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:#0f0f10;color:#e5e7eb;border:1px solid #262626;border-radius:10px;text-decoration:none;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-size:12px;line-height:1;cursor:pointer;">
            <span style="font-size:14px;margin-right:2px;">${entity.flag}</span>
            <span style="white-space:nowrap;">${entity.name}</span>
          </a>
        `;
        const icon = L.divIcon({
          className: "nd-chip-marker-wrapper",
          html: iconHtml,
        });
        L.marker([pos.lat, pos.lon], { icon, keyboard: false }).addTo(map);
      });

      mapRef.current = map;
    })();
    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full rounded-md border border-neutral-800 overflow-hidden">
      <div id="nd-map" className="relative w-full h-[45vh] md:h-[50vh]" />
    </div>
  );
}


