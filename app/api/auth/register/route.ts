import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, nim, program_studi, roles_id, description, password } = await req.json();

    // Required fields validation
    if (!name || !email || !nim || !program_studi || !roles_id || !password) {
      return NextResponse.json({ error: "Missing required fields: name, email, nim, program_studi, roles_id, password" }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check for existing email
    const { data: existingEmail } = await supabase
      .from("user_list")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Check for existing NIM
    const { data: existingNim } = await supabase
      .from("user_list")
      .select("nim")
      .eq("nim", nim)
      .maybeSingle();

    if (existingNim) {
      return NextResponse.json({ error: "NIM already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("user_list")
      .insert([{ 
        name, 
        email, 
        nim, 
        program_studi, 
        roles_id, 
        description: description || null, 
        password: hashedPassword 
      }])
      .select(`
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id
      `);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully", user: data[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
