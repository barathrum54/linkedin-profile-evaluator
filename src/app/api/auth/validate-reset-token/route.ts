import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection (same pattern as auth.ts)
const client = new MongoClient(process.env.MONGODB_URI as string);
const clientPromise = client.connect();

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { valid: false, message: "Token ve email gereklidir." },
        { status: 400 }
      );
    }

    // Check if token exists and is not expired
    const client = await clientPromise;
    const tokens = client.db().collection("password_reset_tokens");

    const resetToken = await tokens.findOne({
      email: email.toLowerCase().trim(),
      token,
      expiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, message: "Geçersiz veya süresi dolmuş token." },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Token doğrulanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
