import { backendSupabase } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";
import { verifyTokenFromRequest } from "@/app/lib/auth";
import { timeStamp } from "console";
import bcrypt from "bcryptjs";

// CORS headers helper
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

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
    
    const response = NextResponse.json({ users: data });
    return addCorsHeaders(response);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 500;
    const response = NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
    return addCorsHeaders(response);
  }
}

// POST → tambah user baru
export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);
    
    const { name, email, nim, program_studi, roles_id, description, password } = await req.json();
    
    // Required fields validation
    if (!name || !email || !nim || !program_studi || !roles_id || !password) {
      const response = NextResponse.json(
        { error: "Missing required fields: name, email, nim, program_studi, roles_id, password" },
        { status: 400 },
      );
      return addCorsHeaders(response);
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response = NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      return addCorsHeaders(response);
    }
    
    // Check for existing email
    const { data: existingEmail } = await backendSupabase
      .from("user_list")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    
    if (existingEmail) {
      const response = NextResponse.json({ error: "Email already exists" }, { status: 409 });
      return addCorsHeaders(response);
    }
    
    // Check for existing NIM
    const { data: existingNim } = await backendSupabase
      .from("user_list")
      .select("nim")
      .eq("nim", nim)
      .maybeSingle();
    
    if (existingNim) {
      const response = NextResponse.json({ error: "NIM already exists" }, { status: 409 });
      return addCorsHeaders(response);
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
    
    const response = NextResponse.json({
      message: "User created successfully",
      user: data[0],
    });
    return addCorsHeaders(response);
  } catch (err: any) {
    const response = NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toString(),
      },
      { status: err.status || 500 },
    );
    return addCorsHeaders(response);
  }
}

// DELETE → hapus user berdasarkan ID
export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await req.json();
    if (!id) {
      const response = NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
      return addCorsHeaders(response);
    }
    const { error } = await backendSupabase
      .from("user_list")
      .delete()
      .eq("id", id);
    if (error) throw error;
    
    const response = NextResponse.json({ message: "User deleted successfully" });
    return addCorsHeaders(response);
  } catch (err: any) {
    console.error("Error deleting user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    const response = NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
    return addCorsHeaders(response);
  }
}

// PATCH → update user data (partial update)
export async function PATCH(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id, name, email, nim, program_studi, roles_id, description } = await req.json();
    if (!id) {
      const response = NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
      return addCorsHeaders(response);
    }
    
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const response = NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        return addCorsHeaders(response);
      }
      
      // Check for existing email (excluding current user)
      const { data: existingEmail } = await backendSupabase
        .from("user_list")
        .select("email")
        .eq("email", email)
        .neq("id", id)
        .maybeSingle();
      
      if (existingEmail) {
        const response = NextResponse.json({ error: "Email already exists" }, { status: 409 });
        return addCorsHeaders(response);
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
        const response = NextResponse.json({ error: "NIM already exists" }, { status: 409 });
        return addCorsHeaders(response);
      }
      
      updateData.nim = nim;
    }
    
    if (program_studi) updateData.program_studi = program_studi;
    if (roles_id) updateData.roles_id = roles_id;
    if (description !== undefined) updateData.description = description;
    
    if (Object.keys(updateData).length === 0) {
      const response = NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
      return addCorsHeaders(response);
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
    
    const response = NextResponse.json({ 
      message: "User updated successfully", 
      user: data 
    });
    return addCorsHeaders(response);
  } catch (err: any) {
    console.error("Error updating user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    const response = NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
    return addCorsHeaders(response);
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}
