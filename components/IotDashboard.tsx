"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", value: 40 },
  { time: "04:00", value: 65 },
  { time: "08:00", value: 45 },
  { time: "12:00", value: 85 },
  { time: "16:00", value: 70 },
  { time: "20:00", value: 90 },
];

export default function IotDashboard() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="#525252" fontSize={12} tickLine={false} />
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
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}