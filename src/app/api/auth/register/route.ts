import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tüm alanlar gereklidir." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: "Ad Soyad en az 2 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Şifre en az 8 karakter olmalıdır." },
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

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi ile zaten bir hesap bulunmaktadır." },
        { status: 409 }
      );
    }

    // Create user
    await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    return NextResponse.json(
      { message: "Hesabınız başarıyla oluşturuldu." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Hesap oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
