import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";

// GET → ambil semua user beserta nama rolenya
export async function GET() {
  try {
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
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ users: data });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → hapus user berdasarkan ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { error } = await backendSupabase
      .from("user_list")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH → update role atau deskripsi user
export async function PATCH(req: Request) {
  try {
    const { id, roles_id, description } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
