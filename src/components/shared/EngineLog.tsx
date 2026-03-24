"use client";

type LogEntry = { text: string; type: string };

type Props = {
  logs: LogEntry[];
  termRef: React.RefObject<HTMLDivElement | null>;
};

const LOG_CLASS: Record<string, string> = {
  process: "text-brand-primary font-bold mt-3",
  success: "text-brand-success",
  warn:    "text-brand-warning font-bold mt-2",
  error:   "text-brand-danger font-bold mt-2 bg-brand-danger/10 p-1.5 border-l-2 border-brand-danger rounded-r",
  data:    "text-muted text-[10px] pl-3 border-l-2 border-border-strong my-1 font-mono",
  info:    "text-primary",
};

export function EngineLog({ logs, termRef }: Props) {
  return (
    <section className="slide-up w-full">
      <div className="flex items-center gap-2 mb-3 px-2">
        <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold border border-brand-primary/40">
          2
        </span>
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          Engine Process Log
        </h3>
      </div>
      <div className="bg-card w-full h-[250px] flex flex-col shadow-sm border border-border-subtle rounded-xl overflow-hidden">
        <div className="bg-card-muted p-2 border-b border-border-subtle flex justify-between items-center rounded-t-xl">
          <div className="flex gap-2 ml-2">
            <div className="w-3 h-3 rounded-full bg-brand-danger/80" />
            <div className="w-3 h-3 rounded-full bg-brand-warning/80" />
            <div className="w-3 h-3 rounded-full bg-brand-success/80" />
          </div>
          <span className="text-[10px] text-muted font-mono mr-2">system_stdout</span>
        </div>
        <div
          ref={termRef}
          className="p-5 font-mono text-[11px] sm:text-xs text-secondary overflow-y-auto flex-1 space-y-1.5"
        >
          {logs.map((l, i) => (
            <div
              key={i}
              className={`fade-in break-words ${LOG_CLASS[l.type] ?? "text-secondary"}`}
            >
              {l.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
