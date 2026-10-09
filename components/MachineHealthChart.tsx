/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useLiveDashboardTelemetry } from "@/lib/use-live-dashboard-telemetry";

export default function MachineHealthChart() {
  const [mounted, setMounted] = useState(false);
  const { history, connected } = useLiveDashboardTelemetry();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[300px] w-full" />;

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
      <h3 className="text-white font-barlow text-xl mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" />
        Sistem Monitor Real-Time
        <span className={`ml-auto font-mono text-[9px] uppercase tracking-wider ${connected ? "text-emerald-400" : "text-amber-400"}`}>
          {connected ? "WebSocket Live" : "Simulasi"}
        </span>
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#525252" fontSize={12} interval={4} />
            <YAxis stroke="#525252" fontSize={12} domain={[70, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#ca8a04"
              fillOpacity={1}
              fill="url(#colorTemp)"
              isAnimationActive
              animationDuration={850}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
