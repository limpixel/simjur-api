import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { data, error } = await backendSupabase
      .from("roles_table")
      .select("*")
      .eq("id_roles", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ role: data });
  } catch (err: any) {
    console.error("Error fetching role:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;
    const { name_roles, keterangan } = await req.json();

    if (!name_roles || !keterangan) {
      return NextResponse.json(
        { error: "name_roles and keterangan are required" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("roles_table")
      .update({
        name_roles,
        keterangan
      })
      .eq("id_roles", id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: "Role name already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "Role updated successfully", 
      role: data 
    });
  } catch (err: any) {
    console.error("Error updating role:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;
    const { name_roles, keterangan } = await req.json();

    const updateData: any = {};
    if (name_roles) updateData.name_roles = name_roles;
    if (keterangan) updateData.keterangan = keterangan;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const { data, error } = await backendSupabase
      .from("roles_table")
      .update(updateData)
      .eq("id_roles", id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: "Role name already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "Role updated successfully", 
      role: data 
    });
  } catch (err: any) {
    console.error("Error updating role:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    // Cek apakah role masih digunakan oleh user
    const { data: usersWithRole, error: checkError } = await backendSupabase
      .from("user_list")
      .select("id")
      .eq("roles_id", id)
      .limit(1);

    if (checkError) throw checkError;

    if (usersWithRole && usersWithRole.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete role that is still in use by users" },
        { status: 400 }
      );
    }

    const { error } = await backendSupabase
      .from("roles_table")
      .delete()
      .eq("id_roles", id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting role:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}