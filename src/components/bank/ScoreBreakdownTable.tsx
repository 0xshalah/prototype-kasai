"use client";

import { useEffect, useState } from "react";
import { getScoreSnapshot, ScoreSnapshotData } from "@/lib/api/score";

export function ScoreBreakdownTable({ forceRefresh }: { forceRefresh: number }) {
  const [data, setData] = useState<ScoreSnapshotData | null>(null);

  useEffect(() => {
    async function fetchScore() {
      const res = await getScoreSnapshot();
      if (res.success && res.data) setData(res.data);
    }
    fetchScore();
  }, [forceRefresh]);

  const factors = data?.factors || [];

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border-subtle overflow-hidden">
      <div className="bg-card-muted px-5 py-4 border-b border-border-subtle">
        <h3 className="font-semibold text-primary">Analisis Perilaku Akuntansi</h3>
        <p className="text-xs text-secondary mt-1">Faktor determinan skor kelayakan kredit berbasis Ledger</p>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-card border-b border-border-subtle text-secondary uppercase text-xs font-semibold">
          <tr>
            <th className="px-5 py-3">Faktor Penilaian</th>
            <th className="px-5 py-3 text-right">Dampak (Delta)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {factors.length === 0 && (
            <tr>
              <td colSpan={2} className="px-5 py-6 text-center text-muted">Belum ada aktivitas terekam.</td>
            </tr>
          )}
          {factors.map((factor, idx) => (
            <tr key={idx} className="hover:bg-card-muted transition-colors text-primary">
              <td className="px-5 py-4 font-medium">{factor.name}</td>
              <td className="px-5 py-4 text-right">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                  factor.delta > 0 ? 'bg-brand-success/20 text-brand-success' :
                  factor.delta < 0 ? 'bg-brand-danger/20 text-brand-danger' :
                  'bg-card-muted border border-border-strong text-muted'
                }`}>
                  {factor.delta > 0 ? `+${factor.delta}` : factor.delta}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border-strong bg-card-muted/50">
            <td colSpan={2} className="px-5 py-3 text-[10px] text-muted leading-relaxed italic">
              Skor base UMKM dimulai dari {data?.baseScore ?? 680}. Tabel menampilkan kontribusi faktor kumulatif dari histori ledger tervalidasi.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
