import { AuditService } from "../src/server/services/audit.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_URL = "http://localhost:3000/api/commit";

async function runTests() {
  console.log("=========================================");
  console.log("🚀 STARTING API COMMIT TESTS");
  console.log("=========================================");

  // Reset demo business state first
  await prisma.vaultBlock.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.transaction.deleteMany({ where: { businessId: "biz_demo_001" } });
  await prisma.balanceSnapshot.deleteMany({ where: { businessId: "biz_demo_001" } });

  // Add initial cash so we can test happy path and sufficient funds
  await prisma.balanceSnapshot.create({
    data: {
      businessId: "biz_demo_001",
      cashBalance: 500000,
      expenseTotal: 0,
      priveTotal: 0,
    }
  });

  const auditService = new AuditService(prisma);

  console.log("\n[Test 1] Valid Case: Pengeluaran Rp100.000");
  const res1 = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rawText: "Bayar listrik seratus ribu",
      intent: "expense",
      amount: 100000,
      currency: "IDR",
      debitAccount: "Beban Listrik",
      creditAccount: "Kas"
    })
  });
  
  const data1 = await res1.json();
  if (res1.ok && data1.success) {
    console.log("✅ Test 1 API Response: 200 OK");
    const verify = await auditService.verifyChain("biz_demo_001");
    console.log(`✅ Test 1 Audit Verify: ${verify.valid ? "VALID" : "INVALID"}`);
  } else {
    console.error("❌ Test 1 FAILED:", data1);
  }

  console.log("\n[Test 2] Invalid Case: Zero-Sum Violation / Bad Schema");
  console.log("Note: Karena API Schema Zod hanya menerima 1 field `amount` untuk digenerate secara otomatis menjadi Double-Entry (Debit = Credit), secara arsitektural mustahil bagi client API untuk mengirim jurnal tidak seimbang.");
  console.log("Namun kita akan tes mengirim payload yang tidak sesuai kontrak (misal menambahkan field aneh).");
  const res2 = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rawText: "Hacker mencoba tidak seimbang",
      intent: "expense",
      amountDebit: 100000,  // Tidak ada di schema
      amountCredit: 50000,  // Tidak ada di schema
      currency: "IDR",
      debitAccount: "Beban",
      creditAccount: "Kas"
    })
  });
  
  const data2 = await res2.json();
  if (res2.status === 400 && data2.error?.code === "VALIDATION_ERROR") {
    console.log("✅ Test 2 API Response: Ditolak oleh Zod Schema (VALIDATION_ERROR) - Zero-Sum terjamin by-design API");
  } else {
    console.error("❌ Test 2 FAILED (Unexpected response):", data2);
  }

  console.log("\n[Test 3] Stress Test (Insufficient Funds)");
  const res3 = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rawText: "Beli mesin seharga satu juta",
      intent: "expense",
      amount: 1000000, // Saldo sisa 400.000 (awal 500k - 100k)
      currency: "IDR",
      debitAccount: "Peralatan",
      creditAccount: "Kas"
    })
  });
  
  const data3 = await res3.json();
  if (!res3.ok || !data3.success) {
    if (data3.error?.code === "INSUFFICIENT_FUNDS") {
      console.log("✅ Test 3 API Response: Guardrail bekerja! Ditolak karena INSUFFICIENT_FUNDS");
    } else {
      console.log("❌ Test 3 FAILED with wrong error:", data3);
    }
  } else {
    console.error("❌ Test 3 FAILED: Transaksi lolos padahal saldo kurang!");
  }

  console.log("\n=========================================");
  console.log("🏁 ALL TESTS COMPLETED");
  console.log("=========================================");
}

runTests().catch(console.error).finally(() => prisma.$disconnect());
