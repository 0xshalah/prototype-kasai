"use client";

import { useState, useEffect } from "react";

export function AcsScoreGauge({ forceRefresh = 0 }: { forceRefresh?: number }) {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Gauge boundaries
  const MIN_SCORE = 300;
  const MAX_SCORE = 850;
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch("/api/score");
        const json = await res.json();
        if (json.success && json.data) {
          setScore(json.data.totalScore);
        }
      } catch (error) {
        console.error("Failed to fetch score", error);
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, [forceRefresh]);

  // Handle CSS animation offset
  const normalizedScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
  const percent = (normalizedScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  const strokeDashoffset = circumference - percent * circumference;

  let colorClass = "stroke-red-500";
  let statusText = "Risiko Tinggi";
  
  if (percent >= 0.8) {
    colorClass = "stroke-[#10B981]"; // Emerald / Green
    statusText = "Sangat Baik";
  } else if (percent >= 0.5) {
    colorClass = "stroke-yellow-400";
    statusText = "Cukup Baik";
  }

  return (
    <div className="w-full bg-surface border border-surface-highlight rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-72">
      <h3 className="text-on-surface font-semibold mb-6 self-start w-full">KasAI Underwriting Score</h3>
      
      {loading ? (
        <div className="text-secondary text-sm my-auto">Menghitung...</div>
      ) : (
        <div className="relative flex flex-col items-center flex-1 justify-end pb-4">
          <svg className="w-48 h-24 overflow-visible" viewBox="0 0 200 100">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#2A2A2A"
              strokeWidth="16"
              strokeLinecap="round"
            />
            
            {/* Colored Progress Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          
          <div className="absolute bottom-4 flex flex-col items-center translate-y-3">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {score}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: percent >= 0.8 ? '#10B981' : percent >= 0.5 ? '#FBBF24' : '#EF4444' }}>
              {statusText}
            </span>
          </div>
        </div>
      )}
      
      <div className="w-full text-center mt-auto pt-2 border-t border-surface-highlight/50">
        <span className="text-[10px] text-secondary">
          Didukung oleh integrasi SAK EMKM & verifikasi rantai blok
        </span>
      </div>
    </div>
  );
}
