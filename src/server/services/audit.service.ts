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
    const blocks = await this.prisma.vaultBlock.findMany({
      take: 1000,
      orderBy: { blockIndex: "asc" }
    });

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

    await this.prisma.auditEvent.create({
      data: {
        eventType: valid ? "VERIFY_PASSED" : "VERIFY_FAILED",
        targetBlockIndex: firstBrokenBlock !== null ? firstBrokenBlock : undefined,
        message: valid
          ? "Audit verify passed: chain is valid"
          : `Audit verify failed starting from block #${firstBrokenBlock} for business ${businessId}`
      }
    });

    return { valid, firstBrokenBlock, invalidBlocks };
  }

  async tamperBlock(input: {
    businessId: string;
    targetBlockIndex: number;
    mode?: "append_amount_digits";
  }) {
    const block = await this.prisma.vaultBlock.findUnique({
      where: { blockIndex: input.targetBlockIndex }
    });
    if (!block) return null;

    const nextCanonicalPayload = `${block.canonicalPayload}99`;

    const updated = await this.prisma.vaultBlock.update({
      where: { id: block.id },
      data: { canonicalPayload: nextCanonicalPayload }
    });

    await this.prisma.auditEvent.create({
      data: {
        eventType: "TAMPER_SIMULATED",
        targetBlockIndex: input.targetBlockIndex,
        message: `Tamper simulated on block #${input.targetBlockIndex} for business ${input.businessId}`,
      }
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
