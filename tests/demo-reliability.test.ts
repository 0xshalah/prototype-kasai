/**
 * tests/demo-reliability.test.ts
 * 
 * Tujuan: Membuktikan Phase 3 Demo Reliability — reset deterministik & repeatability.
 */

const BASE_URL = "http://localhost:3000";

type SystemStats = {
    cash: number;
    transactionCount: number;
    journalCount: number;
    vaultCount: number;
    score: number;
    auditStatus: string;
};

async function getStats(): Promise<SystemStats> {
    const [summaryRes, journalRes, vaultRes, scoreRes, auditRes] = await Promise.all([
        fetch(`${BASE_URL}/api/ledger/summary`),
        fetch(`${BASE_URL}/api/ledger/history`),
        fetch(`${BASE_URL}/api/audit/chain`),
        fetch(`${BASE_URL}/api/score`),
        fetch(`${BASE_URL}/api/audit/verify`)
    ]);

    const summary = await summaryRes.json();
    const history = await journalRes.json();
    const vault = await vaultRes.json();
    const score = await scoreRes.json();
    const audit = await auditRes.json();

    return {
        cash: summary.data?.cashBalance || 0,
        transactionCount: history.data?.length || 0, // This returns BalanceSnapshots, which is 1 per commit
        journalCount: history.data?.length || 0, // In this API, it's snapshots
        vaultCount: vault.data?.items?.length || 0,
        score: score.data?.totalScore || 0,
        auditStatus: audit.data?.isValid ? "PASS" : "FAIL"
    };
}

async function reset(): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/audit/reset`, { method: "POST" });
    const json = await res.json();
    if (!json.success) throw new Error("Reset failed");
}

async function commitDemo(): Promise<void> {
    await fetch(`${BASE_URL}/api/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            rawText: "Jualan 50k",
            intent: "revenue",
            amount: 50000,
            currency: "IDR",
            debitAccount: "Kas",
            creditAccount: "Pendapatan"
        })
    });
}

async function triggerTamper(): Promise<void> {
    await fetch(`${BASE_URL}/api/audit/tamper`, { method: "POST" });
}

function statsEqual(a: SystemStats, b: SystemStats): boolean {
    return a.cash === b.cash &&
           a.vaultCount === b.vaultCount &&
           a.score === b.score &&
           a.auditStatus === b.auditStatus;
}

async function runReliabilityCycle(cycleNum: number, baseline: SystemStats): Promise<boolean> {
    console.log(`\n🔄 --- CYCLE ${cycleNum} ---`);
    
    // 1. Reset
    await reset();
    const afterReset = await getStats();
    const resetMatch = statsEqual(afterReset, baseline);
    console.log(`   [Reset] Match Baseline: ${resetMatch ? "✅" : "❌"}`);
    if (!resetMatch) console.log("   Details:", afterReset);

    // 2. Happy Path
    await commitDemo();
    const afterHappy = await getStats();
    console.log(`   [Commit] Cash: ${afterHappy.cash} | Vault: ${afterHappy.vaultCount}`);

    // 3. Tamper
    await triggerTamper();
    const afterTamper = await getStats();
    console.log(`   [Tamper] Audit Status: ${afterTamper.auditStatus}`);

    // 4. Final Reset
    await reset();
    const finalStats = await getStats();
    const finalMatch = statsEqual(finalStats, baseline);
    console.log(`   [Final Reset] Match Baseline: ${finalMatch ? "✅" : "❌"}`);

    return resetMatch && finalMatch;
}

async function main() {
    console.log("=".repeat(55));
    console.log("🏙️  DEMO RELIABILITY & REPEATABILITY TEST");
    console.log("=".repeat(55));

    await reset();
    const baseline = await getStats();
    console.log("📍  Established Baseline Stats:");
    console.log(`    - Cash: Rp${baseline.cash.toLocaleString()}`);
    console.log(`    - Vault Blocks: ${baseline.vaultCount}`);
    console.log(`    - Score: ${baseline.score}`);
    console.log(`    - Audit: ${baseline.auditStatus}\n`);

    let allSuccessful = true;
    for (let i = 1; i <= 3; i++) {
        const success = await runReliabilityCycle(i, baseline);
        if (!success) allSuccessful = false;
    }

    console.log("\n" + "=".repeat(55));
    console.log(allSuccessful ? "🎉 VERDICT: 100% REPEATABLE" : "🚨 VERDICT: FAILED (Inconsistent Reset)");
    console.log("=".repeat(55));
}

main().catch(console.error);
