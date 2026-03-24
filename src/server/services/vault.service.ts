import { Prisma } from "@prisma/client";
import { VaultRepository } from "@/server/repositories/vault.repository";
import crypto from "crypto";

export class VaultService {
  static async appendBlock(
    tx: Prisma.TransactionClient,
    data: {
      transactionId: string;
      debitAccount: string;
      creditAccount: string;
      amount: number;
    }
  ) {
    let lastBlock = await VaultRepository.getLatestBlock(tx);

    if (!lastBlock) {
      // Fallback genesis if missing
      const genesisPayload = "0|GENESIS|SYSTEM|SYSTEM|0";
      const genesisHash = crypto.createHash("sha256").update(genesisPayload).digest("hex");
      lastBlock = await VaultRepository.createBlock({
          blockIndex: 0,
          canonicalPayload: genesisPayload,
          prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
          hash: genesisHash,
        }, tx);
    }

    const nextBlockIndex = lastBlock.blockIndex + 1;
    const canonicalPayload = `${nextBlockIndex}|${data.transactionId}|${lastBlock.hash}|${data.debitAccount}|${data.creditAccount}|${data.amount}`;
    const hash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

    const block = await VaultRepository.createBlock({
        blockIndex: nextBlockIndex,
        transactionId: data.transactionId,
        canonicalPayload,
        prevHash: lastBlock.hash,
        hash,
      }, tx);

    return block;
  }
}
