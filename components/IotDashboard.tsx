"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLiveDashboardTelemetry } from "@/lib/use-live-dashboard-telemetry";

export default function IotDashboard() {
  const { history, connected } = useLiveDashboardTelemetry();

  return (
    <div className="relative h-full w-full">
      <span className={`absolute right-1 top-0 z-10 font-mono text-[9px] uppercase tracking-wider ${connected ? "text-emerald-400" : "text-amber-400"}`}>
        {connected ? "WebSocket Live" : "Simulasi"}
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#525252" fontSize={12} tickLine={false} interval={4} />
          <YAxis stroke="#525252" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #404040', borderRadius: '8px' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ca8a04"
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={850}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
