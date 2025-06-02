import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { hashPassword } from "@/lib/auth";

// MongoDB connection (same pattern as auth.ts)
const client = new MongoClient(process.env.MONGODB_URI as string);
const clientPromise = client.connect();

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json();

    // Validation
    if (!token || !email || !password) {
      return NextResponse.json(
        { message: "Token, email ve şifre gereklidir." },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // Basic password strength validation
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          message:
            "Şifre en az bir büyük harf, küçük harf, rakam ve özel karakter içermelidir.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const tokens = client.db().collection("password_reset_tokens");
    const users = client.db().collection("users");

    // Check if token exists and is not expired
    const resetToken = await tokens.findOne({
      email: email.toLowerCase().trim(),
      token,
      expiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Geçersiz veya süresi dolmuş token." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    const updateResult = await users.updateOne(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Remove the used token
    await tokens.deleteOne({ _id: resetToken._id });

    // Remove all other tokens for this email (security measure)
    await tokens.deleteMany({ email: email.toLowerCase().trim() });

    return NextResponse.json(
      { success: true, message: "Şifre başarıyla güncellendi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Şifre sıfırlanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
