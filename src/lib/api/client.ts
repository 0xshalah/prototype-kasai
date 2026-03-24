/* eslint-disable @typescript-eslint/no-explicit-any */
const j = (r: Response) => r.json();

export async function postParse(rawText: string) {
  return j(await fetch("/api/parse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rawText }) }));
}

export async function postCommit(payload: any) {
  return j(await fetch("/api/commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }));
}

export async function fetchSummary() {
  return j(await fetch("/api/ledger/summary", { cache: "no-store" }));
}

export async function fetchJournal(limit = 10) {
  return j(await fetch(`/api/ledger/journal?limit=${limit}`, { cache: "no-store" }));
}

export async function fetchScore() {
  return j(await fetch("/api/score", { cache: "no-store" }));
}

export async function fetchChain(limit = 50) {
  return j(await fetch(`/api/audit/chain?limit=${limit}`, { cache: "no-store" }));
}

export async function fetchVerify() {
  return j(await fetch("/api/audit/verify", { cache: "no-store" }));
}

export async function postTamper(targetBlockIndex: number) {
  return j(await fetch("/api/demo/tamper", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetBlockIndex, mode: "append_amount_digits" }) }));
}

export async function postReset() {
  return j(await fetch("/api/demo/reset", { method: "POST" }));
}

export async function postTranscribe(audio: Blob, transcriptHint?: string) {
  const formData = new FormData();
  formData.append("audio", audio, "capture.webm");
  if (transcriptHint) formData.append("transcriptHint", transcriptHint);
  
  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });
  return res.json();
}
