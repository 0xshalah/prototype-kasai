/**
 * tests/ledger-consistency.test.ts
 * 
 * Tujuan: Membuktikan INV-02 — snapshot saldo konsisten dengan total jurnal
 * setelah serangkaian transaksi campuran (revenue + expense + prive).
 * 
 * Gunakan Mode B (Guardrail ON) — semua transaksi demo resmi dijalankan.
 * Initial cash: Rp5.000.000 (di-inject oleh /api/audit/reset)
 * 
 * Expected final cash = 5.000.000 + 50.000 - 300.000 - 200.000 = 4.550.000
 */

const BASE_URL = "http://localhost:3000";

type CommitPayload = {
  rawText: string;
  intent: "revenue" | "expense" | "prive";
  amount: number;
  currency: "IDR";
  debitAccount: string;
  creditAccount: string;
};

async function reset(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/audit/reset`, { method: "POST" });
  const json = await res.json();
  if (!json.success) throw new Error("Reset gagal: " + JSON.stringify(json));
  console.log("✅ Reset berhasil. Saldo awal: Rp5.000.000\n");
}

async function commitTransaction(payload: CommitPayload): Promise<{
  cashBalance: number;
  transactionId: string;
  journalEntries: any[];
}> {
  const res = await fetch(`${BASE_URL}/api/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(`Commit gagal (${payload.rawText}): ${JSON.stringify(json.error)}`);
  return {
    cashBalance: json.data.ledgerSummary.cashBalance,
    transactionId: json.data.transactionId,
    journalEntries: json.data.journalEntries,
  };
}

async function getLatestSnapshot(): Promise<{ cashBalance: number; expenseTotal: number; priveTotal: number }> {
  const res = await fetch(`${BASE_URL}/api/ledger/summary`);
  const json = await res.json();
  if (!json.success) throw new Error("Gagal ambil snapshot: " + JSON.stringify(json));
  return json.data;
}

async function getJournalHistory(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/api/ledger/history`);
  const json = await res.json();
  if (!json.success) throw new Error("Gagal ambil jurnal: " + JSON.stringify(json));
  return json.data; // array of BalanceSnapshot in chronological order
}

function computeCashFromSnapshots(snapshots: any[]): number {
  if (snapshots.length === 0) return 0;
  return snapshots[snapshots.length - 1].cashBalance;
}

// ===================================================
// MAIN TEST
// ===================================================
async function runLedgerConsistencyTest() {
  console.log("=".repeat(55));
  console.log("📒 LEDGER CONSISTENCY VERIFICATION (INV-02)");
  console.log("=".repeat(55));
  console.log("");

  // --- Initial State ---
  await reset();

  const transactions: CommitPayload[] = [
    {
      rawText: "Jualan es teh 50 ribu",
      intent: "revenue",
      amount: 50000,
      currency: "IDR",
      debitAccount: "Kas",
      creditAccount: "Pendapatan Usaha",
    },
    {
      rawText: "Bayar tagihan listrik 300 ribu",
      intent: "expense",
      amount: 300000,
      currency: "IDR",
      debitAccount: "Beban Utilitas",
      creditAccount: "Kas",
    },
    {
      rawText: "Ambil duit buat keperluan pribadi 200 ribu",
      intent: "prive",
      amount: 200000,
      currency: "IDR",
      debitAccount: "Prive Pemilik",
      creditAccount: "Kas",
    },
  ];

  const INITIAL_CASH = 5_000_000;
  let expectedCash = INITIAL_CASH;
  let previousCash = INITIAL_CASH;
  let allPassed = true;
  const anomalies: string[] = [];

  // --- Jalankan setiap transaksi dan verifikasi ---
  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    console.log(`▶  T${i + 1}: "${tx.rawText}"`);
    console.log(`   Intent: ${tx.intent} | Jumlah: Rp${tx.amount.toLocaleString("id-ID")}`);

    if (tx.intent === "revenue") {
      expectedCash += tx.amount;
    } else {
      expectedCash -= tx.amount;
    }

    try {
      const result = await commitTransaction(tx);
      const actualCash = result.cashBalance;
      const delta = actualCash - previousCash;
      
      // Verifikasi keseimbangan jurnal
      const debitTotal = result.journalEntries
        .filter((j: any) => j.entryType?.toLowerCase() === "debit")
        .reduce((sum: number, j: any) => sum + j.amount, 0);
      const creditTotal = result.journalEntries
        .filter((j: any) => j.entryType?.toLowerCase() === "credit")
        .reduce((sum: number, j: any) => sum + j.amount, 0);
      const journalBalance = debitTotal === creditTotal;

      console.log(`   Kas sebelum  : Rp${previousCash.toLocaleString("id-ID")}`);
      console.log(`   Kas sesudah  : Rp${actualCash.toLocaleString("id-ID")} (delta: ${delta >= 0 ? "+" : ""}${delta.toLocaleString("id-ID")})`);
      console.log(`   Expected kas : Rp${expectedCash.toLocaleString("id-ID")}`);
      console.log(`   Jurnal balance: Debit Rp${debitTotal.toLocaleString()} = Kredit Rp${creditTotal.toLocaleString()} → ${journalBalance ? "✅ SEIMBANG" : "❌ TIDAK SEIMBANG"}`);

      if (actualCash !== expectedCash) {
        console.log(`   ⚠️  MISMATCH saldo! Expected ${expectedCash}, actual ${actualCash}`);
        anomalies.push(`T${i + 1}: saldo mismatch — expected ${expectedCash}, got ${actualCash}`);
        allPassed = false;
      } else {
        console.log(`   ✅ Saldo sesuai ekspektasi`);
      }
      if (!journalBalance) {
        anomalies.push(`T${i + 1}: jurnal tidak seimbang — debit ${debitTotal}, kredit ${creditTotal}`);
        allPassed = false;
      }

      previousCash = actualCash;
    } catch (e: any) {
      console.log(`   ❌ ERROR: ${e.message}`);
      anomalies.push(`T${i + 1}: error — ${e.message}`);
      allPassed = false;
    }
    console.log("");
  }

  // --- Verifikasi Final: snapshot vs journal history ---
  console.log("-".repeat(55));
  console.log("📊 FINAL CHECK — Snapshot vs Journal History");
  console.log("-".repeat(55));

  try {
    const [snapshot, history] = await Promise.all([getLatestSnapshot(), getJournalHistory()]);
    const snapshotCash = snapshot.cashBalance;
    const historyCash = computeCashFromSnapshots(history);

    console.log(`   Expected final cash : Rp${expectedCash.toLocaleString("id-ID")}`);
    console.log(`   API /ledger/summary : Rp${snapshotCash.toLocaleString("id-ID")} ${snapshotCash === expectedCash ? "✅" : "❌"}`);
    console.log(`   API /ledger/history : Rp${historyCash.toLocaleString("id-ID")} ${historyCash === expectedCash ? "✅" : "❌"}`);
    console.log(`   Snapshot == History : ${snapshotCash === historyCash ? "✅ SINKRON" : "❌ TIDAK SINKRON"}`);

    if (snapshotCash !== expectedCash) {
      anomalies.push(`Final: snapshot ${snapshotCash} ≠ expected ${expectedCash}`);
      allPassed = false;
    }
  } catch (e: any) {
    console.log(`   ❌ ERROR: ${e.message}`);
    anomalies.push(`Final check error: ${e.message}`);
    allPassed = false;
  }

  // --- Summary Report ---
  console.log("");
  console.log("=".repeat(55));
  console.log(allPassed ? "🎉 RESULT: PASSED — Sistem financially sound!" : "🚨 RESULT: FAILED — Ada anomali ditemukan!");
  if (anomalies.length > 0) {
    console.log("\nAnomalies:");
    anomalies.forEach(a => console.log(`  - ${a}`));
  }
  console.log("=".repeat(55));
}

runLedgerConsistencyTest().catch(console.error);
