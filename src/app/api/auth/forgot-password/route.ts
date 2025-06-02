import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { mailService } from "@/lib/mail-v2";
import { MongoClient } from "mongodb";
import crypto from "crypto";

// MongoDB connection (same pattern as auth.ts)
const client = new MongoClient(process.env.MONGODB_URI as string);
const clientPromise = client.connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email adresi gereklidir." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Geçerli bir email adresi girin." },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email.toLowerCase().trim());

    // For security reasons, we always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Eğer bu email adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderilecektir.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await storePasswordResetToken(user.email, resetToken, resetTokenExpiry);

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Send password reset email using template
    const emailResult = await mailService.sendPasswordResetEmail(
      user.email,
      resetUrl
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          message:
            "Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Şifre sıfırlama bağlantısı email adresinize gönderildi.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Şifre sıfırlama isteği işlenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Helper function to store password reset token
async function storePasswordResetToken(
  email: string,
  token: string,
  expiry: Date
) {
  try {
    const client = await clientPromise;
    const tokens = client.db().collection("password_reset_tokens");

    // Remove any existing tokens for this email
    await tokens.deleteMany({ email });

    // Store new token
    await tokens.insertOne({
      email,
      token,
      expiry,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error storing password reset token:", error);
    throw error;
  }
}
