import { createHash } from "crypto";
import type { PrismaClient } from "@prisma/client";
import { VaultRepository } from "../repositories/vault.repository";
import { TransactionRepository } from "../repositories/transaction.repository";

const GENESIS_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  private sha256Hex(value: string) {
    return createHash("sha256").update(value, "utf8").digest("hex");
  }

  async verifyChain(businessId: string) {
    const vaultRepo = new VaultRepository(this.prisma);
    const txRepo = new TransactionRepository(this.prisma);

    const blocks = await vaultRepo.getChain(businessId, 1000);

    if (blocks.length === 0) {
      return { valid: true, firstBrokenBlock: null as number | null, invalidBlocks: [] as number[] };
    }

    let expectedPrev = GENESIS_HASH;
    let firstBrokenBlock: number | null = null;
    const invalidBlocks: number[] = [];

    for (const block of blocks) {
      const linkageBroken = block.prevHash !== expectedPrev;
      const recalculatedHash = this.sha256Hex(block.canonicalPayload);
      const digestBroken = recalculatedHash !== block.hash;

      if (linkageBroken || digestBroken) {
        if (firstBrokenBlock === null) {
          firstBrokenBlock = block.blockIndex;
        }
        invalidBlocks.push(block.blockIndex);
      } else if (firstBrokenBlock !== null) {
        invalidBlocks.push(block.blockIndex);
      }

      expectedPrev = block.hash;
    }

    const valid = firstBrokenBlock === null;

    await txRepo.createAuditEvent({
      businessId,
      eventType: valid ? "VERIFY_PASSED" : "VERIFY_FAILED",
      message: valid
        ? "Audit verify passed: chain is valid"
        : `Audit verify failed starting from block #${firstBrokenBlock}`,
      metadata: { valid, firstBrokenBlock, invalidBlocks },
    });

    return { valid, firstBrokenBlock, invalidBlocks };
  }

  async tamperBlock(input: {
    businessId: string;
    targetBlockIndex: number;
    mode?: "append_amount_digits";
  }) {
    const vaultRepo = new VaultRepository(this.prisma);
    const txRepo = new TransactionRepository(this.prisma);

    const block = await vaultRepo.getBlockByIndex(input.businessId, input.targetBlockIndex);
    if (!block) return null;

    const nextCanonicalPayload = `${block.canonicalPayload}99`;

    const updated = await vaultRepo.updateBlockCanonicalPayload({
      id: block.id,
      canonicalPayload: nextCanonicalPayload,
    });

    await txRepo.createAuditEvent({
      businessId: input.businessId,
      eventType: "TAMPER_SIMULATED",
      message: `Tamper simulated on block #${input.targetBlockIndex}`,
      metadata: {
        mode: input.mode ?? "append_amount_digits",
        originalCanonicalPayload: block.canonicalPayload,
        tamperedCanonicalPayload: nextCanonicalPayload,
      },
    });

    return {
      blockIndex: updated.blockIndex,
      transactionId: updated.transactionId,
      originalCanonicalPayload: block.canonicalPayload,
      tamperedCanonicalPayload: updated.canonicalPayload,
      hash: updated.hash,
    };
  }
}
