"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScanHistoryChartProps {
  data: Array<{
    date: string;
    score: number;
  }>;
}

export function ScanHistoryChart({ data }: ScanHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 flex items-center justify-center min-h-64 shadow-lg">
        <p className="text-muted-foreground text-sm">
          Belum ada data riwayat scan
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Riwayat Skor (5 Scan Terakhir)
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "0.75rem" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "0.75rem" }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value) => [`${value}/100`, "Skor"]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ fill: "#0ea5e9", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
