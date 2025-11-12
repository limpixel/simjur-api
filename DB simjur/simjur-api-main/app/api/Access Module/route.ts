import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";

// GET → ambil semua akses role ke module
export async function GET() {
  try {
    const { data, error } = await backendSupabase
      .from("access_module")
      .select(`
        id,
        role_id,
        module_id,
        can_view,
        can_create,
        can_edit,
        can_delete,
        module(id, module_name, description)
      `)
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ access_modules: data });
  } catch (err: any) {
    console.error("Error fetching access modules:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST → tambahin akses baru
export async function POST(req: Request) {
  try {
    const { role_id, module_id, can_view, can_create, can_edit, can_delete } = await req.json();

    if (!role_id || !module_id) {
      return NextResponse.json({ error: "Role ID and Module ID are required" }, { status: 400 });
    }

    const { data, error } = await backendSupabase
      .from("access_module")
      .insert([
        {
          role_id,
          module_id,
          can_view: !!can_view,
          can_create: !!can_create,
          can_edit: !!can_edit,
          can_delete: !!can_delete,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Access added successfully", access: data });
  } catch (err: any) {
    console.error("Error adding access:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT → update permission
export async function PUT(req: Request) {
  try {
    const { id, can_view, can_create, can_edit, can_delete } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Access ID is required" }, { status: 400 });
    }

    const { data, error } = await backendSupabase
      .from("access_module")
      .update({
        can_view,
        can_create,
        can_edit,
        can_delete,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Access updated successfully", access: data });
  } catch (err: any) {
    console.error("Error updating access:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → hapus akses
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Access ID is required" }, { status: 400 });
    }

    const { error } = await backendSupabase
      .from("access_module")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Access deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting access:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
