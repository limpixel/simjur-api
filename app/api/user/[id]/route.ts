import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

// GET → ambil user berdasarkan ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { data, error } = await backendSupabase
      .from("user_list")
      .select(`
        id,
        name,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (err: any) {
    console.error("Error fetching user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

// PUT → update user berdasarkan ID (replace all fields)
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;
    const { name, description, roles_id } = await req.json();

    if (!name || !roles_id) {
      return NextResponse.json(
        { error: "Name and roles_id are required" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("user_list")
      .update({
        name,
        description: description || null,
        roles_id,
        updated_at: new Date()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "User updated successfully", 
      user: data 
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

// PATCH → update user berdasarkan ID (partial update)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;
    const { name, description, roles_id } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (roles_id) updateData.roles_id = roles_id;
    updateData.updated_at = new Date();

    if (Object.keys(updateData).length === 1) { // hanya updated_at
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("user_list")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "User updated successfully", 
      user: data 
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

// DELETE → hapus user berdasarkan ID
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { error } = await backendSupabase
      .from("user_list")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}