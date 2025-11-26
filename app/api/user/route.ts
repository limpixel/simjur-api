import { backendSupabase } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";
import { verifyTokenFromRequest } from "@/app/lib/auth";
import { timeStamp } from "console";
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
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `
      )
      .order("id", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ users: data });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 500;
    return NextResponse.json({ 
      error: err.message,
      code : errorCode,
      timeStamp : new Date().toString()
    }, { status: statusCode });
  }
}

// POST → tambah role baru
export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { name_roles, keterangan } = await req.json();

    // Validasi input
    if (!name_roles) {
      return NextResponse.json(
        { error: "name_roles wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("roles_table")
      .insert({
        name_roles,
        keterangan: keterangan || null,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: "Role created successfully",
      role: data[0],
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toString(),
      },
      { status: err.status || 500 }
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
        { status: 400 }
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
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp : new Date().toString()
    }, { status: statusCode });
  }
}
// PATCH → update role atau deskripsi user
export async function PATCH(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id, roles_id, description } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const updateData: any = {};
    if (roles_id) updateData.roles_id = roles_id;
    if (description) updateData.description = description;
    const { error } = await backendSupabase
      .from("user_list")
      .update(updateData)
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "User updated successfully" });
  } catch (err: any) {
    console.error("Error updating user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code : errorCode,
      timeStamp : new Date().toString()
    }, { status: statusCode });
  }
}
