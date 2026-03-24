import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: { database: "connected", api: "running" },
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNHEALTHY",
          message: "Database connection failed",
          details: {},
        },
      },
      { status: 503 }
    );
  }
}
