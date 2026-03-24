"use client";

import { useState, useEffect, useCallback } from "react";
import { getVaultChain, verifyAudit, demoTamper, VaultBlockItem } from "@/lib/api/audit";
import { VerifyBanner } from "../bank/VerifyBanner";
import { VaultChainTable } from "../bank/VaultChainTable";
import { AcsScoreGauge } from "../bank/AcsScoreGauge";
import { CashFlowChart } from "../bank/CashFlowChart";

interface BankEvidencePanelProps {
  onRefresh?: () => void;
}

export function BankEvidencePanel({ onRefresh }: BankEvidencePanelProps) {
  const [chain, setChain] = useState<VaultBlockItem[]>([]);
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "pass" | "fail" | "error">("idle");
  const [verifyMessage, setVerifyMessage] = useState<string>("");
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [isTamperActive, setIsTamperActive] = useState(false);
  
  // A simple counter to trigger refetches in child components
  const [forceRefresh, setForceRefresh] = useState(0);

  const fetchChain = useCallback(async () => {
    try {
      const res = await getVaultChain();
      if (res.success && res.data) {
        setChain(res.data.items);
      }
    } catch (e) {
      console.error("Failed to fetch vault chain", e);
    }
  }, []);

  useEffect(() => {
    fetchChain();
    handleVerify(); // Verify initially
    
    // Polling every 10 seconds for real-time shield response
    const interval = setInterval(() => {
      fetchChain();
      handleVerify(true); // Silent polling to avoid flicker
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchChain, forceRefresh]);

  const handleVerify = async (silent = false) => {
    if (!silent) {
      setVerifyStatus("verifying");
      setTamperedIndex(null);
      setVerifyMessage("");
    }
    
    try {
      const res = await verifyAudit();
      if (res.success && res.data) {
        setVerifyStatus(res.data.isValid ? "pass" : "fail");
        setVerifyMessage(res.data.message);
        setTamperedIndex(res.data.tamperedBlockIndex);
      } else {
        setVerifyStatus("error");
        setVerifyMessage(res.error?.message || "Kesalahan validasi jaringan");
      }
    } catch {
      setVerifyStatus("error");
      setVerifyMessage("Terjadi kesalahan jaringan saat verifikasi");
    }
  };

  const handleTamper = async () => {
    const confirmed = confirm("⚠ SIMULASI TAMPER: Ini akan memodifikasi nominal transaksi terakhir di database secara langsung tanpa memperbarui Hash Chain — menyimulasikan serangan insider. Lanjutkan?");
    if (!confirmed) return;

    try {
      const res = await demoTamper();
      if (res.success) {
        alert(`⚠ Simulasi Tamper Berhasil!\nNominal transaksi diubah dari Rp ${res.data?.oldAmount?.toLocaleString("id-ID")} → Rp ${res.data?.newAmount?.toLocaleString("id-ID")} tanpa memperbarui Hash Chain.\n\nKlik 'Jalankan Audit Vault Chain' untuk mendeteksinya.`);
        // Atomically refresh all panels
        await fetchChain();
        onRefresh?.();
        setForceRefresh(prev => prev + 1);
        setVerifyStatus("idle");
        setVerifyMessage("");
        setTamperedIndex(null);
        setIsTamperActive(true); // Show tamper active banner
      } else if (res.error?.code === "FORBIDDEN") {
        alert("Endpoint ini hanya tersedia saat DEMO_MODE=true di file .env");
      } else if (res.error?.code === "NO_DATA") {
        alert("Belum ada transaksi yang bisa dimanipulasi. Commit minimal satu transaksi terlebih dahulu.");
      } else {
        alert("Gagal simulasi: " + (res.error?.message || "Unknown error"));
      }
    } catch {
      alert("Gagal terhubung ke server saat tamper.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">KasAI: Konsol Auditor & Bank</h1>
          <p className="text-secondary">Verifikasi kredibilitas dan integritas ledger terverifikasi.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleTamper}
            className="flex items-center gap-2 px-4 py-2 bg-brand-danger/10 hover:bg-brand-danger/20 text-brand-danger border border-brand-danger/20 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Simulasi Tamper
          </button>

          <button 
            onClick={() => handleVerify()}
            className="flex items-center gap-2 px-5 py-2 bg-brand-primary hover:opacity-90 text-on-brand shadow-sm rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Jalankan Audit Vault Chain
          </button>
        </div>
      </div>

      {/* Tamper Active Warning Banner */}
      {isTamperActive && (
        <div className="flex items-start gap-3 bg-brand-danger/10 border border-brand-danger/30 rounded-xl px-5 py-4">
          <div className="w-5 h-5 rounded-full bg-brand-danger/20 text-brand-danger flex items-center justify-center shrink-0 mt-0.5">
            <i className="fa-solid fa-triangle-exclamation text-[10px]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-danger">Simulasi Tamper Aktif</p>
            <p className="text-xs text-brand-danger/80 mt-0.5 leading-relaxed">
              Saldo relasional di database telah dimanipulasi secara sepihak dan dapat berbeda dari chain terverifikasi. Ini adalah kondisi yang disimulasikan — jalankan Audit Vault Chain untuk mendeteksi penyimpangan.
            </p>
          </div>
          <button onClick={() => setIsTamperActive(false)} className="text-brand-danger/50 hover:text-brand-danger text-sm shrink-0">✕</button>
        </div>
      )}

      <VerifyBanner 
        status={verifyStatus} 
        message={verifyMessage} 
        tamperedBlockIndex={tamperedIndex} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
          <AcsScoreGauge forceRefresh={forceRefresh} />
          
          {/* Tamper Proof Shield Visual */}
          <div className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all ${
            verifyStatus === 'pass' 
            ? 'bg-brand-primary/10 border-brand-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : verifyStatus === 'fail'
            ? 'bg-brand-danger/10 border-brand-danger shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
            : 'bg-surface border-surface-highlight'
          }`}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-surface border border-surface-highlight shadow-xl relative">
                {verifyStatus === 'pass' ? (
                  <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ) : verifyStatus === 'fail' ? (
                  <svg className="w-8 h-8 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg className="w-8 h-8 text-secondary animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
             </div>
             <h4 className="text-on-surface font-semibold text-lg">
               {verifyStatus === 'pass' ? 'Rantai Blok Aman' : verifyStatus === 'fail' ? 'Integritas Rusak' : 'Memverifikasi...'}
             </h4>
             <p className="text-xs text-secondary mt-2">
               {verifyStatus === 'pass' 
                ? 'Semua transaksi tervalidasi secara kriptografis melalui Audit Service.' 
                : verifyStatus === 'fail'
                ? 'Terdeteksi manipulasi! Data di database tidak sesuai dengan Hash Chain.'
                : 'Menganalisis anomali pada siklus ledger...'}
             </p>
          </div>
        </div>
        
        <div className="md:col-span-2 flex flex-col gap-6">
          <CashFlowChart forceRefresh={forceRefresh} />
          <VaultChainTable 
            blocks={chain} 
            tamperedBlockIndex={tamperedIndex} 
          />
        </div>
      </div>
    </div>
  );
}
