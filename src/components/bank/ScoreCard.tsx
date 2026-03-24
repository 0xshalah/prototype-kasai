"use client";

import { useEffect, useState } from "react";
import { getScoreSnapshot, ScoreSnapshotData } from "@/lib/api/score";

export function ScoreCard({ forceRefresh }: { forceRefresh: number }) {
  const [data, setData] = useState<ScoreSnapshotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchScore() {
      setIsLoading(true);
      try {
        const res = await getScoreSnapshot();
        if (res.success && res.data) setData(res.data);
      } catch (e) {
        console.error("Failed to fetch score", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchScore();
  }, [forceRefresh]);

  const score = data?.totalScore || 680;
  
  // Basic scoring colors
  const colorClass = score >= 700 ? "text-brand-success" : score >= 600 ? "text-brand-warning" : "text-brand-danger";
  const label = score >= 700 ? "LOW RISK" : score >= 600 ? "MODERATE" : "HIGH RISK";
  const labelClass = score >= 700 ? "bg-brand-success/20 text-brand-success" : score >= 600 ? "bg-brand-warning/20 text-brand-warning" : "bg-brand-danger/20 text-brand-danger";

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border-subtle text-center relative overflow-hidden flex flex-col items-center justify-center">
      {isLoading && <div className="absolute inset-0 bg-page/60 flex items-center justify-center backdrop-blur-sm z-10"><span className="animate-spin h-5 w-5 border-2 border-brand-primary border-t-transparent rounded-full"></span></div>}
      
      <h3 className="text-muted font-semibold mb-2 uppercase tracking-wider text-sm">Underwriting Score</h3>
      <div className={`text-6xl font-black ${colorClass} tracking-tighter`}>
        {score}
      </div>
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${labelClass}`}>
        {label}
      </div>
    </div>
  );
}
