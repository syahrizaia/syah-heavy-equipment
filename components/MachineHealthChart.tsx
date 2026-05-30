"use client";

import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const data = [
  { time: "08:00", temp: 75, pressure: 220 },
  { time: "10:00", temp: 82, pressure: 235 },
  { time: "12:00", temp: 88, pressure: 240 },
  { time: "14:00", temp: 85, pressure: 230 },
  { time: "16:00", temp: 92, pressure: 250 },
];

export default function MachineHealthChart() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
      <h3 className="text-white font-barlow text-xl mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" />
        Sistem Monitor Real-Time
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#525252" fontSize={12} />
            <YAxis stroke="#525252" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }} />
            <Area type="monotone" dataKey="temp" stroke="#ca8a04" fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}