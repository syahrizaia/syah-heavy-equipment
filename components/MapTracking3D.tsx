/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Daftarkan token Mapbox
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

interface MapProps {
  latitude: number;
  longitude: number;
  itemName: string;
}

export default function MapTracking3D({ latitude, longitude, itemName }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3 font-bold text-lg">
          !
        </div>
        <h3 className="text-sm font-bold text-slate-200">Mapbox Token Diperlukan</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Variabel <code className="text-yellow-600 bg-neutral-950 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> belum terdeteksi. Pastikan Anda sudah membuat file <code className="text-slate-300 font-mono">.env.local</code> lalu restart server lokal Anda.
        </p>
      </div>
    );
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inisialisasi peta (Aman dieksekusi karena token dipastikan lolos pengecekan di atas)
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 14,
      pitch: 60,
      bearing: -30,
      antialias: true
    });

    const map = mapRef.current;

    map.on("style.load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 4.0],
          "sky-atmosphere-sun-intensity": 15
        }
      });
    });

    // Tambahkan Penanda (Marker) Lokasi Unit
    const el = document.createElement("div");
    el.className = "w-6 h-6 bg-yellow-600 rounded-full border-2 border-white animate-pulse shadow-xl shadow-yellow-600/50";
    
    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h4 style="color:#000; font-weight:bold; font-size:11px; padding:2px;">${itemName}</h4>`)
      )
      .addTo(map);

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [latitude, longitude, itemName]);

  // Efek untuk update posisi marker secara real-time jika koordinat berubah
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [longitude, latitude], speed: 0.8 });
      }
    }
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-xl" />;
}