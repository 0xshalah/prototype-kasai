import { ApiResponse } from "./transaction";

export type VaultBlockItem = {
  blockIndex: number;
  transactionId: string;
  canonicalPayload: string;
  prevHash: string;
  hash: string;
};

export type VaultChainData = {
  items: VaultBlockItem[];
};

export type VerifyAuditData = {
  isValid: boolean;
  tamperedBlockIndex: number | null;
  message: string;
};

export type DemoTamperData = {
  tamperedBlockIndex: number;
  oldAmount: number;
  newAmount: number;
};

export async function getVaultChain(limit: number = 50): Promise<ApiResponse<VaultChainData>> {
  const res = await fetch(`/api/audit/chain?limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });
  return res.json();
}

export async function verifyAudit(): Promise<ApiResponse<VerifyAuditData>> {
  const res = await fetch("/api/audit/verify", {
    method: "GET",
    cache: "no-store",
  });
  return res.json();
}

export async function demoTamper(): Promise<ApiResponse<DemoTamperData>> {
  const res = await fetch("/api/demo/tamper", {
    method: "POST",
  });
  return res.json();
}
