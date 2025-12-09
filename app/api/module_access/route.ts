import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

// GET → ambil semua akses module beserta nama role & nama module
export async function GET(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { data, error } = await backendSupabase
      .from("access_module")
      .select(
        `
        id,
        role_id,
        module_id,
        can_view,
        can_create,
        can_edit,
        can_delete,
        roles_table (id_roles, name_roles),
        modules (id, module_name)
      `,
      )
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ access: data });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        timestamp: new Date().toString(),
      },
      { status: err.status || 500 },
    );
  }
}

// POST → Tambah access module
export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const {
      role_id,
      module_id,
      can_view = false,
      can_create = false,
      can_edit = false,
      can_delete = false,
    } = await req.json();

    if (!role_id || !module_id) {
      return NextResponse.json(
        { error: "role_id and module_id are required" },
        { status: 400 },
      );
    }

    const { data, error } = await backendSupabase
      .from("access_module")
      .insert([
        {
          role_id,
          module_id,
          can_view,
          can_create,
          can_edit,
          can_delete,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Access module created successfully",
      access: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH → Update akses module
export async function PATCH(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { id, can_view, can_create, can_edit, can_delete } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (can_view !== undefined) updateData.can_view = can_view;
    if (can_create !== undefined) updateData.can_create = can_create;
    if (can_edit !== undefined) updateData.can_edit = can_edit;
    if (can_delete !== undefined) updateData.can_delete = can_delete;

    const { data, error } = await backendSupabase
      .from("access_module")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Access module updated successfully",
      access: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → Hapus akses module
export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await backendSupabase
      .from("access_module")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      message: "Access module deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
