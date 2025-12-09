import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    // 🔍 Debug: log login attempt
    console.log("LOGIN attempt for:", identifier);

    const { data: user, error } = await backendSupabase
      .from("user_list")
      .select("id, name, email, nim, password, roles_id, program_studi")
      .or(`name.eq.${identifier},email.eq.${identifier},nim.eq.${identifier}`)
      .maybeSingle();

    console.log("SUPABASE RESPONSE:", user, error);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Database query error" },
        { status: 500 },
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        nim: user.nim,
        roles_id: user.roles_id,
      },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    return NextResponse.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nim: user.nim,
        program_studi: user.program_studi,
        roles_id: user.roles_id,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
