import { NextResponse } from "next/server";
import { VaultRepository } from "@/server/repositories/vault.repository";
import { TransactionRepository } from "@/server/repositories/transaction.repository";
import crypto from "crypto";

export async function GET() {
  try {
    const blocks = await VaultRepository.getEntireChainAsc();

    if (blocks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          isValid: true,
          tamperedBlockIndex: null,
          message: "No blocks in chain to verify"
        }
      });
    }

    // Iterate through blocks and verify
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Genesis block verify
      if (i === 0) {
        const hash = crypto.createHash("sha256").update(block.canonicalPayload).digest("hex");
        if (hash !== block.hash) {
          return NextResponse.json({
            success: true,
            data: {
              isValid: false,
              tamperedBlockIndex: 0,
              message: "Hash mismatch detected at Genesis Block"
            }
          });
        }
        continue;
      }

      // 1. Verify links
      const prevBlock = blocks[i - 1];
      if (block.prevHash !== prevBlock.hash) {
        return NextResponse.json({
          success: true,
          data: {
            isValid: false,
            tamperedBlockIndex: block.blockIndex,
            message: `Broken chain link detected at block ${block.blockIndex}: prevHash does not match previous block hash`
          }
        });
      }

      // 2. Rebuild canonical payload and compare with relational datastore
      if (block.transactionId) {
        const txn = await TransactionRepository.findById(block.transactionId);
        if (!txn) {
          return NextResponse.json({
            success: true,
            data: {
              isValid: false,
              tamperedBlockIndex: block.blockIndex,
              message: `Orphaned block ${block.blockIndex}: underlying transaction not found`
            }
          });
        }

        const expectedCanonical = `${block.blockIndex}|${txn.id}|${block.prevHash}|${txn.debitAccount}|${txn.creditAccount}|${txn.amount}`;
        
        if (expectedCanonical !== block.canonicalPayload) {
          return NextResponse.json({
            success: true,
            data: {
              isValid: false,
              tamperedBlockIndex: block.blockIndex,
              message: `Relational data mismatch detected at block ${block.blockIndex}. Database tamper evident.`
            }
          });
        }

        const expectedHash = crypto.createHash("sha256").update(expectedCanonical).digest("hex");
        if (expectedHash !== block.hash) {
           return NextResponse.json({
            success: true,
            data: {
              isValid: false,
              tamperedBlockIndex: block.blockIndex,
              message: `Hash computation mismatch detected at block ${block.blockIndex}`
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        isValid: true,
        tamperedBlockIndex: null,
        message: "Hash chain verification passed securely."
      }
    });

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to verify vault chain",
          details: {}
        }
    }, { status: 500 });
  }
}
