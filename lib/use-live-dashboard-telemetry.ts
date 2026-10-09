"use client";

import { useEffect, useRef, useState } from "react";

export type DashboardTelemetry = {
  time: string;
  temp: number;
  pressure: number;
  value: number;
};

const initialTelemetry: DashboardTelemetry = {
  time: "",
  temp: 82,
  pressure: 235,
  value: 65,
};

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getMessageTelemetry(payload: unknown): Partial<DashboardTelemetry> {
  if (!payload || typeof payload !== "object") return {};

  const message = payload as Record<string, unknown>;
  const nested = message.telemetry ?? message.data;
  const fields = nested && typeof nested === "object"
    ? nested as Record<string, unknown>
    : message;

  const temp = toFiniteNumber(fields.temp ?? fields.engineTemp ?? fields.engine_temp ?? fields.engine_temperature);
  const pressure = toFiniteNumber(fields.pressure ?? fields.oilPressure ?? fields.oil_pressure ?? fields.hydraulic_pressure);
  const value = toFiniteNumber(fields.value ?? fields.health ?? fields.health_score ?? fields.fuelLevel ?? fields.fuel_level);

  return {
    ...(temp !== undefined ? { temp } : {}),
    ...(pressure !== undefined ? { pressure } : {}),
    ...(value !== undefined ? { value } : {}),
  };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function useLiveDashboardTelemetry() {
  const [history, setHistory] = useState<DashboardTelemetry[]>(() =>
    Array.from({ length: 8 }, (_, index) => ({
      ...initialTelemetry,
      time: "",
      temp: 76 + index * 2,
      pressure: 220 + index * 3,
      value: 40 + index * 7,
    })),
  );
  const [connected, setConnected] = useState(false);
  const latestRef = useRef(initialTelemetry);
  const lastMessageAtRef = useRef(0);
  const simulationTickRef = useRef(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const endpoint = process.env.NEXT_PUBLIC_TRACKING_WS_URL;

    const connect = () => {
      if (!endpoint || disposed) return;

      try {
        socket = new WebSocket(endpoint.replace("{id}", "fleet"));
        socket.onmessage = (event) => {
          try {
            const update = getMessageTelemetry(JSON.parse(event.data));
            if (Object.keys(update).length === 0) return;
            latestRef.current = { ...latestRef.current, ...update };
            lastMessageAtRef.current = Date.now();
            setConnected(true);
          } catch {
            // Ignore malformed telemetry frames and keep the dashboard running.
          }
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

    const interval = setInterval(() => {
      const hasRecentTelemetry = lastMessageAtRef.current > 0 && Date.now() - lastMessageAtRef.current <= 5000;
      const current = latestRef.current;
      setConnected(hasRecentTelemetry);
      simulationTickRef.current += 1;
      const tick = simulationTickRef.current;
      const next = hasRecentTelemetry ? current : {
        temp: 82 + Math.sin(tick * 0.22) * 4,
        pressure: 235 + Math.sin(tick * 0.16 + 0.8) * 9,
        value: 65 + Math.sin(tick * 0.19 + 1.4) * 14,
        time: "",
      };
      const sample = { ...next, time: formatTime(new Date()) };
      latestRef.current = sample;
      setHistory((currentHistory) => [...currentHistory.slice(-19), sample]);
    }, 1000);

    connect();

    return () => {
      disposed = true;
      clearInterval(interval);
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
    };
  }, []);

  return { history, connected };
}
