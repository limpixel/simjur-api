import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

    const { name, password } = await req.json();
    if (!name || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 🔍 Debug: log username
    console.log("LOGIN attempt for:", name);

    const { data: user, error } = await backendSupabase
      .from("user_list")
      .select("id, name, password, roles_id")
      .ilike("name", name)
      .maybeSingle();

    console.log("SUPABASE RESPONSE:", user, error);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: "Database query error" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, roles_id: user.roles_id },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json({
      message: "Login success",
      token,
      user: { id: user.id, name: user.name, roles_id: user.roles_id },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
