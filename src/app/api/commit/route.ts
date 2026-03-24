import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { GuardrailService } from "@/server/services/guardrail.service";
import { LedgerService } from "@/server/services/ledger.service";
import { ScoreService } from "@/server/services/score.service";
import { VaultService } from "@/server/services/vault.service";

const CommitRequestSchema = z.object({
  rawText: z.string(),
  intent: z.enum(["revenue", "expense", "prive"]),
  amount: z.number().int().positive(),
  currency: z.literal("IDR"),
  debitAccount: z.string(),
  creditAccount: z.string(),
  reviewResolution: z.string().nullable().optional()
}).strict();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = CommitRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Format request tidak sesuai dengan kontrak commit",
          details: result.error.format()
        }
      }, { status: 400 });
    }

    const data = result.data;
    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";

    // 1. Guardrail Validation
    const validation = await GuardrailService.validateTransaction({
      intent: data.intent,
      amount: data.amount,
      debitAccount: data.debitAccount,
      creditAccount: data.creditAccount,
      businessId,
    });

    if (!validation.allowCommit) {
      if (validation.needsHumanReview) {
        return NextResponse.json({
          success: false,
          error: {
            code: "NEEDS_HUMAN_REVIEW",
            message: "Transaksi ambigu",
            details: { reason: validation.reason }
          }
        });
      }
      return NextResponse.json({
        success: false,
        error: {
          code: "INSUFFICIENT_FUNDS",
          message: validation.reason || "Transaksi ditolak",
          details: {}
        }
      });
    }

    // 2. Execute DB Transaction
    const res = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 2.a Commit to Ledger (Transaction, Journal, Balance)
      const ledgerResult = await LedgerService.commitToLedger(tx, {
        businessId,
        rawText: data.rawText,
        intent: data.intent,
        amount: data.amount,
        debitAccount: data.debitAccount,
        creditAccount: data.creditAccount,
      });

      // 2.b Update ACS Score
      const score = await ScoreService.updateScore(tx, {
        transactionId: ledgerResult.txn.id,
        intent: data.intent,
      });

      // 2.c Hash Chain Vault
      const block = await VaultService.appendBlock(tx, {
        transactionId: ledgerResult.txn.id,
        debitAccount: data.debitAccount,
        creditAccount: data.creditAccount,
        amount: data.amount,
      });

      return { ...ledgerResult, score, block };
    });

    // Return the exact envelope format
    return NextResponse.json({
      success: true,
      data: {
        transactionId: res.txn.id,
        journalEntries: [
          { accountName: res.jDebit.accountName, entryType: res.jDebit.entryType, amount: res.jDebit.amount },
          { accountName: res.jCredit.accountName, entryType: res.jCredit.entryType, amount: res.jCredit.amount }
        ],
        ledgerSummary: {
          cashBalance: res.snapshot.cashBalance,
          expenseTotal: res.snapshot.expenseTotal,
          priveTotal: res.snapshot.priveTotal
        },
        scoreSnapshot: {
          totalScore: res.score.totalScore,
          factors: [
            { id: "consistency", name: "Konsistensi Pencatatan", delta: res.score.factorConsistency },
            { id: "separation", name: "Disiplin Pemisahan SAK", delta: res.score.factorSeparation },
            { id: "cashflow", name: "Stabilitas Arus Kas", delta: res.score.factorCashflow }
          ]
        },
        vaultBlock: {
          blockIndex: res.block.blockIndex,
          transactionId: res.block.transactionId,
          canonicalPayload: res.block.canonicalPayload,
          prevHash: res.block.prevHash,
          hash: res.block.hash
        }
      }
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Gagal melakukan commit ke ledger",
          details: {}
        }
    }, { status: 500 });
  }
}
