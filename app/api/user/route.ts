import { backendSupabase } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";
import { verifyTokenFromRequest } from "@/app/lib/auth";
import { timeStamp } from "console";
import bcrypt from "bcryptjs";
// GET → ambil semua user beserta nama rolenya
export async function GET(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { data, error } = await backendSupabase
      .from("user_list")
      .select(
        `
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,

        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `,
      )
      .order("id", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ users: data });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 500;
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}

// POST → tambah user baru
export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { name, email, nim, program_studi, roles_id, description, password } = await req.json();

    // Required fields validation
    if (!name || !email || !nim || !program_studi || !roles_id || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, nim, program_studi, roles_id, password" },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check for existing email
    const { data: existingEmail } = await backendSupabase
      .from("user_list")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Check for existing NIM
    const { data: existingNim } = await backendSupabase
      .from("user_list")
      .select("nim")
      .eq("nim", nim)
      .maybeSingle();

    if (existingNim) {
      return NextResponse.json({ error: "NIM already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await backendSupabase
      .from("user_list")
      .insert({
        name,
        email,
        nim,
        program_studi,
        roles_id,
        description: description || null,
        password: hashedPassword,
      })
      .select(`
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `);

    if (error) throw error;

    return NextResponse.json({
      message: "User created successfully",
      user: data[0],
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toString(),
      },
      { status: err.status || 500 },
    );
  }
}

// DELETE → hapus user berdasarkan ID
export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }
    const { error } = await backendSupabase
      .from("user_list")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}
// PATCH → update user data (partial update)
export async function PATCH(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id, name, email, nim, program_studi, roles_id, description } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
      
      // Check for existing email (excluding current user)
      const { data: existingEmail } = await backendSupabase
        .from("user_list")
        .select("email")
        .eq("email", email)
        .neq("id", id)
        .maybeSingle();

      if (existingEmail) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      
      updateData.email = email;
    }
    
    if (nim) {
      // Check for existing NIM (excluding current user)
      const { data: existingNim } = await backendSupabase
        .from("user_list")
        .select("nim")
        .eq("nim", nim)
        .neq("id", id)
        .maybeSingle();

      if (existingNim) {
        return NextResponse.json({ error: "NIM already exists" }, { status: 409 });
      }
      
      updateData.nim = nim;
    }
    
    if (program_studi) updateData.program_studi = program_studi;
    if (roles_id) updateData.roles_id = roles_id;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("user_list")
      .update(updateData)
      .eq("id", id)
      .select(`
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `)
      .single();

    if (error) throw error;
    
    return NextResponse.json({ 
      message: "User updated successfully", 
      user: data 
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}
