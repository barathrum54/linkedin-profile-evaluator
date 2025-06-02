import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Debug Session API - Session:", session);

    return NextResponse.json({
      session,
      message: "Check server console for detailed session data",
    });
  } catch (error) {
    console.error("Debug Session API - Error:", error);
    return NextResponse.json(
      { error: "Session debug failed" },
      { status: 500 }
    );
  }
}
