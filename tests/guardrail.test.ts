/**
 * tests/guardrail.test.ts
 * 
 * Tujuan: Memverifikasi Invariants INV-03, INV-05, INV-06:
 * 1. Transaksi ambigu TIDAK boleh otomatis di-commit.
 * 2. Transaksi dengan saldo tidak cukup (Insufficient Cash) HARUS ditolak.
 */

const BASE_URL = "http://localhost:3000";

async function reset(): Promise<void> {
    await fetch(`${BASE_URL}/api/audit/reset`, { method: "POST" });
}

async function getStats() {
    const [journalRes, summaryRes, vaultRes] = await Promise.all([
        fetch(`${BASE_URL}/api/ledger/history`),
        fetch(`${BASE_URL}/api/ledger/summary`),
        fetch(`${BASE_URL}/api/audit/chain`)
    ]);
    
    const journalData = await journalRes.json();
    const summaryData = await summaryRes.json();
    const vaultData = await vaultRes.json();
    
    return {
        journalCount: journalData.data?.length || 0,
        cash: summaryData.data?.cashBalance || 0,
        vaultCount: vaultData.data?.blocks?.length || 0
    };
}

async function runGuardrailTests() {
    console.log("=".repeat(55));
    console.log("🛡️  GUARDRAIL VERIFICATION LOOP");
    console.log("=".repeat(55));

    await reset();
    console.log("✅ Reset sukses. Baseline: Kas Rp5.000.000\n");

    // -------------------------------------------------------------------------
    // TEST A: Ambiguous Input
    // -------------------------------------------------------------------------
    const beforeA = await getStats();
    console.log("▶  TEST A: Ambiguous Input ('Ambil uang kas 200 ribu')");
    
    const parseResA = await fetch(`${BASE_URL}/api/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: "Ambil uang kas 200 ribu" })
    });
    const parseDataA = await parseResA.json();
    
    console.log(`   Status: ${parseDataA.success ? "SUCCESS" : "ERROR"}`);
    if (parseDataA.error) {
        console.log(`   Error Code: ${parseDataA.error.code}`);
        console.log(`   Message: ${parseDataA.error.message}`);
    }

    const afterA = await getStats();
    const passA = !parseDataA.success && 
                  parseDataA.error?.code === "NEEDS_HUMAN_REVIEW" &&
                  afterA.journalCount === beforeA.journalCount &&
                  afterA.cash === beforeA.cash &&
                  afterA.vaultCount === beforeA.vaultCount;

    console.log(`   Journal b/a: ${beforeA.journalCount}/${afterA.journalCount}`);
    console.log(`   Cash b/a   : Rp${beforeA.cash}/${afterA.cash}`);
    console.log(`   Vault b/a  : ${beforeA.vaultCount}/${afterA.vaultCount}`);
    console.log(`   RESULT A   : ${passA ? "✅ PASSED (Blocked as expected)" : "❌ FAILED"}\n`);

    // -------------------------------------------------------------------------
    // TEST B: Insufficient Cash
    // -------------------------------------------------------------------------
    const beforeB = await getStats();
    console.log("▶  TEST B: Insufficient Cash ('Bayar renovasi toko 10 juta')");
    
    const commitResB = await fetch(`${BASE_URL}/api/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           rawText: "Bayar renovasi toko 10 juta",
           intent: "expense",
           amount: 10000000,
           currency: "IDR",
           debitAccount: "Beban Renovasi",
           creditAccount: "Kas"
        })
    });
    const commitDataB = await commitResB.json();

    console.log(`   Status: ${commitDataB.success ? "SUCCESS" : "ERROR"}`);
    if (commitDataB.error) {
        console.log(`   Error Code: ${commitDataB.error.code}`);
        console.log(`   Message: ${commitDataB.error.message}`);
    }

    const afterB = await getStats();
    const passB = !commitDataB.success &&
                  commitDataB.error?.code === "INSUFFICIENT_FUNDS" &&
                  afterB.journalCount === beforeB.journalCount &&
                  afterB.cash === beforeB.cash &&
                  afterB.vaultCount === beforeB.vaultCount;

    console.log(`   Journal b/a: ${beforeB.journalCount}/${afterB.journalCount}`);
    console.log(`   Cash b/a   : Rp${beforeB.cash}/${afterB.cash}`);
    console.log(`   Vault b/a  : ${beforeB.vaultCount}/${afterB.vaultCount}`);
    console.log(`   RESULT B   : ${passB ? "✅ PASSED (Blocked as expected)" : "❌ FAILED"}\n`);

    console.log("=".repeat(55));
    console.log(passA && passB ? "🎉 OVERALL GUARDRAIL: PASSED" : "🚨 OVERALL GUARDRAIL: FAILED");
    console.log("=".repeat(55));
}

runGuardrailTests().catch(console.error);
