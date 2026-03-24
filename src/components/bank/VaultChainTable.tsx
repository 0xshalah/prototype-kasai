"use client";

import { VaultBlockItem } from "@/lib/api/audit";

interface VaultChainTableProps {
  blocks: VaultBlockItem[];
  tamperedBlockIndex: number | null;
}

export function VaultChainTable({ blocks, tamperedBlockIndex }: VaultChainTableProps) {
  
  const renderRow = (block: VaultBlockItem) => {
    // If there's a tampered block, everything at and after it is considered invalid/broken chain
    const isCompromised = tamperedBlockIndex !== null && block.blockIndex >= tamperedBlockIndex;
    const isExactOrigin = tamperedBlockIndex === block.blockIndex;

    const rowClass = isExactOrigin 
      ? 'bg-brand-danger/10 border-2 border-brand-danger relative z-10' 
      : isCompromised 
        ? 'bg-brand-danger/5 opacity-75' 
        : 'hover:bg-card-muted text-primary';

    return (
      <tr key={block.blockIndex} className={`transition-all ${rowClass} border-b border-border-subtle last:border-b-0`}>
        <td className="px-4 py-4 align-top w-20">
          <div className="flex flex-col items-center">
             <div className={`text-xs font-bold px-2 py-1 rounded-full ${isCompromised ? 'bg-brand-danger/20 text-brand-danger' : 'bg-card-muted border border-border-strong text-secondary'}`}>
                B{block.blockIndex}
             </div>
             {block.blockIndex > 0 && (
               <div className={`h-full w-0.5 mt-2 ${isCompromised ? 'bg-brand-danger/30' : 'bg-border-strong'}`}></div>
             )}
          </div>
        </td>
        <td className="px-4 py-4 font-mono text-[11px] leading-relaxed w-[60%] overflow-hidden break-all">
           <div className="mb-2">
             <span className="text-muted font-sans text-xs inline-block mb-1">Payload:</span><br/>
             <span className={isCompromised ? "text-brand-danger" : "text-primary"}>{block.canonicalPayload}</span>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-subtle">
             <div>
                <span className="text-muted font-sans text-xs inline-block mb-1 font-semibold">Previous Hash Link:</span><br/>
                <span className={`px-2 py-1 rounded bg-card-muted line-clamp-1 ${isCompromised ? 'text-brand-danger' : 'text-secondary'}`} title={block.prevHash}>
                  {block.prevHash}
                </span>
             </div>
             <div>
                <span className="text-muted font-sans text-xs inline-block mb-1 font-semibold">Block SHA-256 Hash:</span><br/>
                <span className={`px-2 py-1 rounded line-clamp-1 ${isCompromised ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-success/20 text-brand-success'}`} title={block.hash}>
                  {block.hash}
                </span>
             </div>
           </div>
        </td>
        <td className="px-4 py-4 align-middle text-right">
           {isExactOrigin ? (
             <span className="inline-flex items-center gap-1 bg-brand-danger/10 text-brand-danger px-3 py-1 rounded-full text-xs font-bold animate-pulse">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               Titik Anomali
             </span>
           ) : isCompromised ? (
             <span className="text-brand-danger text-xs font-bold tracking-widest uppercase">Invalid</span>
           ) : (
             <span className="text-brand-success text-xs font-bold tracking-widest uppercase flex items-center justify-end gap-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               Valid
             </span>
           )}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border-subtle overflow-hidden">
      <div className="bg-card-muted border-b border-border-subtle px-5 py-4 flex justify-between items-center">
         <div>
           <h3 className="font-bold text-primary">Bukti Audit Kriptografi Berantai</h3>
           <p className="text-xs text-secondary mt-1">Append-only Audit Chain · Blok Terbaru Ditampilkan Pertama</p>
         </div>
         <span className="text-xs font-mono text-muted bg-card px-3 py-1 rounded-full border border-border-subtle">{blocks.length} blok</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <tbody>
            {blocks.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-muted italic">No chain records...</td></tr>
            ) : (
              blocks.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
