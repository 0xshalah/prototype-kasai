"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function CashFlowChart({ forceRefresh = 0 }: { forceRefresh?: number }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/ledger/history");
        const json = await res.json();
        if (json.success && json.data) {
          const chartData = json.data.map((item: any, idx: number) => ({
            name: `Tx ${idx + 1}`,
            NilaiKas: item.cashBalance,
            createdAt: new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error("Failed to fetch ledger history", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [forceRefresh]);

  if (loading) {
    return <div className="h-64 w-full flex items-center justify-center text-secondary">Memuat grafik...</div>;
  }

  if (data.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center text-secondary">Belum ada data transaksi</div>;
  }

  return (
    <div className="w-full h-72 bg-surface border border-surface-highlight rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
      <h3 className="text-on-surface font-semibold mb-6 flex items-center gap-2">
        <i className="fa-solid fa-chart-line text-brand-primary"></i>
        Tren Saldo Kas
      </h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="createdAt" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="#888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `Rp${(val / 1000)}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '8px' }}
              itemStyle={{ color: '#10B981' }}
              formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Saldo Kas']}
              labelStyle={{ color: '#888' }}
            />
            <Area 
              type="monotone" 
              dataKey="NilaiKas" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorKas)" 
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
