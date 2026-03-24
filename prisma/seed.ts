import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // Demo Business info
  const DEMO_BUSINESS_ID = 'biz_demo_001';

  // Clear existing items
  await prisma.auditEvent.deleteMany();
  await prisma.vaultBlock.deleteMany();
  await prisma.scoreSnapshot.deleteMany();
  await prisma.balanceSnapshot.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.transaction.deleteMany();

  console.log('Database cleared.');

  // Create Genesis Vault Block
  const genesisPayload = "0|GENESIS|SYSTEM|SYSTEM|0";
  const genesisHash = crypto.createHash('sha256').update(genesisPayload).digest('hex');

  const genesisBlock = await prisma.vaultBlock.create({
    data: {
      blockIndex: 0,
      canonicalPayload: genesisPayload,
      prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: genesisHash,
    }
  });

  console.log(`Created Genesis Block (Hash: ${genesisBlock.hash})`);

  // Create initial balance
  await prisma.balanceSnapshot.create({
    data: {
      businessId: DEMO_BUSINESS_ID,
      cashBalance: 5000000,
      expenseTotal: 0,
      priveTotal: 0,
    }
  });

  console.log('Created Initial Balance Snapshot');
  console.log('Seed completed successfully for demo business.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
