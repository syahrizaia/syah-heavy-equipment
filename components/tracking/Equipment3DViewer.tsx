"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity, Droplets, MapPin, Thermometer, Timer, Waves } from "lucide-react";

type Telemetry = {
  rpm: number;
  engineTemp: number;
  fuelLevel: number;
  latitude: number;
  longitude: number;
  operatingHours: number;
};

const Stage = dynamic(() => import("./Equipment3DStage"), { ssr: false });

function useEquipmentTelemetry(id: string) {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    rpm: 1450, engineTemp: 82, fuelLevel: 68, latitude: -1.2420432,
    longitude: 116.8940224, operatingHours: 2486.4,
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;
    let simulationTimer: ReturnType<typeof setInterval>;
    let disposed = false;
    let receivedAt = 0;
    const endpoint = process.env.NEXT_PUBLIC_TRACKING_WS_URL;

    const simulate = () => setTelemetry((current) => ({
      rpm: Math.max(900, Math.min(2100, current.rpm + Math.round(Math.random() * 100 - 50))),
      engineTemp: Math.max(76, Math.min(96, current.engineTemp + (Math.random() * 1.2 - 0.5))),
      fuelLevel: Math.max(5, current.fuelLevel - 0.003),
      latitude: current.latitude + (Math.random() - 0.5) * 0.00008,
      longitude: current.longitude + (Math.random() - 0.5) * 0.00008,
      operatingHours: current.operatingHours + 1 / 3600,
    }));

    simulationTimer = setInterval(() => {
      if (!receivedAt || Date.now() - receivedAt > 5000) simulate();
    }, 1000);

    const connect = () => {
      if (!endpoint || disposed) return;
      try {
        socket = new WebSocket(endpoint.replace("{id}", encodeURIComponent(id)));
        socket.onopen = () => setConnected(true);
        socket.onmessage = (event) => {
          try {
            const raw = JSON.parse(event.data) as Record<string, unknown>;
            const message: Partial<Telemetry> = {
              rpm: Number(raw.rpm),
              engineTemp: Number(raw.engineTemp ?? raw.engine_temp),
              fuelLevel: Number(raw.fuelLevel ?? raw.fuel_level),
              latitude: Number(raw.latitude ?? raw.current_lat),
              longitude: Number(raw.longitude ?? raw.current_lng),
              operatingHours: Number(raw.operatingHours ?? raw.operating_hours),
            };
            for (const key of Object.keys(message) as (keyof Telemetry)[]) {
              if (!Number.isFinite(message[key])) delete message[key];
            }
            receivedAt = Date.now();
            setTelemetry((current) => ({ ...current, ...message }));
          } catch { /* Ignore malformed telemetry frames. */ }
        };
        socket.onclose = () => {
          setConnected(false);
          if (!disposed) retryTimer = setTimeout(connect, 3000);
        };
        socket.onerror = () => socket?.close();
      } catch {
        retryTimer = setTimeout(connect, 3000);
      }
    };
    connect();
    return () => {
      disposed = true;
      clearInterval(simulationTimer);
      clearTimeout(retryTimer);
      socket?.close();
    };
  }, [id]);

  return { telemetry, connected };
}

export default function Equipment3DViewer({ id, itemName }: { id: string; itemName: string }) {
  const { telemetry, connected } = useEquipmentTelemetry(id);
  const metrics = [
    { icon: Activity, label: "RPM", value: `${telemetry.rpm.toLocaleString()} rpm` },
    { icon: Thermometer, label: "Engine Temp", value: `${telemetry.engineTemp.toFixed(1)}°C` },
    { icon: Droplets, label: "Fuel", value: `${telemetry.fuelLevel.toFixed(1)}%` },
    { icon: MapPin, label: "Coordinate", value: `${telemetry.latitude.toFixed(4)}, ${telemetry.longitude.toFixed(4)}` },
    { icon: Timer, label: "Operating Hours", value: `${telemetry.operatingHours.toFixed(1)} h` },
  ];

  return (
    <section className="absolute inset-0 bg-neutral-950">
      <Stage itemName={itemName} />
      <div className="absolute top-4 left-4 z-10 rounded-lg border border-neutral-800 bg-neutral-900/90 px-4 py-2.5 text-xs shadow-xl backdrop-blur">
        <span className={`mr-2 inline-block h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
        <span className="text-slate-300">Telemetry: <b className="text-white">{connected ? "WebSocket Live" : "Simulation"}</b></span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label} className="min-w-0 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500"><Icon size={12} />{label}</div>
            <div className="mt-1 truncate font-mono text-xs font-semibold text-slate-100">{value}</div>
          </div>
        ))}
      </div>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-[11px] text-slate-300">
        <Waves size={13} className="text-yellow-500" /> 3D Equipment Viewer
      </div>
    </section>
  );
}
