import { prisma } from "@/lib/db/prisma";

export async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.tradeQuote.count();
  return `Q-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.tradeOrder.count();
  return `O-${year}-${String(count + 1).padStart(4, "0")}`;
}
