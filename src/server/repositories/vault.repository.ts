import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CreateVaultBlockDTO = {
  blockIndex: number;
  transactionId?: string | null;
  canonicalPayload: string;
  prevHash: string;
  hash: string;
};

export class VaultRepository {
  /**
   * Retrieves the most recently added block to find the tip of the chain.
   */
  static async getLatestBlock(tx: Prisma.TransactionClient = prisma) {
    return tx.vaultBlock.findFirst({
      orderBy: { blockIndex: "desc" },
    });
  }

  /**
   * Creates a new vault block in the chain.
   */
  static async createBlock(
    data: CreateVaultBlockDTO,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.vaultBlock.create({
      data: {
        blockIndex: data.blockIndex,
        transactionId: data.transactionId,
        canonicalPayload: data.canonicalPayload,
        prevHash: data.prevHash,
        hash: data.hash,
      },
    });
  }

  /**
   * Retrieves a list of recent blocks.
   */
  static async findBlocks(limit: number = 50) {
    return prisma.vaultBlock.findMany({
      take: limit,
      orderBy: { blockIndex: "desc" },
    });
  }

  /**
   * Retrieves the entire chain in ascending order for verification.
   */
  static async getEntireChainAsc() {
    return prisma.vaultBlock.findMany({
      orderBy: { blockIndex: "asc" },
    });
  }
}
